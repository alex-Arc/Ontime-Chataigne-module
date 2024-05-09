function init() {
  
}

function moduleParameterChanged(param) {}

function moduleValueChanged(value) {
  // script.log("moduleValueChanged: " + value);
}

/**
 *
 * @param {number} val
 * @returns {string}
 */
function pad(val) {
  return val > 9 ? "" + val : "0" + val;
}

/**
 *
 * @param {number} millis
 * @returns {string}
 */
function millisToString(millis) {
  var isNegative = millis < 0 ? "-" : "";
  millis = Math.abs(millis);
  var sec = pad(parseInt(millis / 1000) % 60);
  var min = pad(parseInt(millis / (1000 * 60)) % 60);
  var hour = pad(parseInt(millis / (1000 * 60 * 60)) % 60);

  return isNegative + hour + ":" + min + ":" + sec;
}

function wsMessageReceived(message) {
  message = JSON.parse(message);
  var type = message.type;
  var payload = message.payload;

  if (type == "ontime") {
  } else if (type == "ontime-clock") {
    local.values.clock.set(millisToString(payload));
  } else if (type == "ontime-timer") {
    var timer = local.values.getChild("Timer");
    timer.getChild("Playback").set(payload.playback);
    timer.getChild("Current").set(millisToString(payload.current));
    timer.getChild("Duration").set(millisToString(payload.duration));
    timer.getChild("Elapsed").set(millisToString(payload.elapsed));
  } else if (type == "ontime-eventNext") {
    var timer = local.values.getChild("Next Event");
    timer.getChild("Title").set(payload.title);
    timer.getChild("Colour").set(payload.colour);
    timer.getChild("Cue").set(payload.cue);
  } else {
    script.log("type received: " + type);
  }
}
