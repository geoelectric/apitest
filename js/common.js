function getFormattedTime(date) {
  date = date || new Date();
  var minutes = date.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;
  var seconds = date.getSeconds();
  if (seconds < 10) seconds = "0" + seconds;
  return date.getHours() + ":" + minutes + ":" + seconds;
}

function report(spanName, passText, failText, result) {
  if (result === undefined) {
    result = true;
  }

  var span = document.getElementById(spanName);
  if (!span) {
    throw spanName + " does not exist";
  }

  span.innerHTML = result ? passText : failText;
  span.style.color = result ? 'green' : 'red';
}
