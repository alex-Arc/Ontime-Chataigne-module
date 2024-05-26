function init() {
  local.send('{"type":"version"}');
}

function moduleParameterChanged(param) {
  // TODO: check version upon connection?
  if (param.name == 'connected') {
    script.log('isConnected:' + param.get());
    if (param.get()) {
      local.send('{"type":"version"}');
    } else {
      local.parameters.ontimeVersion.set('- not connected -');
      local.parameters.clientName.set('- not connected -');
    }
  } else {
    script.log('Parameter:' + param.name + ' : ' + param.get());
  }
}

function moduleValueChanged(value) {
  // script.log("moduleValueChanged: " + value);
}

/**
 *  pads number with a 0
 * @param {number} val
 * @returns {string}
 */
function pad(val) {
  return val > 9 ? '' + val : '0' + val;
}

/**
 * Truncates to int
 * @param {number} val
 * @returns {number}
 */
function trunc(val) {
  return val > 0 ? Math.floor(val) : Math.ceil(val);
}

/**
 * Converts milliseconds to a hh:mm:ss string
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
    if (local.parameters.increasedPrecision.get() == false) {
      return trunc(sec);
    } else {
      return sec;
    }
  } else {
    return 0;
  }
}

/**
 * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/named-color css colours}
 * @param {string} value
 * @returns {hexInteger}
 */
