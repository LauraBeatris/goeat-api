var crypto = require('crypto')

String.prototype.getBytes = function () {
  var bytes = [];
  for (var i = 0; i < this.length; ++i) {
    bytes.push(this.charCodeAt(i));
  }
  return bytes;
};

module.exports = function convert(secretKey) {
  var message = 'SendRawEmail'
  var version = new Buffer([0x02])
  var signature = crypto.createHmac('sha256', new Buffer(secretKey.getBytes())).update(message).digest()
  var sigAndVer = Buffer.concat([version, signature])
  
  return sigAndVer.toString('base64')
}
