/**
* pads some side
*/
function pad(side, num, ch) {
  var 
    exp = `${side === 'left' ? '' : '^'}.{${num}}${side === 'right' ? '' : '$'}`,
    re = new RegExp(exp), pad = '';
  do {
    pad += ch;
  } while(pad.length < num);
  
  return re.exec( (side === 'left') ? (pad + this) : (this + pad) )[0];
}

if (!String.prototype.padRight) {
  String.prototype.padRight = function (num, ch) { return pad.call(this, 'right', num, ch); };
}

if (!String.prototype.padLeft) {
  String.prototype.padLeft = function (num, ch) { return pad.call(this, 'left', num, ch); };
}
