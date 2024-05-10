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
  } else if (type == "ontime-clock") {
    local.values.clockmillis.set(payload);
    local.values.clock.set(millisToString(payload));
  } else if (type == "ontime-onAir") {
    local.values.onAir.set(payload);
  } else if (type == "ontime-timer") {
    local.values.timer.addedTime.set(payload.addedTime);
    local.values.timer.current.set(payload.current);
    local.values.timer.duration.set(payload.duration);
    local.values.timer.elapsed.set(payload.elapsed);
    local.values.timer.expectedFinish.set(payload.expectedFinish);
    local.values.timer.finishedAt.set(payload.finishedAt);
    local.values.timer.playback.set(payload.playback);
    local.values.timer.secondaryTimer.set(payload.secondaryTimer);
    local.values.timer.startedAt.set(payload.startedAt);
  } else if (type == "ontime-eventNow") {
    if (payload) {
      local.values.eventNow.id.set(payload.id);
      // local.values.eventNow.type.set(payload.type);
      local.values.eventNow.title.set(payload.title);
      local.values.eventNow.timeStart.set(payload.timeStart);
      local.values.eventNow.timeEnd.set(payload.timeEnd);
      local.values.eventNow.duration.set(payload.duration);
      // local.values.eventNow.timeStrategy.set(payload.timeStrategy);
      local.values.eventNow.linkStart.set(payload.linkStart);
      local.values.eventNow.endAction.set(payload.endAction);
      local.values.eventNow.timerType.set(payload.timerType);
      local.values.eventNow.isPublic.set(payload.isPublic);
      local.values.eventNow.skip.set(payload.skip);
      local.values.eventNow.note.set(payload.note);
      local.values.eventNow.colour.set(payload.colour);
      local.values.eventNow.cue.set(payload.cue);
      // local.values.eventNow.revision.set(payload.revision);
      local.values.eventNow.timeWarning.set(payload.timeWarning);
      local.values.eventNow.timeDanger.set(payload.timeDanger);
      local.values.eventNow.delay.set(payload.delay);
      // local.values.eventNow.custom.set(payload.custom);
    } else { script.log("No eventNow data"); } // Should this clear all values??
  } else if (type == "ontime-publicEventNow") {
		local.values.publicEventNow.id.set(payload.id);
		// local.values.publicEventNow.type.set(payload.type);
		local.values.publicEventNow.title.set(payload.title);
		local.values.publicEventNow.timeStart.set(payload.timeStart);
		local.values.publicEventNow.timeEnd.set(payload.timeEnd);
		local.values.publicEventNow.duration.set(payload.duration);
		// local.values.publicEventNow.timeStrategy.set(payload.timeStrategy);
		local.values.publicEventNow.linkStart.set(payload.linkStart);
		local.values.publicEventNow.endAction.set(payload.endAction);
		local.values.publicEventNow.timerType.set(payload.timerType);
		local.values.publicEventNow.isPublic.set(payload.isPublic);
		local.values.publicEventNow.skip.set(payload.skip);
		local.values.publicEventNow.note.set(payload.note);
		local.values.publicEventNow.colour.set(payload.colour);
		local.values.publicEventNow.cue.set(payload.cue);
		// local.values.publicEventNow.revision.set(payload.revision);
		local.values.publicEventNow.timeWarning.set(payload.timeWarning);
		local.values.publicEventNow.timeDanger.set(payload.timeDanger);
		local.values.publicEventNow.delay.set(payload.delay);
		// local.values.publicEventNow.custom.set(payload.custom);
	} else if (type == "ontime-eventNext") {
		local.values.eventNext.id.set(payload.id);
		// local.values.eventNext.type.set(payload.type);
		local.values.eventNext.title.set(payload.title);
		local.values.eventNext.timeStart.set(payload.timeStart);
		local.values.eventNext.timeEnd.set(payload.timeEnd);
		local.values.eventNext.duration.set(payload.duration);
		// local.values.eventNext.timeStrategy.set(payload.timeStrategy);
		local.values.eventNext.linkStart.set(payload.linkStart);
		local.values.eventNext.endAction.set(payload.endAction);
		local.values.eventNext.timerType.set(payload.timerType);
		local.values.eventNext.isPublic.set(payload.isPublic);
		local.values.eventNext.skip.set(payload.skip);
		local.values.eventNext.note.set(payload.note);
		local.values.eventNext.colour.set(payload.colour);
		local.values.eventNext.cue.set(payload.cue);
		// local.values.eventNext.revision.set(payload.revision);
		local.values.eventNext.timeWarning.set(payload.timeWarning);
		local.values.eventNext.timeDanger.set(payload.timeDanger);
		local.values.eventNext.delay.set(payload.delay);
		// local.values.eventNext.custom.set(payload.custom);
	} else if (type == "ontime-publicEventNext") {
		local.values.publicEventNext.id.set(payload.id);
		// local.values.publicEventNext.type.set(payload.type);
		local.values.publicEventNext.title.set(payload.title);
		local.values.publicEventNext.timeStart.set(payload.timeStart);
		local.values.publicEventNext.timeEnd.set(payload.timeEnd);
		local.values.publicEventNext.duration.set(payload.duration);
		// local.values.publicEventNext.timeStrategy.set(payload.timeStrategy);
		local.values.publicEventNext.linkStart.set(payload.linkStart);
		local.values.publicEventNext.endAction.set(payload.endAction);
		local.values.publicEventNext.timerType.set(payload.timerType);
		local.values.publicEventNext.isPublic.set(payload.isPublic);
		local.values.publicEventNext.skip.set(payload.skip);
		local.values.publicEventNext.note.set(payload.note);
		local.values.publicEventNext.colour.set(payload.colour);
		local.values.publicEventNext.cue.set(payload.cue);
		// local.values.publicEventNext.revision.set(payload.revision);
		local.values.publicEventNext.timeWarning.set(payload.timeWarning);
		local.values.publicEventNext.timeDanger.set(payload.timeDanger);
		local.values.publicEventNext.delay.set(payload.delay);
		// local.values.publicEventNext.custom.set(payload.custom);
  } else if (type == "ontime-log") {
		local.values.log.id.set(payload.id);
		local.values.log.level.set(payload.level);
		local.values.log.origin.set(payload.origin);
		local.values.log.text.set(payload.text);
		local.values.log.time.set(payload.time);
  } else if (type == "ontime-runtime") {
		local.values.runtime.selectedEventIndex.set(payload.selectedEventIndex);
		local.values.runtime.numEvents.set(payload.numEvents);
		local.values.runtime.offset.set(payload.offset);
		local.values.runtime.plannedStart.set(payload.plannedStart);
		local.values.runtime.plannedEnd.set(payload.plannedEnd);
		local.values.runtime.actualStart.set(payload.actualStart);
		local.values.runtime.expectedEnd.set(payload.expectedEnd);
  } else if (type == "ontime-message") {
    local.values.messageTimer.text.set(payload.timer.text);
    local.values.messageTimer.visible.set(payload.timer.visible);
    local.values.messageTimer.blink.set(payload.timer.blink);
    local.values.messageTimer.blackout.set(payload.timer.blackout);
    local.values.messageExternal.text.set(payload.external.text);
    local.values.messageExternal.visible.set(payload.external.visible);
	} else if (type == "ontime-refetch") {
		script.log(" : " + type + "\nPayload:" + JSON.stringify(payload));
  } else if (type == "ontime-auxtimer1") {
    //local.values.auxtimer.duration.set(payload.duration);
    //local.values.auxtimer.current.set(payload.current);
    //local.values.auxtimer.playback.set(payload.playback);
    //local.values.auxtimer.direction.set(payload.direction);
  } else if (type == "poll") {
    //local.values.auxtimer.duration.set(payload.duration);
    //local.values.auxtimer.current.set(payload.current);
    //local.values.auxtimer.playback.set(payload.playback);
    //local.values.auxtimer.direction.set(payload.direction);
  } else if (type == "version") {
    //local.values.version.set(payload);
  } else {
    script.log("type received: " + type + "\nPayload:" + JSON.stringify(payload));
  }
}

