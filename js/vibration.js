'use strict';

function selfTest() {
  return navigator.vibrate !== undefined;
}

var clickHandlers = {
  'vibratepat': function () {
    navigator.vibrate([1000, 250, 500, 250, 1000, 250, 500, 250, 1000]);
  },
  'vibrate5': function () {
    navigator.vibrate(5000);
  },
  'cancel': function () {
    navigator.vibrate(0);
  }
};

report('selftest', 'PASS', 'FAIL', selfTest());

document.body.addEventListener('click', function (evt) {
  if (clickHandlers[evt.target.id || evt.target.dataset.fn])
    clickHandlers[evt.target.id || evt.target.dataset.fn].call(this, evt);
});
