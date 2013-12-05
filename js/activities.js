'use strict';


function selfTest() {
  return typeof MozActivity === "function";
}

function getBase64Image(text) {
// Create an empty canvas element
  var canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext("2d");
  ctx.font="20px Arial";
  ctx.fillText(text,10,50);
  var dataURL = canvas.toDataURL();
  return dataURL;
}

var clickHandlers = {
  'predefined': function () {
    activity("pick");
  },
  'appactivity': function () {
    activity("pick2");
  }, 
  'activitydata' : function () {
    activity("dial");
  }, 
  'activityerror' : function () {
    activity("error");
  }
}

function activity(activityname) {
  var val = {
      type: ["image/*", "image/jpeg"]
  };
  if(activityname === "dial"){
      val = {
         type: "webtelephony/number",
         number: "18585551212"
      };
  }
  var activity = new MozActivity({
      name: activityname,
      data: val
  });

  activity.onsuccess = function () {
    console.log("Activity successfully handled");
    var img = document.getElementById("result");
    if (!img) {
      img = document.createElement("img");
      img.id = "result";
      var src = document.getElementById("images");
      src.appendChild(img);
    }
    var dataURL = null;
    if(!this.result) {
      dataURL = getBase64Image("Nothing Returned");
    } else {
      dataURL = this.result.blob;
    }
    img.src = dataURL;
    console.log(dataURL);
  };
  activity.onerror = function() {
    var img = document.getElementById("result");
    if (!img) {
       img = document.createElement("img");
       img.id = "result";
       var src = document.getElementById("images");
       src.appendChild(img);
    }
    img.src = getBase64Image(activity.error.name);
  };
}

report('selftest', 'PASS', 'FAIL', selfTest());

document.body.addEventListener('click', function (evt) {
  if (clickHandlers[evt.target.id || evt.target.dataset.fn])
    clickHandlers[evt.target.id || evt.target.dataset.fn].call(this, evt);
});