/**
 *
 * Functions related to available commands
 *
 */

function generalAction(action, offset) {
  if (action == "offset") {
    if (offset > 0) {
      local.send("{\"type\":\"addtime\", \"payload\":{\"add\":"+offset+"}}");
    } else if (offset < 0) {
      local.send("{\"type\":\"addtime\", \"payload\":{\"remove\":"+offset+"}}");
    }
  } else if (action =="roll"||action =="stop"||action=="pause"||action=="reload") {
    local.send("{\"type\":\""+action+ "\"}");
  } else if (action == "startNext") {
    local.send("{\"type\":\"start\", \"payload\":\"next\"}");
  } else if (action == "startPrevious") {
    local.send("{\"type\":\"start\", \"payload\":\"previous\"}");
  } else if (action == "loadNext") {
    local.send("{\"type\":\"load\", \"payload\":\"next\"}");
  } else if (action == "loadPrevious") {
    local.send("{\"type\":\"load\", \"payload\":\"previous\"}");
  } else {
    local.send("{\"type\":\""+action+ "\"}");
  }
}

function eventAction(type, id, action) {
    local.send("{\"type\":\"" + action + "\",\"payload\":{ \""+type+"\":\""+id+ "\"}}");
}

function messageAction(action, setTimerMessage, showTimerMessage, blinkTimer, blackoutTimer, setExternalMessage, showExternalMessage) {
  if (action == "setTimerMessage") {
    local.send("{\"type\":\"message\", \"payload\":{\"timer\":{\"text\":\""+setTimerMessage+"\"}}}");
  } else if (action == "showTimerMessage") {
    local.send("{\"type\":\"message\", \"payload\":{\"timer\":{\"visible\":"+showTimerMessage+"}}}");
  } else if (action == "blinkTimer") {
    local.send("{\"type\":\"message\", \"payload\":{\"timer\":{\"blink\":"+blinkTimer+"}}}");
  } else if (action == "blackoutTimer") {
    local.send("{\"type\":\"message\", \"payload\":{\"timer\":{\"blackout\":"+blackoutTimer+"}}}");
  } else if (action == "setExternalMessage") {
    local.send("{\"type\":\"message\", \"payload\":{\"external\":{\"text\":\""+setExternalMessage+"\"}}}");
  } else if (action == "showExternalMessage") {
    local.send("{\"type\":\"message\", \"payload\":{\"external\":{\"visible\":"+showExternalMessage+"}}}");
  }
}

