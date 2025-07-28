let qrCodes = [];

$(document).ready(function () {
    if (localStorage.getItem('qrCodes') !== null) {
        qrCodes = JSON.parse(localStorage.getItem('qrCodes'))
        write()
        console.log("kayıt ok");
    } else {
        console.log("kayıt yok");
    }
})

function addCode() {
    let txtCode = $('#txtCode').val().trim();
    if (txtCode.length < 5) {
        console.log('geçersiz code gidiniz ' + txtCode)
    } else if (txtCode.length == 5) {
        if (!qrCodes.includes(txtCode)) {
            qrCodes.push(txtCode)
            write()
        } else {
            console.log('Kod zaten mevcut: ' + txtCode)
        }
    } else if (txtCode.indexOf(",") > -1) {
        let sp = txtCode.split(',')
        sp.forEach(element => {
            if (!qrCodes.includes(element)) {
                qrCodes.push(element);
            } else {
                console.log('Kod zaten mevcut: ' + element)
            }
        });
        write()
    } else if (txtCode.indexOf("-") > -1) {
        let ar = txtCode.split('-')
        for (let i = ar[0]; i <= ar[1]; i++) {
            if (!qrCodes.includes(i)) {
                qrCodes.push(i)
            } else {
                console.log('Kod zaten mevcut: ' + i)
            }
        }
        write()
    }
    localStorage.setItem('qrCodes', JSON.stringify(qrCodes))
    $('#txtCode').val('')
    $('#txtCode').focus()
}

function write() {
    $('#codes').html('')
    qrCodes.forEach((element, index) => {
        let item = getProduct(element);
        console.log(item)
        $('#codes').append(`
            <tr>
            <td>${index + 1}</td>
            <td>${element}</td>
            <td>${item.product.name}</td>
            <td>${item.stockCount}m</td>
            <td class="text-center p-1">
                <button class="btn btn-sm btn-danger my-0" onclick="delQR('${element}')">
                <i class="fa-solid fa-fw fa-x"></i>
                </button>
            </td>
            </tr>`)
    });
}

function delQR(pId) {
    const index = qrCodes.findIndex(code => code == pId);
    if (index > -1) {
        qrCodes.splice(index, 1);
        write();
        localStorage.setItem('qrCodes', JSON.stringify(qrCodes));
    }
}

function getProduct(pId) {
    let product = null;
    $.ajax({
        url: `https://app.dipendo.com/api/purchase-items/${pId}`,
        headers: { "Authorization": localStorage.getItem('token') },
        async: false,
        success: response => {
            product = response
        }
    })
    return product
}

function print() {
    localStorage.removeItem('qrCodes')
    location.href = location.origin + "/printQRCode?codes=" + qrCodes.join(',');
}