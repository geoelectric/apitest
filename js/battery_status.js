'use strict';

function selfTest() {
  return navigator.battery !== undefined &&
         navigator.battery.charging !== undefined &&
         navigator.battery.chargingTime !== undefined &&
         navigator.battery.dischargingTime !== undefined &&
         navigator.battery.level !== undefined &&
         navigator.battery.onchargingchange !== undefined &&
         navigator.battery.onchargingtimechange !== undefined &&
         navigator.battery.ondischargingtimechange !== undefined &&
         navigator.battery.onlevelchange !== undefined;
}

function updateValues() {
  report('charging', navigator.battery.charging);
  report('chargingtime', navigator.battery.chargingTime);
  report('dischargingtime', navigator.battery.dischargingTime);
  report('level', navigator.battery.level);
}

function handleEvents(evt) {
  report(evt.type, getFormattedTime());
  updateValues();
}

report('selftest', 'PASS', 'FAIL', selfTest());
navigator.battery.addEventListener('chargingchange', handleEvents);
navigator.battery.addEventListener('chargingtimechange', handleEvents);
navigator.battery.addEventListener('dischargingtimechange', handleEvents);
navigator.battery.addEventListener('levelchange', handleEvents);
updateValues();
