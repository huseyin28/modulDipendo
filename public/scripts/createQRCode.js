let qrCodes = [];

function addCode() {
    let txtCode = $('#txtCode').val().trim();
    if (txtCode.length < 5) {
        console.log('geçersiz code gidiniz ' + txtCode)
    } else if (txtCode.length == 5) {
        qrCodes.push(txtCode)
        write()
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
    $('#txtCode').val('')
    $('#txtCode').focus()
}

function write() {
    $('#codes').html('')
    qrCodes.forEach(element => {
        $('#codes').append(`<li class="list-group-item">${element}</li>`)
    });
}

function print() {
    location.href = location.origin + "/printQRCode?codes=" + qrCodes.join(',');
}