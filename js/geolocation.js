'use strict';

function selfTest() {
  return !!navigator.geolocation &&
         navigator.geolocation.getCurrentPosition !== undefined &&
         navigator.geolocation.watchPosition !== undefined &&
         navigator.geolocation.clearWatch !== undefined;
}

function positionSuccess(pos) {
  report('lastresult', 'Success');
  report('timestamp', getFormattedTime(new Date(pos.timestamp)));
  report('latitude', pos.coords.latitude);
  report('longitude', pos.coords.longitude);
  report('altitude', pos.coords.altitude);
  report('accuracy', pos.coords.accuracy);
  report('altitudeaccuracy', pos.coords.altitudeAccuracy);
  report('heading', pos.coords.heading);
  report('speed', pos.coords.speed);
}

function positionError(error) {
  report('lastresult', 'Error: (' + error.code + ')' + (error.message ? " " + error.message : ''));
}

function getPositionOptions () {
  var positionOptions = {};

  if (!document.getElementById('useoptions').checked) {
    return undefined;
  }

  positionOptions['enableHighAccuracy'] = document.getElementById('highaccuracy').checked;
  positionOptions['timeout'] = document.getElementById('timeout').value || undefined;
  positionOptions['maximumAge'] = document.getElementById('maxage').value || undefined
  return positionOptions;
}

function useOptionsChange () {
  var disabled = !document.getElementById('useoptions').checked;
  document.getElementById('highaccuracy').disabled = disabled;
  document.getElementById('timeout').disabled = disabled;
  document.getElementById('maxage').disabled = disabled;
}

var watchId = undefined;

var clickHandlers = {
  'getposition': function () {
    clear('lastresult', 'In Progress');
    navigator.geolocation.getCurrentPosition(positionSuccess, positionError, getPositionOptions());
  },
  'watchposition': function () {
    if (watchId) {
      return
    }
    clear('lastresult', 'In Progress');
    watchId = navigator.geolocation.watchPosition(positionSuccess, positionError, getPositionOptions());
  },
  'clearwatch': function () {
    navigator.geolocation.clearWatch(watchId);
    watchId = undefined;
  }
};

report('selftest', 'PASS', 'FAIL', selfTest());

document.body.addEventListener('click', function (evt) {
  if (clickHandlers[evt.target.id || evt.target.dataset.fn])
    clickHandlers[evt.target.id || evt.target.dataset.fn].call(this, evt);
});

window.addEventListener('unload', function () {
  if (watchId) {
      navigator.geolocation.clearWatch(watchId);
  }
}, false);

document.getElementById('useoptions').onchange = useOptionsChange;
