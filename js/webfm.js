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

function reportEvent(spanName, evt) {
  report(spanName, evt.type + " (" +  getFormattedTime() + ")");
  updateValues();
}

function addResultCallbacks(req) {
  clear('lastresult', 'In Progress');
  req.onsuccess = function () { report('lastresult', 'Success'); };
  req.onerror = function () { report('lastresult', this.error ? 'Error: ' + this.error.name : 'Error'); };
}

var clickHandlers = {
  'seekup': function () {
    addResultCallbacks(navigator.mozFMRadio.seekUp());
  },
  'seekdown': function () {
    addResultCallbacks(navigator.mozFMRadio.seekDown());
  },
  'cancelseek': function () {
    addResultCallbacks(navigator.mozFMRadio.cancelSeek());
  },
  'setfreq': function () {
     var frequency = parseFloat(document.getElementById('frequencyinput').value);
     addResultCallbacks(navigator.mozFMRadio.setFrequency(frequency));
   },
  'disable': function () {
     addResultCallbacks(navigator.mozFMRadio.disable());
  },
  'enable': function () {
     addResultCallbacks(navigator.mozFMRadio.enable(DEFAULT_STATION));
  }
};

report('selftest', 'PASS', 'FAIL', selfTest());

document.body.addEventListener('click', function (evt) {
  if (clickHandlers[evt.target.id || evt.target.dataset.fn])
    clickHandlers[evt.target.id || evt.target.dataset.fn].call(this, evt);
});

window.addEventListener('unload', function () {
  navigator.mozFMRadio.disable();
}, false);

navigator.mozFMRadio.onenabled = function (e) { reportEvent('radioevent', e); }
navigator.mozFMRadio.ondisabled = function (e) { reportEvent('radioevent', e); }
navigator.mozFMRadio.onantennaavailablechange = function (e) { reportEvent('changeevent', e); }
navigator.mozFMRadio.onfrequencychange = function (e) { reportEvent('changeevent', e); }

updateValues();
