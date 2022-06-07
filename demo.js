const str = 'Ş';
const buf = Buffer.from(str, 'ascii');
console.log(buf.toString("utf8"));