'use strict';

var index = 0;
var mozContactDBLength = 0;

var contactsdb = [{"name": "John Smith",
                   "familyName": ["Smith"],
                   "givenName": ["John"],
                   "email": "john@google.com",
                   "tel": [{type: ["work"], value:"19834451515", carrier: "testCarrier"}]},
                  {"name": "Tony Weston",
                   "familyName": ["Weston"],
                   "givenName": ["Tony"],
                   "email": "tony@google.com",
                   "tel": [{type: ["work"], value:"19815551212", carrier: "testCarrier"}]},
                  {"name": "Clark Kent",
                   "familyName": ["Kent"],
                   "givenName": ["Clark"],
                   "email": "superman@kryptonite.com",
                   "tel":  [{type: ["work"], value: "14155551212", carrier: "testCarrier"}]}];
var contact;
var notifications = {'update' : 0,
                    'create' : 0,
                    'remove' : 0 };

function clear() {
  var request = navigator.mozContacts.clear();
  request.onsuccess = function () {
    var search = navigator.mozContacts.getAll({});
    search.onsuccess = function (evt) {
      var cursor = evt.target;
        report('clear', 'Clear has worked', 'Clear still has objects', cursor.done);
    };
    search.onerror = function () {
      report('clear', 'Clear through an error', '', false);
    };

  };
  request.onerror = function () {
    report('clear', '','Clear has failed', false);
  };
  notifications = {'update' : 0,
                    'create' : 0,
                    'remove' : 0 };
  index = 0;
}

var steps = [
  function getSize() {
     mozContactDBLength = 0;
     var request = navigator.mozContacts.getAll({sortBy: "familyName", sortOrder: "descending"});
     request.onsuccess = function () {
       if (request.result){
        mozContactDBLength++;
        request.continue();
       } else {
         next();
       }
     };
     request.onerror = function () {
       conosle.log('in on error = ' + request.error.name);
     };
  },
  function addContacts () {
    var successes = 0;
    for (var i = 0; i < contactsdb.length ; i++) {
      contact = new mozContact();
      contact.init(contactsdb[i]);
      navigator.mozContacts.oncontactchange = function(event) {
        notifications[event.reason] += 1;
      };
      var request = navigator.mozContacts.save(contact);
      request.onsuccess = function () {
        successes++;
        if(successes == contactsdb.length) {
          report('add', 'Saved All ' + i  + ' contacts successfully',
                         'Failed to save all contacts', successes == i);
          next();
        }
      };
      request.onerror = function (evt) {
        report('add','', 'Failed to save contacts' + JSON.stringify(request.error), false);
        successes = -100;
      };
    }
  },
  function getAll() {
    var search = navigator.mozContacts.getAll({sortBy: "familyName", sortOrder: "descending"});
    var found = 0;
    search.onsuccess = function(evt) {
      if(evt.target.result) {
        var getContact = evt.target.result;
        found++;
        search.continue();
      }
      if(search.done) {
        report('getAll', 'Got ' + found + ' contacts ', "Didn't get previously added contacts " + found, found == mozContactDBLength + contactsdb.length);
        next();
      }
    };
    search.onerror = function () {
      report('getAll', '', 'getAll threw an error', false);
    };
  },
  function find() {
    var options = {filterBy: ["tel"],
                   filterOp: "match",
                   filterValue: "14155551212"};
    var req = navigator.mozContacts.find(options);

    req.onsuccess = function () {
      report('find', 'Found Contact with filter parameters',
                     "Didn't find contact with filter parameters",
                     req.result.length == 1 &&
                     req.result[0].givenName == "Clark" &&
                     req.result[0].familyName == "Kent");
      if(req.result.length > 0) {
        contact = req.result[0];
        contact.familyName = ["Kal-El"];

        var request = navigator.mozContacts.save(contact);
        request.onsuccess = function () {
          next();
        };
        request.onerror = function () {
          report('update', '', 'Update failed', false);
        };
      }
    };
    req.onerror = function () {
      report('find', '','Find Failed', false);
    };
  },
  function () {
    var search = navigator.mozContacts.find({filterBy: ["familyName"],
                                     filterOp: ["equals"],
                                     filterValue: "Kal-El"});
    search.onsuccess = function () {
      report('update', 'Successfully updated familyName', 'Unsuccessfully updated familyName', search.result.length == 1);
      contact = search.result[0];
      next();
    };
    search.onerror = function () {
      report('update', '', 'Update failed', false);
    };
  },
  function () {
    var request = navigator.mozContacts.remove(contact);
    request.onsuccess = function () {
      var search = navigator.mozContacts.find({filterBy: ["familyName"],
                                     filterOp: ["equals"],
                                     filterValue: "Kal-El"});
      search.onsuccess = function () {
        report('remove', 'Successfully removed contact', "Unsuccessfully removed contact", search.result.length == 0);
        contact = search.result[0];
        if (search.result.length == 0) {
          next();
        }
      };
      search.onerror = function () {
        report('remove', '', 'Search for removed failed', false);
      };
    };
    request.onerror = function () {
      report('remove', '', 'Remove failed', false);
    };
  },
  function () {
    report('notifications', 'Notifications found ' + JSON.stringify(notifications),
                            'Expected more notifications ' +
                             JSON.stringify(notifications), notifications['update'] > 0 &&
                            notifications['create'] > 0 && notifications['remove'] > 0);
    index = 0;

  }];

function next() {
  if (index >= steps.length) {
    return;
  }
  try {
    var i = index++;
    steps[i]();
  } catch(ex) {
    console.log("caught exception " + ex);
  }
}

function selfTest() {
  return navigator.mozContacts !== undefined &&
         navigator.mozContacts.save !== undefined &&
         navigator.mozContacts.getAll !== undefined &&
         navigator.mozContacts.find !== undefined &&
         navigator.mozContacts.clear !== undefined &&
         navigator.mozContacts.remove !== undefined;
}

var clickHandlers = {

  'runall': function () {
    next();
  },
  'clear': function () {
    clear();
  }
};

report('selftest', 'PASS', 'FAIL', selfTest());

document.body.addEventListener('click', function (evt) {
  if (clickHandlers[evt.target.id || evt.target.dataset.fn])
    clickHandlers[evt.target.id || evt.target.dataset.fn].call(this, evt);
});
