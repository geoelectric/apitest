function onEvent(event) {
  var now = new Date();
  var minutes = now.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;
  var seconds = now.getSeconds();
  if (seconds < 10) seconds = "0" + seconds;
  var format = now.getHours() + ":" + minutes + ":" + seconds;
  document.getElementById("lastevent").innerHTML = event.type + " (" +  format + ")";
}

function lock(orientation) {
  if (!window.screen.mozLockOrientation(orientation))
    window.alert("Lock failed for '" + orientation + "'");
}

function update() {
  var hasAPI = (window.screen.mozOrientation !== undefined);
  document.getElementById("hasapi").innerHTML = hasAPI.toString();
  document.getElementById("canlock").innerHTML = (document.mozFullScreen && hasAPI);
  document.getElementById("orientation").innerHTML = window.screen.mozOrientation;
  document.getElementById("canfull").innerHTML = document.mozFullScreenEnabled;
  document.getElementById("isfull").innerHTML = document.mozFullScreen;
}

window.screen.onmozorientationchange = onEvent;
window.document.onmozfullscreenchange = onEvent;
window.document.onmozflulscreenerror = onEvent;
window.setInterval(update, 100);