function auxTimer(index, action, duration, direction) {
  if (action == "set") {
    local.send("{\"type\":\"auxtimer\", \"payload\":{\""+index+"\":{\"duration\":"+duration+",\"direction\":\""+direction+"\"}}}");
  } else if (action == "start"||action=="pause"||action=="stop") {
    local.send("{\"type\":\"auxtimer\", \"payload\":{\""+index+"\":\""+action+"\"}}");
  }
}
function changeEvent(id, action, title, note, cue, timeStart, linkStart, timeEnd, timeStrategy, duration, skip, public, timerType, endAction, timeWarning, timeDanger, colour, color, customID, customText) {
  if (action == "title") {
    local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\"title\":\""+title+"\"}}}");
  } else if (action == "note") {
    local.send("{\"type\":\"change\", \"payload\":{\"" + id + "\":{\"note\":\"" + note + "\"}}}");
  } else if (action == "cue") {
    local.send("{\"type\":\"change\", \"payload\":{\"" + id + "\":{\"cue\":\"" + cue + "\"}}}");
  } else if (action == "timeStart") {
    timeStart = parseInt(timeStart) * 1000;
    local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\"timeStart\":"+timeStart+"}}}");
  } else if (action == "linkStart") { // Currently not working. Only links to specific event? not previous?
    local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\"linkStart\":"+linkStart+"}}}");
  } else if (action == "timeEnd") { // Currently not working
    timeEnd = parseInt(timeEnd) * 1000;
    local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\"timeEnd\":"+timeEnd+"}}}");
  } else if (action == "timeStrategy") { // Currently not working
    if (timeStrategy == "lock-end") {
      local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\"timeStrategy\":\"lock-end\"}}}");
    } else if (timeStrategy == "lock-duration") {
      local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\"timeStrategy\":\"lock-duration\"}}}");
    }
  } else if (action == "duration") {
    duration = parseInt(duration);
    local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\"duration\":"+duration+"}}}");
  } else if (action == "skip") {
    local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\""+action+"\":"+skip+"}}}");
  } else if (action == "isPublic") { // Currently not working
    local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\"isPublic\":"+public+"}}}");
  } else if (action == "timerType") { // Currently not working
    local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\""+action+"\":\""+timerType+"\"}}}");
  } else if (action == "endAction") { // Currently not working
    local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\""+action+"\":\""+endAction+"\"}}}");
  } else if (action == "timeWarning") { // Currently not working
    timeWarning = parseInt(timeWarning) * 1000;
    local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\"timeEnd\":"+timeWarning+"}}}");
  } else if (action == "timeDanger") { // Currently not working
    timeDanger = parseInt(timeDanger) * 1000;
    local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\"timeEnd\":"+timeDanger+"}}}");
  } else if (action == "colour") { //user selects enumerated value.
    if (color == "none") {
      local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\"colour\":\"\"}}}");
    } else {
      local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\"colour\":\""+colour+"\"}}}"); //using enum
    }
  } else if (action == "color") { //user inputs string
    local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\"colour\":\""+color+"\"}}}"); //writing value
  } else if (action == "custom") {
    local.send("{\"type\":\"change\", \"payload\":{\""+id+"\":{\"custom:"+customID+"\":\""+customText+"\"}}}");
  }
}
