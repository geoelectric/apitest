'use strict';


function runAll(steps) {
  // Clone the array so we don't modify the original.
  steps = steps.concat();

  function next() {
    if (steps.length) {
      steps.shift()(next);
    } else {
    }
  }
  next();

}

function logResult(testname, result, msg) {
  var span = document.getElementById(testname);
  var my_results = document.getElementById("results");
  if(!span) {
    var test = document.createElement("br");
    span = document.createElement("span");
    span.classList.add("result");
    span.id = testname;
    span.appendChild(document.createTextNode(msg));
    var my_results = document.getElementById("results");
    my_results.appendChild(test);
    my_results.appendChild(span);
  } 
  msg = testname + ": " + msg;
  report(testname, msg, msg, result);
}

function selfTest() {
  return navigator.getDeviceStorage("kilimanjaro") == undefined &&
         navigator.getDeviceStorage("pictures") !== undefined &&
         navigator.getDeviceStorage("music") !== undefined &&
         navigator.getDeviceStorage("sdcard") !== undefined &&
         navigator.getDeviceStorage("videos") !== undefined;
}

function getRandomBuffer() {
  var size = 1024;
  var buffer = new ArrayBuffer(size);
  var view = new Uint8Array(buffer);
  for (var i = 0; i < size; i++) {
    view[i] = parseInt(Math.random() * 255);
  }
  return buffer;
}

function createRandomBlob(mime) {
  var blob = null;
  return blob = new Blob([getRandomBuffer()], {type: mime});
}

function add(next) {
  var request = gStorage.add(createRandomBlob(blobTypes[gIndex]));
  request.onsuccess = function(added) {
    logResult("add", added.target.result, "successfully added file blob " + added.target.result);
    var request2 = gStorage.delete(added.target.result);
    request2.onsuccess = function () {
      next();
    };
  }
  request.onerror = function (e) {
    logResult("add", false, "error using api: " +e.target.error.name);
    next();
  }
}

function addFiles(next) {
  var success = 0; 
  for (var i=0;i < gActiveFiles.length; i++)  {
    var request = gStorage.addNamed(createRandomBlob(blobTypes[gIndex]), gActiveFiles[i]);
    request.onsuccess = function () {
      success+= 1;
      if (success == gActiveFiles.length) {
        logResult("addnamed", true, success + " files successfully added of " + gActiveFiles.length);
        next();
      }
    };
    request.onerror = function () {
      logResult("addnamed", false, "error adding file: " + gActiveFiles[i]);
      next();
    };
  }
}

function setup (next) {
  var setupSteps = [ deleteFiles, 
                     freeSpace,
                     usedSpace, 
                     available,
                     addChangeListener,
                     add,
                     addFiles,
                     next ];

  gStorageType = document.getElementById("devicestorage").value;
  console.log ("gStorageType = " + gStorageType);
  gStorage = navigator.getDeviceStorage(gStorageType);
  gIndex = storageTypes.indexOf(gStorageType);
  gActiveFiles = files[gIndex];
  runAll(setupSteps);
}


function freeSpace(next) {
  var request = gStorage.freeSpace();
  request.onsuccess = function () {
    if(free == null) {
      free = this.result;
    } else {
      var space = free - this.result;
      var msg = " space changed = " + space + " bytes";
      logResult('freespace', space > 1000, msg);
      free = null;
    }
    next();
  };
}

function usedSpace(next) {
  console.log("in usedspace");
  var request = gStorage.usedSpace();
  request.onsuccess = function () {
    if (used == null) {
      used = this.result;
    } else {
      
      var space = this.result - used;
      var msg = " space changed = " + space + " bytes";
      logResult('usedspace', space > 1000, msg);
      used = null; 
    }
    next();
  }
}

function available(next) {
  var request = gStorage.available();
  request.onsuccess = function (e) {
    status = e.target.result;
    if(status == "available") {
      logResult('available', true, gStorageType + " is available");
    }
    else {
      logResult('available', false, gStorageTypeType + " is " + status);
    }
    next();
  };
  request.onerror = function (e) {
    logResult('available', false, "Error occurred on api call");
    next();
  }
}

