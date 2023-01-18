// dipendo://info?id=49795

let qrCodes = [];
$(document).ready(ready);

function ready() {
    qr();
}

function addCode() {
    let txtCode = $('#txtCode').val().trim();
    if (txtCode.length < 5) {
        console.log('geçersiz code gidiniz ' + txtCode)
    } else if (txtCode.indexOf(",") > -1) {
        let sp = txtCode.split(',')
        sp.forEach(element => qrCodes.push(element));
        write()
    } else if (txtCode.indexOf("-") > -1) {
        let ar = txtCode.split('-')
        for (let i = ar[0]; i <= ar[1]; i++)
            qrCodes.push(i)
        write()
    }
}

function write() {
    $('#codes').html('')
    qrCodes.forEach(element => {
        $('#codes').append(element+'<br>')
    });
}

function print(){
    location.href = location.origin+"/printQRCode?codes="+qrCodes.join(',');
}

function qr() {
    // new QRCode(document.getElementById("qrcode"), {
    //     text: "dipendo://info?id=49795",
    //     width: 94,
    //     height: 94,
    // });
}