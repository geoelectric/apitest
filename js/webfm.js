'use strict';

const DEFAULT_STATION = 89.5;

function selfTest() {
  return !!navigator.mozFMRadio &&
         navigator.mozFMRadio.antennaAvailable !== undefined &&
         navigator.mozFMRadio.enabled !== undefined &&
         navigator.mozFMRadio.frequency !== undefined &&
         navigator.mozFMRadio.frequencyUpperBound !== undefined &&
         navigator.mozFMRadio.frequencyLowerBound !== undefined &&
         navigator.mozFMRadio.channelWidth !== undefined &&
         navigator.mozFMRadio.onantennaavailablechange !== undefined &&
         navigator.mozFMRadio.onfrequencychange !== undefined &&
         navigator.mozFMRadio.onenabled !== undefined &&
         navigator.mozFMRadio.ondisabled !== undefined &&
         navigator.mozFMRadio.enable !== undefined &&
         navigator.mozFMRadio.disable !== undefined &&
         navigator.mozFMRadio.setFrequency !== undefined &&
         navigator.mozFMRadio.seekUp !== undefined &&
         navigator.mozFMRadio.seekDown !== undefined &&
         navigator.mozFMRadio.cancelSeek !== undefined;
}

function updateValues() {
  report('enabled', navigator.mozFMRadio.enabled);
  report('antenna', navigator.mozFMRadio.antennaAvailable);
  report('frequency', navigator.mozFMRadio.frequency || 'N/A');
  report('width', navigator.mozFMRadio.channelWidth);
  report('upperbound', navigator.mozFMRadio.frequencyUpperBound);
  report('lowerbound', navigator.mozFMRadio.frequencyLowerBound);
}

function handleEvents(spanName, evt) {
  report(spanName, evt.type + " (" +  getFormattedTime() + ")");
  updateValues();
}

var clickHandlers = {
  'seekup': function () {
    navigator.mozFMRadio.seekUp();
  },
  'seekdown': function () {
    navigator.mozFMRadio.seekDown();
  },
  'cancelseek': function () {
    navigator.mozFMRadio.cancelSeek();
  },
  'setfreq': function () {
     var text = document.getElementById("frequency").value;
     navigator.mozFMRadio.setFrequency(parseFloat(text));
   },
  'disable': function () {
     navigator.mozFMRadio.disable();
  },
  'enable': function () {
     navigator.mozFMRadio.enable(DEFAULT_STATION);
  }
};

report('selftest', 'PASS', 'FAIL', selfTest());
report('upperbound', navigator.mozFMRadio.frequencyUpperBound);
report('lowerbound', navigator.mozFMRadio.frequencyLowerBound);

document.body.addEventListener('click', function (evt) {
  if (clickHandlers[evt.target.id || evt.target.dataset.fn])
    clickHandlers[evt.target.id || evt.target.dataset.fn].call(this, evt);
});

window.addEventListener('unload', function (e) {
  navigator.mozFMRadio.disable();
}, false);

navigator.mozFMRadio.onenabled = function (e) { handleEvents('radioevent', e); }
navigator.mozFMRadio.ondisabled = function (e) { handleEvents('radioevent', e); }
navigator.mozFMRadio.onantennaavailablechange = function (e) { handleEvents('changeevent', e); }
navigator.mozFMRadio.onfrequencychange = function (e) { handleEvents('changeevent', e); }

updateValues();
