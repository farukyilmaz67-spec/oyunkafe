let startTime = 0;

function start() {
    startTime = Date.now();
}

function stop() {
    return Date.now() - startTime;
}

module.exports = {
    start,
    stop
};