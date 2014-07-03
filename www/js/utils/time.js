window.performance = window.performance || {};
performance.now = (function() {
    return performance.now       ||
        performance.mozNow    ||
        performance.msNow     ||
        performance.oNow      ||
        performance.webkitNow ||            
        Date.now;  /*none found - fallback to browser default */
})();

function sleep(millis, callback) {
    setTimeout(function()
            { callback(); }
    , millis);
}
