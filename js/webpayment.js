'use strict';

function selfTest() {
  return !!navigator.mozPay;
}

var MozPay = (function MozPay() {
  var HOST = "http://inapp-pay-test.paas.allizom.org/";
  //HOST = "http://10.251.26.19/";
  function jwtSource() {
    var xmlhttp = new XMLHttpRequest({mozSystem: true});
    var p = new promise.Promise();
    var url = HOST + "jwt-source?server=1";
    xmlhttp.onreadystatechange = function ()  {
      if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
          console.log("inside readystate");
        if (xmlhttp.responseText != "Not found" ) {
          p.done(true, xmlhttp.responseText);
        }
      }
    };
    console.log(url);
    xmlhttp.open( "GET", url, true );
    xmlhttp.setRequestHeader("Access-Control-Allow-Origin","*");
    xmlhttp.send( null );
    return p;
  }

  function jwtSigned(jwt) {
    var xmlhttp = new XMLHttpRequest({mozSystem: true});
    var p = new promise.Promise();
    var params =  "server=1&jwt=" + jwt;

    xmlhttp.onreadystatechange = function ()  {
      if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 )
        if (xmlhttp.responseText != "Not found" ) {
          console.log('inside jwtsigned');
          p.done(true, xmlhttp.responseText);
        }
    }
    xmlhttp.open( "POST", HOST + "pay", true );
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.setRequestHeader("Content-length", params.length);
    xmlhttp.setRequestHeader("Connection", "close");
    xmlhttp.send( params );
    return p;
  }

  function mozPay(jwtobj) {
    jwtobj = JSON.parse(jwtobj);
    var jwtSigned = jwtobj.jwt;
    var request = navigator.mozPay([jwtSigned]);
    var p = new promise.Promise();
    request.onsuccess = function() {
      waitForResult(jwtobj.transID, 1, p);
    };
    request.onerror = function() {
      p.done(false, 'navigator.mozPay() error: ' + this.error.name);
    };
    return p;
  }

  function waitForResult(transID, opt, p) {
    opt = opt || {tries: 1};
    if (opt.tries > 10) {
      throw new Error('could not find transaction after 10 tries');
    }
    var xmlhttp = new XMLHttpRequest({mozSystem: true});
    console.log('checking transaction', transID);
    var url = HOST + 'transaction/' + transID;
    var data = null;
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
        if(xmlhttp.responseText && xmlhttp.responseText.length > 0){
          data = JSON.parse(xmlhttp.responseText);
          if(data.state == 'pending') {
            setTimeout(function() { waitForResult(transID, {tries: opt.tries + 1}, p) },
             1000);
          } else if (data.state == 'completed') {
              p.done(true, data.result);
          } else {
              p.done(false, 'invalid completion state: ' + data.state);
          }
        }
      }
      if (xmlhttp.status > 400) {
        p.done(false, "invalid http response: " + xmlhttp.status);
      }
    };
    xmlhttp.open( "GET", url, true );
    xmlhttp.setRequestHeader("Access-Control-Allow-Origin","*");
    xmlhttp.send( null );
    return null;
  }

  return {
    mozPay: mozPay,
    jwtSigned: jwtSigned,
    jwtSource: jwtSource
  };
})();


promise.chain([
        function () {
            return MozPay.jwtSource();
        }, function (err, value) {
            report("jwtsource", 'PASS', 'FAIL', err);
            return MozPay.jwtSigned(value);
        }, function (err, value) {
            report("jwtsigned", 'PASS', 'FAIL', err);
            return MozPay.mozPay(value);
        }, function (err, value) {
            report("pay", 'PASS', 'FAIL', err);
            return MozPay.mozPay(JSON.stringify({"jwt" : "isodfiasdfaosdfjaosdfadf",
                                  "transID" : "2329823"}));
        }
]).then(
    function(err, results) {
        report("payfailure", 'PASS: \n'+ results, 'FAIL', !err);
    }
);

report('selftest', 'PASS', 'FAIL', selfTest());

