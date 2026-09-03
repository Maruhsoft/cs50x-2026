import sqlite3

class SQL:
    def __init__(self, uri):
        # support sqlite:///path/to/db
        if uri.startswith("sqlite:///"):
            path = uri.replace("sqlite:///", "")
        else:
            path = uri
        self.conn = sqlite3.connect(path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row

    def execute(self, query, *args):
        cur = self.conn.cursor()
        cur.execute(query, args)
        if query.strip().upper().startswith("SELECT"):
            rows = cur.fetchall()
            return [dict(row) for row in rows]
        else:
            self.conn.commit()
            return cur.lastrowid
