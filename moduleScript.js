function init() {}

function moduleParameterChanged(param) {}

function moduleValueChanged(value) {
  // script.log("moduleValueChanged: " + value);

}

function millisToString(millis) {
  var sec = parseInt(millis / 1000) % 60;
  var min = parseInt(millis / (1000 * 60)) % 60;
  var hour = parseInt(millis / (1000 * 60 * 60)) % 60;

  return hour + ":" + min + ":" + sec;
}

function wsMessageReceived(message) {
  message = JSON.parse(message);
  var type = message.type;
  var payload = message.payload;

  if (type == "ontime") {
    // script.log("type received: " + type);
    // script.log("type received: " + JSON.stringify(message));
    
    local.values.clockmillis.set(payload.clock);
    local.values.clock.set(millisToString(payload.clock));
    
    local.values.onAir.set(payload.onAir);

    local.values.playback.set(payload.timer.playback);
    script.log(JSON.stringify(payload.timer));

  } else if (type == "ontime-clock") {
    local.values.clockmillis.set(payload);
    local.values.clock.set(millisToString(payload));
  } else if (type == "ontime-onAir") {
    local.values.onAir.set(payload);
  }  else {
    script.log("type received: " + type);
  }
}
