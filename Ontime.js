function init() {}

function moduleParameterChanged(param) {
  // TODO: check version upon connection?
  if (param.name == 'connected') {
    script.log('isConnected:' + param.get());
    if (param.get()) {
      local.send('{"type":"version"}');
    } else {
      local.parameters.version.set('- not connected -');
    }
  } else {
    script.log('Parameter:' + param.name + ' : ' + param.get());
  }
  // else { local.values.version.set("- not connected -")}; */
}

function moduleValueChanged(value) {
  // script.log("moduleValueChanged: " + value);
}

/**
 *
 * @param {number} val
 * @returns {string}
 */
function pad(val) {
  return val > 9 ? '' + val : '0' + val;
}

/**
 * implement trunc spec (https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.trunc)
 * @param {number} val
 * @returns {number}
 */
function trunc(val) {
  return val > 0 ? Math.floor(val) : Math.ceil(val);
}

/**
 *
 * @param {number} millis
 * @returns {string}
 */
function millisToString(millis) {
  var isNegative = millis < 0 ? '-' : '';
  millis = Math.abs(millis);
  var sec = pad(parseInt(millis / 1000) % 60);
  var min = pad(parseInt(millis / (1000 * 60)) % 60);
  var hour = pad(parseInt(millis / (1000 * 60 * 60)) % 60);

  return isNegative + hour + ':' + min + ':' + sec;
}
/**
 *
 * @param {number} millis
 * @returns {float}
 */
function millisToFloat(millis) {
  if (millis) {
    var sec = millis / 1000;
    return trunc(sec);
  } else {
    return 0;
  }
}

function setEventData(eventObject, payload) {
  if (payload) {
    eventObject.id.set(payload.id);
    eventObject.title.set(payload.title);
    eventObject.start.set(millisToFloat(payload.timeStart));
    eventObject.end.set(millisToFloat(payload.timeEnd));
    eventObject.duration.set(millisToFloat(payload.duration));
    eventObject.endAction.setData(payload.endAction);
    eventObject.timerType.setData(payload.timerType);
    eventObject.public.set(payload.isPublic);
    eventObject.skip.set(payload.skip);
    eventObject.note.set(payload.note);
    //TODO: Colour conversion
    eventObject.colour.set(payload.colour);
    eventObject.cue.set(payload.cue);
    eventObject.warning.set(millisToFloat(payload.timeWarning));
    eventObject.danger.set(millisToFloat(payload.timeDanger));
    //TODO: add custom data
  } else {
    eventObject.id.set('');
    eventObject.title.set('');
    eventObject.start.set(0);
    eventObject.end.set(0);
    eventObject.duration.set(0);
    eventObject.endAction.setData('');
    eventObject.timerType.setData('');
    eventObject.public.set(false);
    eventObject.skip.set(false);
    eventObject.note.set('');
    //TODO: Colour conversion
    eventObject.colour.set('');
    eventObject.cue.set('');
    eventObject.warning.set(0);
    eventObject.danger.set(0);
    //TODO: add custom data
  }
}

