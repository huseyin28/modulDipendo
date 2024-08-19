let qrCodes = [];

$(document).ready(function(){
    if(localStorage.getItem('qrCodes') !== null){
        qrCodes = JSON.parse(localStorage.getItem('qrCodes'))
        write()
        console.log("kayıt ok");
    }else{
        console.log("kayıt yok");
    }
})

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
    localStorage.setItem('qrCodes',JSON.stringify(qrCodes))
    $('#txtCode').val('')
    $('#txtCode').focus()
}

function write() {
    $('#codes').html('')
    qrCodes.forEach(element => {
        $('#codes').append(`<li class="list-group-item">${element} <small style="float:right;">${getTitle(element)} <i class="fa-solid fa-x text-danger" onclick="delQR(${element})"></i></small></li>`)
    });
}

function delQR(pId){
    console.log(qrCodes);
    const index = qrCodes.indexOf(pId);
    console.log(index);
    qrCodes.splice(index, 1);
    console.log(qrCodes);
    write()
    localStorage.setItem('qrCodes',JSON.stringify(qrCodes))
}

function getTitle(pId){
    let title = null;
    $.ajax({
        url: `https://app.dipendo.com/api/purchase-items/${pId}`,
        headers: { "Authorization": localStorage.getItem('token') },
        async: false,
        success: response => {
            title = response.product.name
        }
    })
    return title
}

function print() {
    localStorage.removeItem('qrCodes')
    location.href = location.origin + "/printQRCode?codes=" + qrCodes.join(',');
}