'use strict';

function selfTest() {
  return !!navigator.mozTCPSocket &&
         navigator.mozTCPSocket.host !== undefined &&
         navigator.mozTCPSocket.port !== undefined &&
         navigator.mozTCPSocket.ssl !== undefined &&
         //navigator.mozTCPSocket.bufferedAmount !== undefined &&
         navigator.mozTCPSocket.binaryType !== undefined &&
         navigator.mozTCPSocket.readyState !== undefined &&
         navigator.mozTCPSocket.open !== undefined &&
         //navigator.mozTCPSocket.listen !== undefined &&
         //navigator.mozTCPSocket.upgradeToSecure !== undefined &&
         navigator.mozTCPSocket.suspend !== undefined &&
         navigator.mozTCPSocket.resume !== undefined &&
         navigator.mozTCPSocket.close !== undefined &&
         navigator.mozTCPSocket.send !== undefined &&
         navigator.mozTCPSocket.onopen !== undefined &&
         navigator.mozTCPSocket.ondrain !== undefined &&
         navigator.mozTCPSocket.ondata !== undefined &&
         navigator.mozTCPSocket.onerror !== undefined &&
         navigator.mozTCPSocket.onclose !== undefined;
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
