function getFormattedTime(date) {
  date = date || new Date();
  var minutes = date.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;
  var seconds = date.getSeconds();
  if (seconds < 10) seconds = "0" + seconds;
  return date.getHours() + ":" + minutes + ":" + seconds;
}

function getSpanFromName(spanName) {
  var span = document.getElementById(spanName);
  if (!span) {
    throw spanName + " does not exist";
  }

  return span
}

function report(spanName, passText, failText, result) {
  if (result === undefined) {
    result = true;
  }

  span = getSpanFromName(spanName);
  span.innerHTML = result ? passText : failText;
  span.style.color = result ? 'green' : 'red';
}

function clear(spanName, clearText) {
  clearText = clearText || "None";

  span = getSpanFromName(spanName);
  span.innerHTML = clearText;
  span.style.color = 'red';
}