function wsMessageReceived(message) {
  message = JSON.parse(message);
  var type = message.type;
  var payload = message.payload;

  if (type == 'ontime') {
  } else if (type == 'ontime-clock') {
    local.values.clock.set(millisToString(payload));
  } else if (type == 'ontime-onAir') {
    local.values.onAir.set(payload);
  } else if (type == 'ontime-timer') {
    var timer = local.values.mainTimer;

    timer.addedTime.set(payload.addedTime);
    timer.current.set(payload.current);
    timer.duration.set(payload.duration);
    timer.elapsed.set(payload.elapsed);
    timer.expectedFinish.set(payload.expectedFinish);
    timer.finishedAt.set(payload.finishedAt);
    timer.playback.set(payload.playback);
    timer.startedAt.set(payload.startedAt);
  } else if (type == 'ontime-message') {
    var messageTimer = local.values.message.timer;
    var messageExternal = local.values.message.external;

    messageTimer.text.set(payload.timer.text);
    messageTimer.visible.set(payload.timer.visible);
    messageTimer.blink.set(payload.timer.blink);
    messageTimer.blackout.set(payload.timer.blackout);

    messageExternal.text.set(payload.external.text);
    messageExternal.visible.set(payload.external.visible);
  } else if (type == 'ontime-runtime') {
    var runtime = local.values.runtime;

    runtime.selectedEventIndex.set(payload.selectedEventIndex === null ? 0 : payload.selectedEventIndex + 1); // Off by 1, starts at 0, -1 when inactive
    runtime.numEvents.set(payload.numEvents);
    runtime.offset.set(millisToString(payload.offset));
    runtime.plannedStart.set(millisToString(payload.plannedStart));
    runtime.plannedEnd.set(millisToString(payload.plannedEnd));
    runtime.actualStart.set(millisToString(payload.actualStart));
    runtime.expectedEnd.set(millisToString(payload.expectedEnd));
  } else if (type == 'ontime-eventNow') {
    var currentEvent = local.values.currentEvent;
    setEventData(currentEvent, payload);
  } else if (type == 'ontime-eventNext') {
    var nextEvent = local.values.nextEvent;
    setEventData(nextEvent, payload);
  } else if (type == 'ontime-publicEventNow') {
    var currentPublicEvent = local.values.currentPublicEvent;
    setEventData(currentPublicEvent, payload);
  } else if (type == 'ontime-publicEventNext') {
    var nextPublicEvent = local.values.nextPublicEvent;
    setEventData(nextPublicEvent, payload);
  } else if (type == 'ontime-refetch') {
    script.log('refetch');
  } else if (type == 'ontime-auxtimer1') {
    var auxTimer = local.values.auxTimer1;
    auxTimer.duration.set(millisToFloat(payload.duration));
    auxTimer.current.set(millisToFloat(payload.current));
    auxTimer.playback.setData(payload ? payload.playback : '');
    auxTimer.direction.setData(payload.direction);
  } else if (type == 'poll') {
    script.log('poll');
  } else if (type == 'version') {
    local.parameters.ontimeVersion.set(payload);
  } else if (type == 'client-name') {
    local.parameters.clientName.set(payload);
  } else if (type == 'ontime-log') {
  } else {
    script.log('type received: ' + type + '\nPayload:' + JSON.stringify(payload));
  }
}

/**
 *
 * Functions related to available commands
 *
 */

function generalAction(action, offset) {
  if (action == 'offset') {
    if (offset > 0) {
      local.send('{"type":"addtime", "payload":{"add":' + offset + '}}');
    } else if (offset < 0) {
      local.send('{"type":"addtime", "payload":{"remove":' + offset + '}}');
    }
  } else if (action == 'roll' || action == 'stop' || action == 'pause' || action == 'reload') {
    local.send('{"type":"' + action + '"}');
  } else if (action == 'startNext') {
    local.send('{"type":"start", "payload":"next"}');
  } else if (action == 'startPrevious') {
    local.send('{"type":"start", "payload":"previous"}');
  } else if (action == 'loadNext') {
    local.send('{"type":"load", "payload":"next"}');
  } else if (action == 'loadPrevious') {
    local.send('{"type":"load", "payload":"previous"}');
  } else {
    local.send('{"type":"' + action + '"}');
  }
}

function eventAction(type, id, action) {
  local.send('{"type":"' + action + '","payload":{ "' + type + '":"' + id + '"}}');
}

function messageAction(
  action,
  setTimerMessage,
  showTimerMessage,
  blinkTimer,
  blackoutTimer,
  setExternalMessage,
  showExternalMessage,
) {
  if (action == 'setTimerMessage') {
    local.send('{"type":"message", "payload":{"timer":{"text":"' + setTimerMessage + '"}}}');
  } else if (action == 'showTimerMessage') {
    local.send('{"type":"message", "payload":{"timer":{"visible":' + showTimerMessage + '}}}');
  } else if (action == 'blinkTimer') {
    local.send('{"type":"message", "payload":{"timer":{"blink":' + blinkTimer + '}}}');
  } else if (action == 'blackoutTimer') {
    local.send('{"type":"message", "payload":{"timer":{"blackout":' + blackoutTimer + '}}}');
  } else if (action == 'setExternalMessage') {
    local.send('{"type":"message", "payload":{"external":{"text":"' + setExternalMessage + '"}}}');
  } else if (action == 'showExternalMessage') {
    local.send('{"type":"message", "payload":{"external":{"visible":' + showExternalMessage + '}}}');
  }
}

