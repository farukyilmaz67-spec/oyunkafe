const RESET = "\x1b[0m";

const COLORS = {
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
    blue: "\x1b[34m",
    gray: "\x1b[90m"
};

function line() {
    console.log("────────────────────────────────────");
}

function title(text) {
    console.log("");
    console.log("====================================");
    console.log(" " + text);
    console.log("====================================");
    console.log("");
}

function info(text) {
    console.log(COLORS.cyan + "ℹ " + text + RESET);
}

function success(text) {
    console.log(COLORS.green + "✔ " + text + RESET);
}

function warning(text) {
    console.log(COLORS.yellow + "▲ " + text + RESET);
}

function error(text) {
    console.log(COLORS.red + "✖ " + text + RESET);
}

module.exports = {
    title,
    info,
    success,
    warning,
    error,
    line
};