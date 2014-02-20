'use strict';

// Globals shared across callbacks
var numAlarms;
var honorAlarm;
var ignoreAlarm;
var alarmDate = new Date()
alarmDate.setDate(alarmDate.getDate() + 1); // tomorrow

function selfTest() {
  return !!navigator.mozAlarms &&
         navigator.mozAlarms.add !== undefined &&
         navigator.mozAlarms.getAll !== undefined &&
         navigator.mozAlarms.remove !== undefined;
}

function alarmIsPresent(alarm, alarmList) {
  var result = false;

  alarmList.forEach(function (a) {
    if (!result) {
      var matches = a.respectTimezone === alarm.respectTimezone &&
                    a.data === alarm.data;

      if (!a.date || !alarm.date) {
        matches = matches && a.date === alarm.date
      } else {
        matches = matches && a.date.toString() === alarm.date.toString();
      }

      if (alarm.id) {
        matches = matches && a.id === alarm.id;
      }

      result = matches;
    }
  });

  return result;
}

function testGetAll() {
  // STEP 1: basic getAll() test
  console.log("Before getAll");
  var getAllRequest = navigator.mozAlarms.getAll();
  console.log("getAll succeeded");
  getAllRequest.onerror = function () { report('getall', undefined, "FAIL (Fatal)", false); }
  getAllRequest.onsuccess = function () {
    console.log("getAll succeeded");
    report('getall', 'PASS');

    // Set up rest of test data
    numAlarms = this.result.length;

    testAddHonor();
  }
}

function testAddHonor() {
  // STEP 2: add test with honorTimezone
  honorAlarm = {
      date: alarmDate,
      respectTimezone: "honorTimezone",
      data: 'alarm1data'
  };

  console.log("before add (honor)");
  var addHonorRequest = navigator.mozAlarms.add(honorAlarm.date, honorAlarm.respectTimezone, honorAlarm.data);
  addHonorRequest.onerror = function () { report('addhonor', undefined, "FAIL (Fatal)", false); }
  addHonorRequest.onsuccess = function () {
    console.log("add (honor) succeeded");
    honorAlarm.id = this.result;
    numAlarms++;
    console.log("before second getall");
    var getAddHonorRequest = navigator.mozAlarms.getAll();
    getAddHonorRequest.onerror = function () { report('addhonor', undefined, "FAIL (Fatal)", false); }
    getAddHonorRequest.onsuccess = function () {
      console.log("second getAll succeeded");
      var addHonorResult = this.result.length === numAlarms &&
                           alarmIsPresent(honorAlarm, this.result);
      report('addhonor', "PASS", "FAIL", addHonorResult);

      testAddIgnore();
    }
  }
}

function testAddIgnore() {
  // STEP 3: add test with ignoreTimezone
  ignoreAlarm = {
      date: alarmDate,
      respectTimezone: "ignoreTimezone",
      data: 'alarm2data'
  };

  console.log("before add (ignore)");
  var addIgnoreRequest = navigator.mozAlarms.add(ignoreAlarm.date, ignoreAlarm.respectTimezone, ignoreAlarm.data);
  addIgnoreRequest.onerror = function () { report('addignore', undefined, "FAIL (Fatal)", false); }
  addIgnoreRequest.onsuccess = function () {
    console.log("add (ignore) succeeded");
    ignoreAlarm.id = this.result;
    numAlarms++;
    console.log("before third getall");
    var getAddIgnoreRequest = navigator.mozAlarms.getAll();
    getAddIgnoreRequest.onerror = function () { report('addignore', undefined, "FAIL (Fatal)", false); }
    getAddIgnoreRequest.onsuccess = function () {
      console.log("third getall succeeded");
      var addIgnoreResult = this.result.length === numAlarms &&
                            alarmIsPresent(ignoreAlarm, this.result);
      report('addignore', "PASS", "FAIL", addIgnoreResult);

      testAddError();
    }
  }
}

function testAddError() {
  // STEP 4: add test with forced error
  var errorAlarm = {
      date: alarmDate,
      respectTimezone: "foozle",
      data: 'alarm3data'
  };

  console.log("before add (error)");
  var addErrorThrew = false;
  try {
    var addErrorRequest = navigator.mozAlarms.add(errorAlarm.date, errorAlarm.respectTimezone, errorAlarm.data);
  } catch (e) {
    addErrorThrew = true;
  }

  if (!addErrorThrew) {
    report('adderror', undefined, "FAIL (Fatal)", false);
    return; // EARLY EXIT
  }

  console.log("add (error) threw as expected");
  console.log("before fourth getall");
  var getAddErrorRequest = navigator.mozAlarms.getAll();
  getAddErrorRequest.onerror = function () { report('addignore', undefined, "FAIL (Fatal)", false); }
  getAddErrorRequest.onsuccess = function () {
    console.log("fourth getall succeeded");
    var addErrorResult = this.result.length === numAlarms &&
                         !alarmIsPresent(errorAlarm, this.result);
    report('adderror', "PASS", "FAIL", addErrorResult);

    testRemoveAlarms();
  }
}

function testRemoveAlarms() {
  // STEP 5: remove
  console.log("before removes");

  if (honorAlarm) {
    navigator.mozAlarms.remove(honorAlarm.id);
    numAlarms--;
  }

  if (ignoreAlarm) {
    navigator.mozAlarms.remove(ignoreAlarm.id);
    numAlarms--;
  }

  console.log("after removes");
  console.log("before fifth getall");
  var getRemoveRequest = navigator.mozAlarms.getAll();
  getRemoveRequest.onerror = function () { report('remove', undefined, "FAIL (Fatal)", false); }
  getRemoveRequest.onsuccess = function () {
    console.log("fifth getall succeeded");
    var removeResult = this.result.length === numAlarms &&
                       !alarmIsPresent(honorAlarm, this.result) &&
                       !alarmIsPresent(ignoreAlarm, this.result);
    report('remove', "PASS", "FAIL", removeResult);
  }
}

report('selftest', 'PASS', 'FAIL', selfTest());
testGetAll(); // KICKOFF

