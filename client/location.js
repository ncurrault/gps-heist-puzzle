const HIGH_ACCURACY = true;
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

function relativeLoc() {
    // null is returned if we don't have any data (probably shouldn't come up)
    return homeLoc && {
        x: currLoc.longitude - homeLoc.longitude,
        y: homeLoc.latitude - currLoc.latitude // invert so North is -y (up)
    };
}

/**
 * Set up location. If everything with the device/browser/connection is in order,
 * set up a recurring callback (`locChangeCallback`) with the user's position
 * (relative to their home) and call `successCallback` once.
 * If error, call `locErrorCallback` with error message.
 */
function setup(locChangeCallback, locErrorCallback, successCallback) {
    // alert user if their browser is unsupported
    if (! navigator.geolocation) {
        locErrorCallback("Your browser doesn't support Geolocation.");
        return;
    }

    // catch errors with permissions, HTTPS, etc.
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            updatePos(pos); // set initial location

            navigator.geolocation.watchPosition(
                (pos) => {
                    updatePos(pos);
                    locChangeCallback(relativeLoc());
                },
                (err) => { console.log(err); },
                {enableHighAccuracy: HIGH_ACCURACY}
            );

            successCallback();
        },
        (e) => {
            locErrorCallback("Error with initial locate operation: " + e.message);
        },
        {enableHighAccuracy: HIGH_ACCURACY}
    );
}

export {setup, resetHome};
