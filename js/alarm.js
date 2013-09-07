'use strict';

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

report('selftest', 'PASS', 'FAIL', selfTest());

// STEP 1: basic getAll() test
console.log("Before getAll");
var getAllRequest = navigator.mozAlarms.getAll();
console.log("getAll succeeded");
getAllRequest.onerror = function () { report('getall', undefined, "FAIL (Fatal)", false); }
getAllRequest.onsuccess = function () {
  console.log("getAll succeeded");
  report('getall', 'PASS');

  // Set up rest of test data
  var numAlarms = this.result.length;

  var alarmDate = new Date();
  alarmDate.setDate(alarmDate.getDate() + 1);

  var honorAlarm = {
    date: alarmDate,
    respectTimezone: "honorTimezone",
    data: 'alarm1data'
  };

  var ignoreAlarm = {
    date: alarmDate,
    respectTimezone: "ignoreTimezone",
    data: 'alarm2data'
  };

  var errorAlarm = {
    date: alarmDate,
    respectTimezone: "foozle",
    data: 'alarm3data'
  };

  // STEP 2: add test with honorTimezone
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

      // STEP 3: add test with ignoreTimezone
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

          // STEP 4: add test with forced error
          console.log("before add (error)");
          var addErrorThrew = false;
          try {
            var addErrorRequest = navigator.mozAlarms.add(errorAlarm.date, errorAlarm.respectTimezone, errorAlarm.data);
          } catch (e) {
            addErrorThrew = true;
          }

          if (!addErrorThrew) {
            report('adderror', undefined, "FAIL (Fatal)", false);
          } else {
            console.log("add (error) threw as expected");
            console.log("before fourth getall");
            var getAddErrorRequest = navigator.mozAlarms.getAll();
            getAddErrorRequest.onerror = function () { report('addignore', undefined, "FAIL (Fatal)", false); }
            getAddErrorRequest.onsuccess = function () {
              console.log("fourth getall succeeded");
              var addErrorResult = this.result.length === numAlarms &&
                                   !alarmIsPresent(errorAlarm, this.result);
              report('adderror', "PASS", "FAIL", addErrorResult);

              // STEP 5: remove
              console.log("before removes");
              navigator.mozAlarms.remove(honorAlarm.id);
              navigator.mozAlarms.remove(ignoreAlarm.id);
              numAlarms -= 2;
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
          }
        }
      }
    }
  }
}
