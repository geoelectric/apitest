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

var Utility = {
  areEqual: function(x, y) {
    for (var p in y) {
      if(typeof(y[p]) !== typeof(x[p])) return false;
      if((y[p]===null) !== (x[p]===null)) return false;
      switch (typeof(y[p])) {
        case 'undefined':
          if (typeof(x[p]) != 'undefined') return false;
            break;
        case 'object':
          if(y[p]!==null && x[p]!==null && (y[p].constructor.toString() !== x[p].constructor.toString() || !y[p].equals(x[p]))) return false;
            break;
        case 'function':
          if (p != 'equals' && y[p].toString() != x[p].toString()) return false;
            break;
        default:
          if (y[p] !== x[p]) return false;
      }
    }
    return true;
  }
}
