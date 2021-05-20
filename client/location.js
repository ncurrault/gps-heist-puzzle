var currLoc = null, homeLoc = null;

function updatePos(position) {
    if (homeLoc === null) {
        homeLoc = position.coords;
    }
    currLoc = position.coords;
}
function resetHome() {
    homeLoc = currLoc;
}

function queryLocation() {
    navigator.geolocation.getCurrentPosition(updatePos,
        (e) => { alert("location error: " + e.message); },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

function setup() {
    // alert user if their browser is unsupported
    if (! navigator.geolocation) {
        alert("Your browser doesn't support Geolocation :(");
        return false;
    }

    // catch errors with permissions, HTTPS, etc.
    queryLocation();

    // TODO setup location watcher:
    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
}

export {updatePos, resetHome, queryLocation, setup, currLoc, homeLoc};
