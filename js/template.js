'use strict';

function selfTest() {
  return false;
}

var clickHandlers = {
/*
  'id': function () {
    alert('event triggered!');
  }, */
};

report('selftest', 'PASS', 'FAIL', selfTest());

document.body.addEventListener('click', function (evt) {
  if (clickHandlers[evt.target.id || evt.target.dataset.fn])
    clickHandlers[evt.target.id || evt.target.dataset.fn].call(this, evt);
});
