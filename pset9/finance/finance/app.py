import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup, usd

# Configure application
app = Flask(__name__)

# Set secret key for sessions
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret")

# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database (absolute path)
db_path = os.path.join(os.path.dirname(__file__), "finance.db")
db = SQL(f"sqlite:///{db_path}")

# create transactions table if it doesn't exist
db.execute(
    """
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        symbol TEXT NOT NULL,
        shares INTEGER NOT NULL,
        price NUMERIC NOT NULL,
        transacted DATETIME DEFAULT CURRENT_TIMESTAMP,
        type TEXT NOT NULL
    )
    """
)


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    user_id = session.get("user_id")

    # current cash
    rows = db.execute("SELECT cash FROM users WHERE id = ?", user_id)
    cash = rows[0]["cash"] if rows else 0

    # aggregate holdings
    holdings = db.execute(
        "SELECT symbol, SUM(shares) AS shares FROM transactions WHERE user_id = ? GROUP BY symbol HAVING shares > 0",
        user_id,
    )

    portfolio = []
    stocks_total = 0
    for h in holdings:
        symbol = h["symbol"]
        shares = h["shares"]
        quote_data = lookup(symbol)
        price = quote_data["price"] if quote_data else 0
        value = shares * price
        stocks_total += value
        portfolio.append({"symbol": symbol, "shares": shares, "price": price, "value": value})

    grand_total = stocks_total + cash
    return render_template("index.html", portfolio=portfolio, cash=cash, total=grand_total)


@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    """Buy shares of stock"""
    user_id = session.get("user_id")

    if request.method == "GET":
        return render_template("buy.html")

    symbol = request.form.get("symbol")
    shares_str = request.form.get("shares")

    if not symbol:
        return apology("must provide symbol", 400)

    # validate shares
    try:
        shares = int(shares_str)
        if shares <= 0:
            raise ValueError
    except Exception:
        return apology("invalid number of shares", 400)

    quote_data = lookup(symbol)
    if not quote_data:
        return apology("invalid symbol", 400)

    price = quote_data["price"]
    cost = shares * price

    # check user's cash
    rows = db.execute("SELECT cash FROM users WHERE id = ?", user_id)
    cash = rows[0]["cash"] if rows else 0
    if cost > cash:
        return apology("can't afford", 400)

    # record transaction
    db.execute(
        "INSERT INTO transactions (user_id, symbol, shares, price, type) VALUES (?, ?, ?, ?, ?)",
        user_id,
        symbol.upper(),
        shares,
        price,
        "BUY",
    )

    # update cash
    db.execute("UPDATE users SET cash = cash - ? WHERE id = ?", cost, user_id)

    return redirect("/")


@app.route("/history")
@login_required
def history():
    """Show history of transactions"""
    user_id = session.get("user_id")
    rows = db.execute(
        "SELECT symbol, shares, price, transacted, type FROM transactions WHERE user_id = ? ORDER BY transacted DESC",
        user_id,
    )
    return render_template("history.html", rows=rows)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        data = {}
        # prefer JSON if provided
        try:
            if request.is_json:
                json_data = request.get_json(silent=True) or {}
                if isinstance(json_data, dict):
                    data.update(json_data)
        except Exception:
            # ignore JSON parsing errors
            pass

        # merge form/query values
        data.update(request.values.to_dict())

        # Normalize keys
        username = (data.get("username") or data.get("user") or "").strip()
        password = (data.get("password") or "").strip()

        if not username:
            return apology("must provide username", 400)

        # Ensure password was submitted
        if not password:
            return apology("must provide password", 400)

        # Query database for username
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", username
        )

        # Ensure username exists and password is correct
        if len(rows) != 1:
            return apology("invalid username and/or password", 400)

        try:
            valid = check_password_hash(rows[0]["hash"], password)
        except Exception:
            # fallback: if hash format unsupported, attempt direct compare (lenient)
            stored = rows[0]["hash"] or ""
            valid = (password == stored)

        if not valid:
            return apology("invalid username and/or password", 400)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect to index so index view computes portfolio context
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():
    """Get stock quote."""
    if request.method == "GET":
        return render_template("quote.html")

    symbol = request.form.get("symbol")
    if not symbol:
        return apology("must provide symbol", 400)

    quote_data = lookup(symbol)
    if not quote_data:
        return apology("invalid symbol", 400)

    return render_template("quoted.html", quote=quote_data)


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        if not username:
            return apology("must provide username", 400)

        if not password:
            return apology("must provide password", 400)

        if not confirmation:
            return apology("must confirm password", 400)

        if password != confirmation:
            return apology("passwords do not match", 400)

        existing = db.execute(
            "SELECT id FROM users WHERE username = ?", username
        )

        if existing:
            return apology("username already exists", 400)

        password_hash = generate_password_hash(password)

        user_id = db.execute(
            "INSERT INTO users (username, hash) VALUES (?, ?)",
            username,
            password_hash,
        )

        # Log user in by saving user id to session and redirect to portfolio
        session["user_id"] = user_id
        return redirect("/")

    return render_template("register.html")


@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    """Sell shares of stock"""
    user_id = session.get("user_id")

    if request.method == "GET":
        holdings = db.execute(
            "SELECT symbol, SUM(shares) AS shares FROM transactions WHERE user_id = ? GROUP BY symbol HAVING shares > 0",
            user_id,
        )
        return render_template("sell.html", holdings=holdings)

    symbol = request.form.get("symbol")
    shares_str = request.form.get("shares")
    if not symbol:
        return apology("must provide symbol", 400)

    try:
        shares = int(shares_str)
        if shares <= 0:
            raise ValueError
    except Exception:
        return apology("invalid number of shares", 400)

    # compute owned shares
    rows = db.execute(
        "SELECT SUM(shares) AS shares FROM transactions WHERE user_id = ? AND symbol = ?",
        user_id,
        symbol,
    )
    owned = rows[0]["shares"] if rows and rows[0]["shares"] else 0
    if shares > owned:
        return apology("too many shares", 400)

    quote_data = lookup(symbol)
    if not quote_data:
        return apology("invalid symbol", 400)

    price = quote_data["price"]
    # insert negative shares to denote sale
    db.execute(
        "INSERT INTO transactions (user_id, symbol, shares, price, type) VALUES (?, ?, ?, ?, ?)",
        user_id,
        symbol.upper(),
        -shares,
        price,
        "SELL",
    )

    # update cash
    db.execute("UPDATE users SET cash = cash + ? WHERE id = ?", shares * price, user_id)

    return redirect("/")
