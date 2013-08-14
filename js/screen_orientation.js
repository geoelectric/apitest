'use strict';

function selfTest() {
  return screen.onmozorientationchange !== undefined &&
         screen.mozLockOrientation !== undefined &&
         screen.mozUnlockOrientation !== undefined &&
         orientationIsValid(screen.mozOrientation);
}

function orientationIsValid(orientation) {
  return ['portrait',
          'landscape',
          'portrait-primary',
          'portrait-secondary',
          'landscape-primary',
          'landscape-secondary'].indexOf(orientation) !== -1;
}

function handleOrientationChange(evt) {
  report('event', evt.type + " (" +  getFormattedTime() + ")");
  report('orientation', screen.mozOrientation, screen.mozOrientation,
         orientationIsValid(screen.mozOrientation));
}

function testLock(orientation) {
  var result = screen.mozLockOrientation(orientation);
  report('locksuccess', 'Successful (Locked)', 'Unsuccessful', result)
}

var clickHandlers = {
  'lockportrait': function () {
    testLock('portrait');
  },
  'locklandscape': function () {
    testLock('landscape');
  },
  'lockportraitprimary': function () {
    testLock('portrait-primary');
  },
  'lockportraitsecondary': function () {
    testLock('portrait-secondary');
  },
  'locklandscapeprimary': function () {
    testLock('landscape-primary');
  },
  'locklandscapesecondary': function () {
    testLock('landscape-secondary');
  },
  'unlock': function () {
    report('locksuccess', 'Successful (Unlocked)', 'Unsuccessful',
           screen.mozUnlockOrientation());
  }
};

report('selftest', 'PASS', 'FAIL', selfTest());

screen.addEventListener('mozorientationchange', handleOrientationChange);

document.body.addEventListener('click', function (evt) {
  if (clickHandlers[evt.target.id || evt.target.dataset.fn])
    clickHandlers[evt.target.id || evt.target.dataset.fn].call(this, evt);
});
