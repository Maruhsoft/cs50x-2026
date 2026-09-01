const button = document.querySelector("#change-message");
const message = document.querySelector("#message");

button.addEventListener("click", () => {
    message.textContent =
        "JavaScript is working! Thanks for visiting.";
    button.textContent = "Done!";
});
