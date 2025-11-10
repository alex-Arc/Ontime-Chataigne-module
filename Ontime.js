function init() {
  local.send('{"tag":"version"}');
}

function moduleParameterChanged(param) {
  // TODO: check version upon connection?
  if (param.name == 'connected') {
    script.log('isConnected:' + param.get());
    if (param.get()) {
      local.send('{"tag":"version"}');
    } else {
      local.parameters.ontimeVersion.set('- not connected -');
      local.parameters.clientId.set('- not connected -');
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
 * convert integer to hex string
 * @param {number} val
 * @returns {string}
 */
function toHex(val) {
  if (val == 0) {
    return '00';
  }
  var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
  var result = '';
  var tmp = val;
  while (tmp > 0) {
    result = digits[tmp % 16] + result;
    tmp = Math.floor(tmp / 16);
  }

  if (val < 16) {
    return '0' + result;
  }

  return result;
}

/**
 * pads number with a 0
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
 *
 * @param {number} millis
 * @returns {float}
 */
function floatToMillis(value) {
  if (value) {
    var millis = value;
    if (local.parameters.increasedPrecision.get() == false) {
      return trunc(value) * 1000;
    } else {
      return value * 1000;
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
  var maybeNamedColor = cssNamedColors[value];
  if (maybeNamedColor != null) {
    return parseInt(maybeNamedColor);
  } else if (value.length == 4) {
    // expects #RGB
    var result = '0xff' + value.substring(1, 2) + '0' + value.substring(2, 3) + '0' + value.substring(3, 4) + '0';
    return parseInt(result);
  } else if (value.length == 7) {
    // expoects ##RRGGBB
    return parseInt(value.replace('#', '0xff'));
  } else if (value.length == 9) {
    // expects #RRGGBBAA
    var result = '0x' + value.substring(7, 9) + value.substring(1, 7);
    return parseInt(result);
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
    eventObject.skip.set(payload.skip);
    eventObject.flag.set(payload.flag);
    eventObject.countToEnd.set(payload.countToEnd);
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
    eventObject.skip.set(false);
    eventObject.flag.set(false);
    eventObject.countToEnd.set(false);
    eventObject.note.set('');
    eventObject.colour.set(0x00000000);
    eventObject.cue.set('');
    eventObject.warning.set(0);
    eventObject.danger.set(0);
    //TODO: add custom data
  }
}

/**
 * inserts ontime aux timer data into chataigne container
 * @param {chataigne_container} auxTimerObject
 * @param {ontime_auxtimer} payload
 */
function setAuxTimerData(auxTimerObject, payload) {
  if (payload) {
    auxTimerObject.duration.set(millisToFloat(payload.duration));
    auxTimerObject.current.set(millisToFloat(payload.current));
    auxTimerObject.playback.setData(payload ? payload.playback : '');
    auxTimerObject.direction.setData(payload.direction);
  } else {
    auxTimerObject.duration.set(0);
    auxTimerObject.current.set(0);
    auxTimerObject.playback.setData('');
    auxTimerObject.direction.setData('');
  }
}

/**
 * inserts ontime group data into chataigne container
 * @param {chataigne_container} groupObject
 * @param {ontime_group} payload
 */
function setGroupData(groupObject, payload) {
  if (payload) {
    groupObject.id.set(payload.id);
    groupObject.title.set(payload.title);
    groupObject.note.set(payload.note);
    groupObject.targetDuration.set(millisToFloat(payload.targetDuration));
    groupObject.colour.set(cssColors(payload.colour));
    groupObject.start.set(millisToFloat(payload.timeStart));
    groupObject.end.set(millisToFloat(payload.timeEnd));
    groupObject.duration.set(millisToFloat(payload.duration));
    groupObject.firstEventLinked.set(payload.isFirstLinked);
  } else {
    groupObject.id.set('');
    groupObject.title.set('');
    groupObject.note.set('');
    groupObject.targetDuration.set(0);
    groupObject.colour.set(0x00000000);
    groupObject.start.set(0);
    groupObject.end.set(0);
    groupObject.duration.set(0);
    groupObject.firstEventLinked.set(false);
  }
}

function wsMessageReceived(message) {
  message = JSON.parse(message);
  var tag = message.tag;
  var payload = message.payload;
  
  if (tag == 'runtime-data') {
    if (payload.clock) {
      local.values.clock.set(millisToFloat(payload.clock));
    }
    if (payload.timer) {
      var timer = local.values.mainTimer;

      timer.addedTime.set(millisToFloat(payload.timer.addedTime));
      timer.current.set(millisToFloat(payload.timer.current));
      timer.duration.set(millisToFloat(payload.timer.duration));
      timer.elapsed.set(millisToFloat(payload.timer.elapsed));
      timer.expectedFinish.set(millisToFloat(payload.timer.expectedFinish));
      timer.phase.setData(payload.timer.phase);
      timer.playback.setData(payload.timer.playback);
      timer.startedAt.set(millisToFloat(payload.timer.startedAt));
    }
    if (payload.message) {
      var messageTimer = local.values.message.timer;

      messageTimer.text.set(payload.message.timer.text);
      messageTimer.visible.set(payload.message.timer.visible);
      messageTimer.blink.set(payload.message.timer.blink);
      messageTimer.blackout.set(payload.message.timer.blackout);
      messageTimer.secondary.set(payload.message.secondary);
      if (payload.message.timer.secondarySource === null) {
        messageTimer.secondarySource.setData('off');
      } else {
        messageTimer.secondarySource.setData(payload.message.timer.secondarySource);
      }
      script.log('Payload:' + JSON.stringify(payload.message.timer.secondarySource));
    }
    if (payload.rundown) {
      var rundown = local.values.rundown;

      rundown.selectedEventIndex.set(payload.rundown.selectedEventIndex === null ? 0 : payload.rundown.selectedEventIndex + 1); // Off by 1, 0 when inactive
      rundown.numEvents.set(payload.rundown.numEvents);
      rundown.plannedStart.set(millisToFloat(payload.rundown.plannedStart));
      rundown.plannedEnd.set(millisToFloat(payload.rundown.plannedEnd));
      rundown.actualStart.set(millisToFloat(payload.rundown.actualStart));
      rundown.actualGroupStart.set(millisToFloat(payload.rundown.actualGroupStart));
      rundown.currentDay.set(millisToFloat(payload.rundown.currentDay));
    }
    if (payload.offset) {
      var offset = local.values.offset;

      offset.absolute.set(millisToFloat(payload.offset.absolute));
      offset.relative.set(millisToFloat(payload.offset.relative));
      offset.mode.setData(payload.offset.mode);
      offset.expectedFlagStart.set(millisToFloat(payload.offset.expectedFlagStart));
      offset.expectedGroupEnd.set(millisToFloat(payload.offset.expectedGroupEnd));
      offset.expectedRundownEnd.set(millisToFloat(payload.offset.expectedRundownEnd));
    }
    if (typeof payload.eventNow !== 'undefined') {
      var currentEvent = local.values.currentEvent;
      setEventData(currentEvent, payload.eventNow);
    }
    if (typeof payload.eventNext !== 'undefined') {
      var nextEvent = local.values.nextEvent;
      setEventData(nextEvent, payload.eventNext);
    }
    if (typeof payload.eventFlag !== 'undefined') {
      var nextEvent = local.values.flagEvent;
      setEventData(nextEvent, payload.eventFlag);
    }
    if (typeof payload.groupNow !== 'undefined') {
      var currentGroup = local.values.currentGroup;
      setGroupData(currentGroup, payload.groupNow);
    }
    if (payload.auxtimer1) {
      var auxTimer1 = local.values.auxTimer1;
      setAuxTimerData(auxTimer1, payload.auxtimer1);
    }
    if (payload.auxtimer2) {
      var auxTimer2 = local.values.auxTimer2;
      setAuxTimerData(auxTimer2, payload.auxtimer2);
    }
    if (payload.auxtimer3) {
      var auxTimer3 = local.values.auxTimer3;
      setAuxTimerData(auxTimer3, payload.auxtimer3);
    }
  } else if (tag == 'version') {
    local.parameters.ontimeVersion.set(payload);
  } else if (tag == 'client-init') {
    local.parameters.clientId.set(payload.clientId);
    local.parameters.clientName.set(payload.clientName);
  } else if (tag == 'refetch') {
    script.log('refetch target: ' + payload.target);
  } else if (tag == 'log') {
    if (payload.level == 'ERROR') {
      script.logError(payload.id + ':' + payload.origin + ' : ' + payload.text);
    } else {
      script.log('tag received: ' + tag + '\nPayload:' + JSON.stringify(payload));
    }
  } else {
    script.log('tag received: ' + tag + '\nPayload:' + JSON.stringify(payload));
  }
}

/**
 *
 * Functions related to available commands
 *
 */

function generalAction(action, addtime, offsetMode) {
  if (action == 'addtime') {
      local.send('{"tag":"addtime", "payload":{"add":' + floatToMillis(addtime) + '}}');
  } else if (action == 'roll' || action == 'stop' || action == 'pause' || action == 'reload') {
    local.send('{"tag":"' + action + '"}');
  } else if (action == 'startNext') {
    local.send('{"tag":"start", "payload":"next"}');
  } else if (action == 'startPrevious') {
    local.send('{"tag":"start", "payload":"previous"}');
  } else if (action == 'loadNext') {
    local.send('{"tag":"load", "payload":"next"}');
  } else if (action == 'loadPrevious') {
    local.send('{"tag":"load", "payload":"previous"}');
  } else if (action == 'offsetMode') {
    local.send('{"tag":"offsetmode", "payload":"'+ offsetMode +'"}');
  } else {
    local.send('{"tag":"' + action + '"}');
  }
}

function eventAction(type, id, action) {
  local.send('{"tag":"' + action + '","payload":{ "' + type + '":"' + id + '"}}');
}

function messageAction(
  action,
  setTimerMessage,
  showTimerMessage,
  blinkTimer,
  blackoutTimer,
  setExternalMessage,
  showSecondarySource
) {
  if (action == 'setTimerMessage') {
    local.send('{"tag":"message", "payload":{"timer":{"text":"' + setTimerMessage + '"}}}');
  } else if (action == 'showTimerMessage') {
    local.send('{"tag":"message", "payload":{"timer":{"visible":' + showTimerMessage + '}}}');
  } else if (action == 'blinkTimer') {
    local.send('{"tag":"message", "payload":{"timer":{"blink":' + blinkTimer + '}}}');
  } else if (action == 'blackoutTimer') {
    local.send('{"tag":"message", "payload":{"timer":{"blackout":' + blackoutTimer + '}}}');
  } else if (action == 'setExternalMessage') {
    local.send('{"tag":"message", "payload":{"secondary":"' + setExternalMessage + '"}}');
  } else if (action == 'showSecondarySource') {
    local.send('{"tag":"message", "payload":{"timer":{"secondarySource":"' + showSecondarySource + '"}}}');
  }
}

function auxTimer(index, action, duration, direction, addtime) {
  if (action == 'set') {
    local.send( '{"tag":"auxtimer", "payload":{"' + index + '":{"duration":' + floatToMillis(duration) + '}}}' );
    local.send( '{"tag":"auxtimer", "payload":{"' + index + '":{"direction":"' + direction + '"}}}' );
  } else if (action == "addtime") {
    local.send('{"tag":"auxtimer", "payload":{"' + index + '":{"addtime":' + floatToMillis(addtime) +'}}}');
  } else if (action == 'start' || action == 'pause' || action == 'stop') {
    local.send('{"tag":"auxtimer", "payload":{"' + index + '":"' + action + '"}}');
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
  duration,
  skip,
  flag,
  timerType,
  endAction,
  countToEnd,
  timeWarning,
  timeDanger,
  selectColour,
  pickColour,
  writeColour,
  customID,
  customText,
) {
  // TODO: a timeout that won't let users spam change requests?
  var changeAction = {
    title: ['title', title],
    note: ['note', note],
    cue: ['cue', cue],
    timeStart: ['timeStart', floatToMillis(timeStart)],
    linkStart: ['linkStart', linkStart],
    timeEnd: ['timeEnd', floatToMillis(timeEnd)],
    duration: ['duration', floatToMillis(duration)],
    skip: ['skip', skip],
    flag: ['flag', flag],
    timerType: ['timerType', timerType],
    endAction: ['endAction', endAction],
    countToEnd: ['countToEnd', countToEnd],
    timeWarning: ['timeWarning', floatToMillis(timeWarning)],
    timeDanger: ['timeDanger', floatToMillis(timeDanger)],
    selectColour: ['colour', selectColour == 'none' ? '' : selectColour],
    pickColour: [
      'colour',
      '#' +
        toHex(parseInt(pickColour[0] * 255)) +
        toHex(parseInt(pickColour[1] * 255)) +
        toHex(parseInt(pickColour[2] * 255)) +
        toHex(parseInt(pickColour[3] * 255)),
    ],
    writeColour: ['colour', writeColour],
    custom: ['custom:' + customID, customText],
  };
  local.send(
    '{"tag":"change", "payload":{"' + id + '":{"' + changeAction[action][0] + '":"' + changeAction[action][1] + '"}}}',
  );
}

var cssNamedColors = {
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