function cssColors(value) {
  var cssColors = {
    aliceblue: '0xfff0f8ff',
    antiquewhite: '0xfffaebd7',
    aqua: '0xff00ffff',
    aquamarine: '0xff7fffd4',
    azure: '0xfff0ffff',
    beige: '0xfff5f5dc',
    bisque: '0xffffe4c4',
    black: '0xff000000',
    blanchedalmond: '0xffffebcd',
    blue: '0xff0000ff',
    blueviolet: '0xff8a2be2',
    brown: '0xffa52a2a',
    burlywood: '0xffdeb887',
    cadetblue: '0xff5f9ea0',
    chartreuse: '0xff7fff00',
    chocolate: '0xffd2691e',
    coral: '0xffff7f50',
    cornflowerblue: '0xff6495ed',
    cornsilk: '0xfffff8dc',
    crimson: '0xffdc143c',
    cyan: '0xff00ffff',
    darkblue: '0xff00008b',
    darkcyan: '0xff008b8b',
    darkgoldenrod: '0xffb8860b',
    darkgray: '0xffa9a9a9',
    darkgreen: '0xff006400',
    darkgrey: '0xffa9a9a9',
    darkkhaki: '0xffbdb76b',
    darkmagenta: '0xff8b008b',
    darkolivegreen: '0xff556b2f',
    darkorange: '0xffff8c00',
    darkorchid: '0xff9932cc',
    darkred: '0xff8b0000',
    darksalmon: '0xffe9967a',
    darkseagreen: '0xff8fbc8f',
    darkslateblue: '0xff483d8b',
    darkslategray: '0xff2f4f4f',
    darkslategrey: '0xff2f4f4f',
    darkturquoise: '0xff00ced1',
    darkviolet: '0xff9400d3',
    deeppink: '0xffff1493',
    deepskyblue: '0xff00bfff',
    dimgray: '0xff696969',
    dimgrey: '0xff696969',
    dodgerblue: '0xff1e90ff',
    firebrick: '0xffb22222',
    floralwhite: '0xfffffaf0',
    forestgreen: '0xff228b22',
    fuchsia: '0xffff00ff',
    gainsboro: '0xffdcdcdc',
    ghostwhite: '0xfff8f8ff',
    gold: '0xffffd700',
    goldenrod: '0xffdaa520',
    gray: '0xff808080',
    green: '0xff008000',
    greenyellow: '0xffadff2f',
    grey: '0xff808080',
    honeydew: '0xfff0fff0',
    hotpink: '0xffff69b4',
    indianred: '0xffcd5c5c',
    indigo: '0xff4b0082',
    ivory: '0xfffffff0',
    khaki: '0xfff0e68c',
    lavender: '0xffe6e6fa',
    lavenderblush: '0xfffff0f5',
    lawngreen: '0xff7cfc00',
    lemonchiffon: '0xfffffacd',
    lightblue: '0xffadd8e6',
    lightcoral: '0xfff08080',
    lightcyan: '0xffe0ffff',
    lightgoldenrodyellow: '0xfffafad2',
    lightgray: '0xffd3d3d3',
    lightgreen: '0xff90ee90',
    lightgrey: '0xffd3d3d3',
    lightpink: '0xffffb6c1',
    lightsalmon: '0xffffa07a',
    lightseagreen: '0xff20b2aa',
    lightskyblue: '0xff87cefa',
    lightslategray: '0xff778899',
    lightslategrey: '0xff778899',
    lightsteelblue: '0xffb0c4de',
    lightyellow: '0xffffffe0',
    lime: '0xff00ff00',
    limegreen: '0xff32cd32',
    linen: '0xfffaf0e6',
    magenta: '0xffff00ff',
    maroon: '0xff800000',
    mediumaquamarine: '0xff66cdaa',
    mediumblue: '0xff0000cd',
    mediumorchid: '0xffba55d3',
    mediumpurple: '0xff9370db',
    mediumseagreen: '0xff3cb371',
    mediumslateblue: '0xff7b68ee',
    mediumspringgreen: '0xff00fa9a',
    mediumturquoise: '0xff48d1cc',
    mediumvioletred: '0xffc71585',
    midnightblue: '0xff191970',
    mintcream: '0xfff5fffa',
    mistyrose: '0xffffe4e1',
    moccasin: '0xffffe4b5',
    navajowhite: '0xffffdead',
    navy: '0xff000080',
    oldlace: '0xfffdf5e6',
    olive: '0xff808000',
    olivedrab: '0xff6b8e23',
    orange: '0xffffa500',
    orangered: '0xffff4500',
    orchid: '0xffda70d6',
    palegoldenrod: '0xffeee8aa',
    palegreen: '0xff98fb98',
    paleturquoise: '0xffafeeee',
    palevioletred: '0xffdb7093',
    papayawhip: '0xffffefd5',
    peachpuff: '0xffffdab9',
    peru: '0xffcd853f',
    pink: '0xffffc0cb',
    plum: '0xffdda0dd',
    powderblue: '0xffb0e0e6',
    purple: '0xff800080',
    rebeccapurple: '0xff663399',
    red: '0xffff0000',
    rosybrown: '0xffbc8f8f',
    royalblue: '0xff4169e1',
    saddlebrown: '0xff8b4513',
    salmon: '0xfffa8072',
    sandybrown: '0xfff4a460',
    seagreen: '0xff2e8b57',
    seashell: '0xfffff5ee',
    sienna: '0xffa0522d',
    silver: '0xffc0c0c0',
    skyblue: '0xff87ceeb',
    slateblue: '0xff6a5acd',
    slategray: '0xff708090',
    slategrey: '0xff708090',
    snow: '0xfffffafa',
    springgreen: '0xff00ff7f',
    steelblue: '0xff4682b4',
    tan: '0xffd2b48c',
    teal: '0xff008080',
    thistle: '0xffd8bfd8',
    tomato: '0xffff6347',
    transparent: '0x00000000',
    turquoise: '0xff40e0d0',
    violet: '0xffee82ee',
    wheat: '0xfff5deb3',
    white: '0xffffffff',
    whitesmoke: '0xfff5f5f5',
    yellow: '0xffffff00',
    yellowgreen: '0xff9acd32',
  };
  if (cssColors[value] != null) {
    return parseInt(cssColors[value]);
  } else if (value.length == 7) {
    return parseInt(value.replace('#', '0xff'));
  } else {
    return 0xff303030; // no or invalid colour
  }
}

