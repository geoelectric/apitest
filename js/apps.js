'use strict';

var url;
var manifest = {
   "name": "API Testbed",
   "description": "API Testbed",
   "default_locale": "en",
   "type": "privileged",
   "launch_path": "/index.html",
   "icons": {
     "128": "/style/icons/Apitest.png"
   },
   "developer": {
     "name": "Mozilla WebAPI QA",
     "url": "https://github.com/geoelectric/apitest"
   }
}

function selfTest() {
  return !!navigator.mozApps &&
         navigator.mozApps.install !== undefined &&
         navigator.mozApps.getSelf !== undefined &&
         navigator.mozApps.getInstalled !== undefined &&
         navigator.mozApps.checkInstalled !== undefined &&
         navigator.mozApps.installPackage !== undefined &&
         navigator.mozApps.mgmt == undefined;
}
function checkApp(app) {
  url = app.manifest.url + "/raw/master/manifest.webapp";
  var permissions = 0;
  for(var key in app.manifest.permissions)
    if(app.manifest.permissions.hasOwnProperty(key))
      permissions++;

  if (app) {
    if (app.manifest.name == manifest.name &&
        app.manifest.description == manifest.description &&
        app.manifest.type == manifest.type &&
        permissions > 5 &&
        Utility.areEqual(app.manifest.developer, manifest.developer) &&
        Utility.areEqual(app.manifest.icons, manifest.icons))
        {
      return true;
    }
  }
  return false;
}

var AppsTest = (function AppsTests() {
  var app = null;
  var appType = null;

  function start() {
    var p = new promise.Promise();
    var request = navigator.mozApps.getSelf();

    request.onsuccess = function () {
      app = request.result;
      if (app.installOrigin.indexOf("app://") == 0) {
        appType = "packaged";
      } else {
        appType = "hosted";
      }
      p.done(checkApp(request.result), request.result);
    };
    request.onerror = function () {
      p.done(false, "getSelf");
    };
    return p;
  }
  function checkReceipts() {
    var p = new promise.Promise();
    if(app.receipts.length == 1) {
      p.done(true, "This app was installed through the marketplace");
    } else if (app.receipts.length == 0 && appType =="packaged") {
      p.done(true, "This app was installed as a packaged app");
    }
  return p;
  }
  function checkUpdate() {
    var p = new promise.Promise();
    p.done(true,"foo");
    var ondownloadavail = false;
    app.ondownloadavailable = function ()  {
      ondownloadavail = true;
      p.done(false, "an update shouldn't be found");
    };

    app.ondownloadapplied = function () {
      if(ondownloadavail == false) {
        p.done(true, "update not found continuing");
      }
    };
    app.checkForUpdate();

    return p;
  }
  return {
    app: app,
    appType: appType,
    start: start,
    checkUpdate: checkUpdate,
    checkReceipts: checkReceipts,
    //getInstalled: getInstalled
  };
})();

report('selftest', 'PASS', 'FAIL', selfTest());

promise.chain([
        function () {
            return AppsTest.start();
        }, function (err, value) {
            report("getself",'PASS', 'FAIL', err);
            return AppsTest.checkUpdate();
        }, function (err, value) {
            report("checkUpdate", 'PASS', 'FAIL', err);
            return AppsTest.checkReceipts();
        }
]).then(
    function(err, results) {
      report("checkReceipts",results, 'FAIL', err);
    }
);