function auxTimer(index, action, duration, direction) {
  if (action == 'set') {
    local.send(
      '{"type":"auxtimer", "payload":{"' + index + '":{"duration":' + duration + ',"direction":"' + direction + '"}}}',
    );
  } else if (action == 'start' || action == 'pause' || action == 'stop') {
    local.send('{"type":"auxtimer", "payload":{"' + index + '":"' + action + '"}}');
  }
}
function changeEvent(
  id,
  action,
  title,
  note,
  cue,
  timeStart,
  linkStart,
  timeEnd,
  timeStrategy,
  duration,
  skip,
  public,
  timerType,
  endAction,
  timeWarning,
  timeDanger,
  colour,
  color,
  customID,
  customText,
) {
  if (action == 'title') {
    local.send('{"type":"change", "payload":{"' + id + '":{"title":"' + title + '"}}}');
  } else if (action == 'note') {
    local.send('{"type":"change", "payload":{"' + id + '":{"note":"' + note + '"}}}');
  } else if (action == 'cue') {
    local.send('{"type":"change", "payload":{"' + id + '":{"cue":"' + cue + '"}}}');
  } else if (action == 'timeStart') {
    timeStart = parseInt(timeStart) * 1000;
    local.send('{"type":"change", "payload":{"' + id + '":{"timeStart":' + timeStart + '}}}');
  } else if (action == 'linkStart') {
    // Currently not working. Only links to specific event? not previous?
    local.send('{"type":"change", "payload":{"' + id + '":{"linkStart":' + linkStart + '}}}');
  } else if (action == 'timeEnd') {
    // Currently not working
    timeEnd = parseInt(timeEnd) * 1000;
    local.send('{"type":"change", "payload":{"' + id + '":{"timeEnd":' + timeEnd + '}}}');
  } else if (action == 'timeStrategy') {
    // Currently not working
    if (timeStrategy == 'lock-end') {
      local.send('{"type":"change", "payload":{"' + id + '":{"timeStrategy":"lock-end"}}}');
    } else if (timeStrategy == 'lock-duration') {
      local.send('{"type":"change", "payload":{"' + id + '":{"timeStrategy":"lock-duration"}}}');
    }
  } else if (action == 'duration') {
    duration = parseInt(duration);
    local.send('{"type":"change", "payload":{"' + id + '":{"duration":' + duration + '}}}');
  } else if (action == 'skip') {
    local.send('{"type":"change", "payload":{"' + id + '":{"' + action + '":' + skip + '}}}');
  } else if (action == 'isPublic') {
    // Currently not working
    local.send('{"type":"change", "payload":{"' + id + '":{"isPublic":' + public + '}}}');
  } else if (action == 'timerType') {
    // Currently not working
    local.send('{"type":"change", "payload":{"' + id + '":{"' + action + '":"' + timerType + '"}}}');
  } else if (action == 'endAction') {
    // Currently not working
    local.send('{"type":"change", "payload":{"' + id + '":{"' + action + '":"' + endAction + '"}}}');
  } else if (action == 'timeWarning') {
    // Currently not working
    timeWarning = parseInt(timeWarning) * 1000;
    local.send('{"type":"change", "payload":{"' + id + '":{"timeEnd":' + timeWarning + '}}}');
  } else if (action == 'timeDanger') {
    // Currently not working
    timeDanger = parseInt(timeDanger) * 1000;
    local.send('{"type":"change", "payload":{"' + id + '":{"timeEnd":' + timeDanger + '}}}');
  } else if (action == 'colour') {
    //user selects enumerated value.
    if (color == 'none') {
      local.send('{"type":"change", "payload":{"' + id + '":{"colour":""}}}');
    } else {
      local.send('{"type":"change", "payload":{"' + id + '":{"colour":"' + colour + '"}}}'); //using enum
    }
  } else if (action == 'color') {
    //user inputs string
    local.send('{"type":"change", "payload":{"' + id + '":{"colour":"' + color + '"}}}'); //writing value
  } else if (action == 'custom') {
    local.send('{"type":"change", "payload":{"' + id + '":{"custom:' + customID + '":"' + customText + '"}}}');
  }
}