/**
 * inserts ontime event data into chataigne container
 * @param {chataigne_container} eventObject
 * @param {ontime_event} payload
 */
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
    eventObject.colour.set(cssColors(payload.colour));
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
    eventObject.colour.set(0x00000000);
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
    local.values.clock.set(millisToFloat(payload));
  } else if (type == 'ontime-onAir') {
    local.values.onAir.set(payload);
  } else if (type == 'ontime-timer') {
    var timer = local.values.mainTimer;

    timer.addedTime.set(millisToFloat(payload.addedTime));
    timer.current.set(millisToFloat(payload.current));
    timer.duration.set(millisToFloat(payload.duration));
    timer.elapsed.set(millisToFloat(payload.elapsed));
    timer.expectedFinish.set(millisToFloat(payload.expectedFinish));
    timer.finishedAt.set(millisToFloat(payload.finishedAt));
    timer.playback.setData(payload.playback);
    timer.startedAt.set(millisToFloat(payload.startedAt));
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

    runtime.currentEventIndex.set(payload.selectedEventIndex === null ? 0 : payload.selectedEventIndex + 1); // Off by 1, 0 when inactive
    runtime.numEvents.set(payload.numEvents);
    runtime.offset.set(millisToFloat(payload.offset));
    runtime.plannedStart.set(millisToFloat(payload.plannedStart));
    runtime.plannedEnd.set(millisToFloat(payload.plannedEnd));
    runtime.actualStart.set(millisToFloat(payload.actualStart));
    runtime.expectedEnd.set(millisToFloat(payload.expectedEnd));
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
    // TODO: ability to label aux timers and prepare ability to have more than one?
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
    if (payload.level == 'ERROR') {
      script.logError(payload.id + ':' + payload.origin + ' : ' + payload.text);
    } else {
      script.log('type received: ' + type + '\nPayload:' + JSON.stringify(payload));
    }
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
  selectColour,
  pickColour,
  writeColour,
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
    // Not whitelisted
    timeStart = parseInt(timeStart) * 1000;
    local.send('{"type":"change", "payload":{"' + id + '":{"timeStart":' + timeStart + '}}}');
  } else if (action == 'linkStart') {
    // Not whitelisted
    local.send('{"type":"change", "payload":{"' + id + '":{"linkStart":' + linkStart + '}}}');
  } else if (action == 'timeEnd') {
    // Not whitelisted
    timeEnd = parseInt(timeEnd) * 1000;
    local.send('{"type":"change", "payload":{"' + id + '":{"timeEnd":' + timeEnd + '}}}');
  } else if (action == 'timeStrategy') {
    // Not whitelisted
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
    // BUG? Is whitelisted but logged as 'Property isPublic not permitted'
    local.send('{"type":"change", "payload":{"' + id + '":{"isPublic":' + public + '}}}');
  } else if (action == 'timerType') {
    // Not whitelisted
    local.send('{"type":"change", "payload":{"' + id + '":{"' + action + '":"' + timerType + '"}}}');
  } else if (action == 'endAction') {
    // Not whitelisted
    local.send('{"type":"change", "payload":{"' + id + '":{"' + action + '":"' + endAction + '"}}}');
  } else if (action == 'timeWarning') {
    // Not whitelisted
    timeWarning = parseInt(timeWarning) * 1000;
    local.send('{"type":"change", "payload":{"' + id + '":{"timeWarning":' + timeWarning + '}}}');
  } else if (action == 'timeDanger') {
    // Not whitelisted
    timeDanger = parseInt(timeDanger) * 1000;
    local.send('{"type":"change", "payload":{"' + id + '":{"timeDanger":' + timeDanger + '}}}');
  } else if (action == 'selectColour') {
    //user selects enumerated value.
    if (color == 'none') {
      local.send('{"type":"change", "payload":{"' + id + '":{"colour":""}}}');
    } else {
      local.send('{"type":"change", "payload":{"' + id + '":{"colour":"' + selectColour + '"}}}'); //using enum
    }
  } else if (action == 'pickColour') {
    var hexColor = '#000000';
    script.log(
      ' R:' +
        parseInt(pickColour[0] * 256) +
        ' G:' +
        parseInt(pickColour[1] * 256) +
        ' B:' +
        parseInt(pickColour[2] * 256),
    );
    local.send('{"type":"change", "payload":{"' + id + '":{"colour":"' + hexColor + '"}}}'); //writing value
  } else if (action == 'writeColour') {
    //user inputs string
    local.send('{"type":"change", "payload":{"' + id + '":{"colour":"' + writeColour + '"}}}'); //writing value
  } else if (action == 'custom') {
    local.send('{"type":"change", "payload":{"' + id + '":{"custom:' + customID + '":"' + customText + '"}}}');
  }
}
