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

function eventTime(event) {
  return event + ' : ' + getFormattedTime();
}
function onRadioEnabled() {
  report("radio", eventTime('ENABLED'));
}

function onRadioDisabled() {
  report("radio", eventTime('DISABLED'));
}

function onAntennaAvailable() {
  if (navigator.mozFMRadio.antennaAvailable) {
    report("antenna", eventTime('ENABLED'));
    return true;
  } else {
    report("antenna", eventTime('DISABLED'));
  }
  return false;
}

function onFrequencyChange() {
  report('channel', eventTime(navigator.mozFMRadio.frequency));
}

function setFrequency(freq) {
  navigator.mozFMRadio.setFrequency(freq);
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

function handleEvents(evt) {
  switch (evt.type)
  {
    case "enabled":
      onRadioEnabled();
      break;
    case "disabled":
      onRadioDisabled();
      break;
    case "antennaavailablechange":
      onAntennaAvailable();
      break;
    case "frequencychange":
      onFrequencyChange();
      break;
    default:
      break;
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


navigator.mozFMRadio.onenabled=handleEvents;
navigator.mozFMRadio.ondisabled=handleEvents;
navigator.mozFMRadio.onantennaavailablechange=handleEvents;
navigator.mozFMRadio.onfrequencychange=handleEvents;

//Setup Initial State
if(onAntennaAvailable()) {
  onFrequencyChange();
}

if(navigator.mozFMRadio.enabled) {
  onRadioEnabled();
} else {
  onRadioDisabled();
}
