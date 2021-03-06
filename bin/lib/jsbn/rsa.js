"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RSAKey = undefined;
exports.parseBigInt = parseBigInt;

var _jsbn = require("./jsbn2");

var _rng = require("./rng");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // Version 1.1: support utf-8 encoding in pkcs1pad2

// convert a (hex) string to a bignum object

function parseBigInt(str, r) {
  return new _jsbn.BigInteger(str, r);
}

function linebrk(s, n) {
  var ret = "";
  var i = 0;
  while (i + n < s.length) {
    ret += s.substring(i, i + n) + "\n";
    i += n;
  }
  return ret + s.substring(i, s.length);
}

function byte2Hex(b) {
  if (b < 0x10) return "0" + b.toString(16);else return b.toString(16);
}
/*
  pkcs1NoPadding fn owner https://github.com/ferdibiflator
*/
function pkcs1NoPadding(s, n) {
  // console.log('s', s);
  // console.log('n', n);
  if (n < s.length + 11) {
    // TODO: fix for utf-8
    console.error("Message too long for RSA");
    return null;
  }
  var ba = new Array();
  var i = s.length - 1;
  // while(i >= 0 && n > 0) {
  //   var c = s.charCodeAt(i--);
  //   console.log('s[i]', s[i]);
  //   console.log('c', c);

  //   if(c < 256) { // encode using utf-8
  //     ba[--n] = c;
  //   } else {
  //     throw Error('There is not valid character with code: ' + c);
  //   }
  // }

  while (i >= 0 && n > 0) {
    // console.log('i', i);
    // console.log('n', n);
    var c = s.charCodeAt(i--);
    if (c < 128) {
      // encode using utf-8
      ba[--n] = c;
    } else if (c > 127 && c < 2048) {
      ba[--n] = c & 63 | 128;
      ba[--n] = c >> 6 | 192;
    } else {
      ba[--n] = c & 63 | 128;
      ba[--n] = c >> 6 & 63 | 128;
      ba[--n] = c >> 12 | 224;
    }
  }
  ba[--n] = 0;
  while (n > 2) {
    ba[--n] = 0;
  }
  // console.log('latest n', n);
  ba[1] = 2;
  ba[0] = 0;

  // console.log('ba', ba);
  var _ba = new _jsbn.BigInteger(ba);
  // console.log('_ba.toString()', _ba.toString(2))

  return new _jsbn.BigInteger(ba);
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s, n) {
  if (n < s.length + 11) {
    // TODO: fix for utf-8
    console.error("Message too long for RSA");
    return null;
  }
  var ba = [];
  var i = s.length - 1;
  while (i >= 0 && n > 0) {
    var c = s.charCodeAt(i--);
    if (c < 128) {
      // encode using utf-8
      ba[--n] = c;
    } else if (c > 127 && c < 2048) {
      ba[--n] = c & 63 | 128;
      ba[--n] = c >> 6 | 192;
    } else {
      ba[--n] = c & 63 | 128;
      ba[--n] = c >> 6 & 63 | 128;
      ba[--n] = c >> 12 | 224;
    }
  }
  ba[--n] = 0;
  var rng = new _rng.SecureRandom();
  var x = [];
  while (n > 2) {
    // random non-zero pad
    x[0] = 0;
    while (x[0] == 0) {
      rng.nextBytes(x);
    }ba[--n] = x[0];
  }
  ba[--n] = 2;
  ba[--n] = 0;
  return new _jsbn.BigInteger(ba);
}

// "empty" RSA key constructor

var RSAKey = exports.RSAKey = function RSAKey() {
  _classCallCheck(this, RSAKey);

  this.n = null;
  this.e = 0;
  this.d = null;
  this.p = null;
  this.q = null;
  this.dmp1 = null;
  this.dmq1 = null;
  this.coeff = null;
};

// Set the public key fields N and e from hex strings


function RSASetPublic(N, E) {
  if (N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N, 16);
    this.e = parseInt(E, 16);
  } else console.error("Invalid RSA public key");
}

// Perform raw public operation on "x": return x^e (mod n)
function RSADoPublic(x) {
  return x.modPowInt(this.e, this.n);
}

// Return the PKCS#1 RSA encryption of "text" as an even-length hex string
function RSAEncrypt(text) {
  var m = pkcs1NoPadding(text, this.n.bitLength() + 7 >> 3);
  // var m = pkcs1pad2(text,(this.n.bitLength()+7)>>3);
  if (m == null) return null;
  var c = this.doPublic(m);
  if (c == null) return null;
  var h = c.toString(16);
  if ((h.length & 1) == 0) return h;else return "0" + h;
}

// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
//function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
//}

// protected
RSAKey.prototype.doPublic = RSADoPublic;

// public
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;
//RSAKey.prototype.encrypt_b64 = RSAEncryptB64;