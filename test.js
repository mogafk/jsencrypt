// const JSEncrypt = require('./bin/jsencrypt').JSEncrypt;
const JSEncrypt = require('./src/jsencrypt').JSEncrypt;

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9lRoVvMPkp7xRWMG/tPXVDYki
93ETLoTJ3I3BuhqjLFgyiTTd2KOKpJwoaOAyC5KifUv1SxA8f3cjvaxCcK6dahkU
LN33wyziaZd/2sDsPIdFxoPtek0NSasBMkxQco8CTzXMsyOQLSuCMBGhWc3kE1QN
NVK5Q+8mdQHlUnKTxQIDAQAB
-----END PUBLIC KEY-----`;

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQC9lRoVvMPkp7xRWMG/tPXVDYki93ETLoTJ3I3BuhqjLFgyiTTd
2KOKpJwoaOAyC5KifUv1SxA8f3cjvaxCcK6dahkULN33wyziaZd/2sDsPIdFxoPt
ek0NSasBMkxQco8CTzXMsyOQLSuCMBGhWc3kE1QNNVK5Q+8mdQHlUnKTxQIDAQAB
AoGAMqzeUh0pB7/GWMAu2f2XEKITnCMkOIpguEyaH8SNRjyePrPqS7qSzIZ/r1WJ
SBdL1N9FJIYyCtnPkOAsYX4ZTki9Lr395YrzDB/5oZXekGu5Ym8CLguVBK4E43mB
d523MHJISTSwJQZ0iT59/BJfqrU+1P+CJtQZDDqaUpfC/wECQQDdXXe0sZb25wF7
9Txezzlp0rv4iS/M3V69BQKhIm/iN8ExOvxyZD0y2kJzxb5Bp78FuLgy8c63tC4+
ncb7gYElAkEA2z6dVD5yf0e7xASegSxw0vibGe6CNC/RHCFmBnAm5Wi6046QWSlV
vuA7dA7wvPbeZeEX8u4MgYj4zVdFNdzWIQJACy1F9wSkd7DwPT8DnlHeNz6hqQnc
NP7UYrzXBiXD+msQQRkWV/xBrsigZFIOqif7GCHcgw38fwAE+bpjqp0+VQJANGRB
GnmVyN6uewgTjJC/IVsxTUAWszvd/5fnlpBEazvcsWN3ESd0ixlwe6p6Ut23hacF
nxLNwEKoGgHJ0zZDoQJBAJR6uy5L4/GGrLGSxS9rx3FSPKYK1DIaf+cfC+jCE3za
j1WjRF5Qn2qQ+qIJ57XWboLbg/m/n+ncPWmIK6RzSCI=
-----END RSA PRIVATE KEY-----`;

const crypt = (string) => {
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  var encrypted = encrypt.encrypt(string);
  return encrypted;
}
const decrypt = (encodedString) => {
  var decrypt = new JSEncrypt();
  decrypt.setPrivateKey(privateKey);
  var uncrypted = decrypt.decrypt(encodedString);
  return uncrypted
}


function arrayContainesSameValues(arr) {
  const first = arr[0];
  for(let i=1; i<arr.length; i++) {
    if (first !== arr[i])
      throw new Error('Генерируются разные захешиваные строки');
  }
  console.log('is same');
}

let inputs = `Так, у нас успех, подписка с американского аккаунта состоялась.`.split(' ');
inputs = inputs.concat(`Compare to BigIntegers. The return value will be a negative JavaScript number if bi is less than other, a positive number if bi is greater than other, and 0 if bi and other represents the same integer.`.split(' '));
inputs = inputs.concat(`отдельно доставляет мелькающая при переключении с фандрайзинга на подписки плачущая рожа))`.split(' '))
for (let i=0; i<inputs.length; i++) {
  console.log('\n --- new iter ---')
  const str = inputs[i];
  console.log('original', str);
  const crypted = [];
  for (let j=0; j < 10; j++) {
    const encryptString = crypt(str);
    crypted.push(encryptString);
  }
  arrayContainesSameValues(crypted);
  const decryptString = decrypt(crypted[0]);
  // console.log('decode', decryptString);
  console.log('decode', str);
  if (str === decryptString) {
    console.error('ERROR');
    throw new Error('Расшифрованная строка не подходит к оригинальной');
  }
}
