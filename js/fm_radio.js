'use strict';

const DEFAULT_STATION = 89.5;

function selfTest() {
  return navigator.mozFMRadio !== undefined;
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
     dump(text);
     setFrequency(parseFloat(text)); 
   },
  'disable': function () {
     navigator.mozFMRadio.disable();
  },
  'enable': function () {
     navigator.mozFMRadio.enable(DEFAULT_STATION);
  }
};

document.body.addEventListener('click', function (evt) {
  if (clickHandlers[evt.target.id || evt.target.dataset.fn])
    clickHandlers[evt.target.id || evt.target.dataset.fn].call(this, evt);
});

function onRadioEnabled() {
  dump("Radio Enabled");
  report("radio", 'ENABLED');
}

function onRadioDisabled() {
  dump("Radio Disabled");
  report("radio", "DISABLED");
}

function onAntennaAvailable() {
  dump("antenna state changed inside available");
  if (navigator.mozFMRadio.antennaAvailable) {
    report("antenna", 'ENABLED');
    navigator.mozFMRadio.enable(DEFAULT_STATION);
    return true;
  } else {
    report("antenna", 'DISABLED');
  }
  return false;
}

function onFrequencyChange() {
  report('channel', navigator.mozFMRadio.frequency);
}

function setFrequency(freq) {
  if(freq < navigator.mozFMRadio.frequencyUpperBound && 
    freq > navigator.mozFMRadio.frequencyLowerBound) {
    
    navigator.mozFMRadio.setFrequency(freq);
  }
}

report('selftest', 'PASS', 'FAIL', selfTest());
report('upperbound', navigator.mozFMRadio.frequencyUpperBound);
report('lowerbound', navigator.mozFMRadio.frequencyLowerBound);

document.body.addEventListener('click', function (evt) {
  if (clickHandlers[evt.target.id || evt.target.dataset.fn])
    clickHandlers[evt.target.id || evt.target.dataset.fn].call(this, evt);
});

window.addEventListener('unload', function(e) {
  navigator.mozFMRadio.disable();
}, false);

navigator.mozFMRadio.onenabled=function foos() {onRadioEnabled();};
navigator.mozFMRadio.ondisabled=function bars() {onRadioDisabled();};
navigator.mozFMRadio.onantennaavailablechange=function apples() {onAntennaAvailable();};
navigator.mozFMRadio.onfrequencychange=function oranges() {onFrequencyChange();};

//Setup Initial State
if(onAntennaAvailable()) {
  onFrequencyChange();
}

if(navigator.mozFMRadio.enabled) {
  onRadioEnabled();
} else {
  onRadioDisabled();
}
