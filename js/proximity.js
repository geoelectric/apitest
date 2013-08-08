'use strict';

function selfTest() {
  return window.ondeviceproximity !== undefined &&
         window.onuserproximity !== undefined;
}

function handleDeviceProximity(evt) {
  report('devevent', evt.type + " (" + getFormattedTime() + ")");
  report('devvalue', evt.value.toString());
  report('devmin', evt.min.toString());
  report('devmax', evt.max.toString());
}

function handleUserProximity(evt) {
  report('userevent', evt.type + " (" +  getFormattedTime() + ")");
  report('nearvalue', evt.near.toString());
}

report('selftest', 'PASS', 'FAIL', selfTest());
addEventListener('deviceproximity', handleDeviceProximity);
addEventListener('userproximity', handleUserProximity);