function get(next) {
  var file = gActiveFiles[0];
  console.log('get file = ' + file);
  var request = gStorage.get(file);
  request.onsuccess = function ()  {
    logResult('get', this.result.name, "successfully verified: " + this.result.name);
    next();
  }
}

function enumerate(next) {
  var cursor = gStorage.enumerate();
  var enumeratedfiles = [];
  var pass = true;
  cursor.onsuccess = function () {
     if (cursor.result !== null) {
       enumeratedfiles.push(cursor.result.name);
       cursor.continue(); 
     } else {
       for each (var file in gActiveFiles) {
         if((enumeratedfiles.indexOf(file) < 0) &&
            (enumeratedfiles.indexOf("/sdcard/" + file) < 0)){
           pass = false;
         }
       }
       logResult("enumerate", pass, enumeratedfiles.toString());
       next();
     }
  }
}

function enumerateEditable(next) {
  var cursor = gStorage.enumerateEditable(); 
  var enumeratedfiles = [];
  var pass = true;
  cursor.onsuccess = function () {
    if (cursor.result !== null) { 
      enumeratedfiles.push(cursor.result.name);
      cursor.continue();
    } else {
      for each (var file in gActiveFiles) {
         if((enumeratedfiles.indexOf(file) < 0) &&
            (enumeratedfiles.indexOf("/sdcard/" + file) < 0)) {
           pass = false;
         }
      }
      logResult("enumerateEditable", pass, enumeratedfiles.toString());
      next();
    }
  }
}

function onChange(change) {
  changeevents[change.reason]+= 1;
}

function addChangeListener(next) {
  gStorage.addEventListener("change", onChange);
  var func = function() { next(); console.log("called next"); };
  console.log('added event listener');
  window.setTimeout(func, 500);
}

function changed() {
  gStorage.removeEventListener("change", onChange);
  logResult("createdevents", changeevents["created"] == (gActiveFiles.length + 1) ? true : false, 
            changeevents["created"]);
  logResult("modifiedevents", changeevents["modified"] == (gActiveFiles.length + 1) ? true : false, 
            changeevents["modified"]);
  logResult("deletedevents", changeevents["deleted"] == (gActiveFiles.length + 1) ? true : false,
            changeevents["deleted"]);
  changeevents['created'] = 0;
  changeevents['modified'] = 0;
  changeevents['deleted'] = 0;
}

function deleteFiles(next) {
  var success = 0;
  var i = 0;
  if (typeof gActiveFiles === "string") {
    gActiveFiles = [activefiles];
  }
  for (i=0;i < gActiveFiles.length; i++)  {
    var request = gStorage.delete(gActiveFiles[i]);
    request.onsuccess = function () {
      success+= 1;
      if (success == gActiveFiles.length) {
        logResult("deleteFiles", true, success + " files successfully deleted of " + gActiveFiles.length);
        next();
      }
    };
    request.onerror = function (e) {
      logResult("delete", false, "failure deleting file " + gActiveFiles[i] + 
                 "reason: " + e.target.error.name);
    };
  }
}

report('selftest', 'PASS', 'FAIL', selfTest());

var storageTypes = ["pictures", "videos", "music", "sdcard", "apps"];
var blobTypes = ["image/png", "video/webm", "audio/mp3", "text/plain", "text/plain"];
var files = [["a.png", "b.png", "c.png"], 
             ["a.webm", "b.webm"],
             ["a.mp3", "b.mp3", "c.mp3"], 
             ["plain.txt"], 
             ["foobar.txt", "b.mp4"]];
var gIndex = 0;
var gActiveFiles = null;
var gStorage = null;

var gStorageType = null;
var avail = null;
var used = null;
var free = null;

var changeevents = new Array();
changeevents['created'] = 0; 
changeevents['modified'] = 0; 
changeevents['deleted'] = 0; 

var orders = [
  setup,
  freeSpace,
  usedSpace, 
  enumerate,
  enumerateEditable,
  get,
  deleteFiles,
  changed,
];

document.body.addEventListener('change', function (evt) {
                               if (evt.target.id == "devicestorage" ) 
                                 runAll(orders);
                               });

window.onload = function () {
  runAll(orders);
}
