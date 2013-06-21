'use strict';

function selfTest() {
  return window.ondevicelight !== undefined;
}

function handleDeviceLight(evt) {
  report('event', evt.type + " (" +  getFormattedTime() + ")");
  report('value', evt.value.toString());
}

report('selftest', 'PASS', 'FAIL', selfTest());
addEventListener('devicelight', handleDeviceLight);
