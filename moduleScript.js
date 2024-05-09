function init() {}

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
    local.values.clock.set(millisToString(payload.clock));

    local.values
      .getChild("Timer")
      .getChild("playback")
      .set(payload.timer.playback);
  } else if (type == "ontime-clock") {
    local.values.clock.set(millisToString(payload));
  } else if (type == "ontime-timer") {
    var timer = local.values.getChild("Timer");
    timer.getChild("Playback").set(payload.timer.playback);
    timer.getChild("Current").set(millisToString(payload.current));
    timer.getChild("Duration").set(millisToString(payload.duration));
    timer.getChild("Elapsed").set(millisToString(payload.elapsed));

    script.log(payload.playback);
  } else {
    script.log("type received: " + type);
  }
}
