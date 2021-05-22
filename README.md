# GPS Heist Puzzle

This was a puzzle created for the X-Men stack at [Blacker Hovse](https://blacker.caltech.edu/) [Ditch Day](http://www.admissions.caltech.edu/explore/student-life/traditions-pranks) 2021.
Stackees (underclassmen on the stack) worked together to move around their average
location (determined by cell phone GPS) to reveal an image with a code word that
was required for the next part of the Stack.

## API for Managing the Puzzle
 * **/list**: Retrieve a list of players currently online.
 * **/reset**: Reset the server (and kick everyone off).

## Misc. Notes

 * Only one group can solve the puzzle at a time. That is, everyone logged on will move the same dot.
 * Make sure all players connect via HTTPS (not HTTP). This is required by the Web
 Geolocation API.
 * It is recommended to use cellular data and disable WiFi to ensure that the server connection is not disrupted as the players move through WiFi coverage areas.
