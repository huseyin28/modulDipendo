let qrCodes = [];

$(document).ready(getList)

function getList() {
    $.ajax({
        url: `/api/qrcode/getlist`,
        success: response => {
            if (response.success) {
                $('#codes').html('')
                if (response.data.length > 0) {
                    write(response.data)
                } else {
                    $('#codes').html('<tr><td colspan="5" class="text-center">Yazdırılacak kod yok...</td></tr>')
                }
            }
        }
    })
}

function addCode() {
    let txtCode = $('#txtCode').val().trim();
    if (txtCode.length < 5) {
        console.log('geçersiz code gidiniz ' + txtCode)
    } else if (txtCode.length == 5) {
        qrCodes.push(txtCode)
    } else if (txtCode.indexOf(",") > -1) {
        let sp = txtCode.split(',')
        sp.forEach(element => {
            qrCodes.push(element);
        });
    } else if (txtCode.indexOf("-") > -1) {
        let ar = txtCode.split('-')
        for (let i = ar[0]; i <= ar[1]; i++) {
            qrCodes.push(i)
        }
    }
    fetch('/api/qrcode/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codes: qrCodes })
    }).then(response => response.json())
        .then(data => {
            console.log(data);
            getList()
        })
    $('#txtCode').val('')
    $('#txtCode').focus()
}

function write(list) {
    qrCodes = [];
    $('#codes').html('')
    list.forEach((element, index) => {
        qrCodes.push(element.kimlik);
        let item = getProduct(element.kimlik);
        $('#codes').append(`
            <tr>
            <td>${index + 1}</td>
            <td>${element.kimlik}</td>
            <td>${item.product.name}</td>
            <td>${item.stockCount}m</td>
            <td class="text-center p-1">
                <button class="btn btn-sm btn-danger my-0" onclick="delQR('${element.id}')">
                <i class="fa-solid fa-fw fa-x"></i>
                </button>
            </td>
            </tr>`)
    });
}

function delQR(id) {
    fetch('/api/qrcode/delete/' + id, {
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
        .then(data => {
            console.log(data);
            getList()
        })
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
    fetch('/api/qrcode/print', {
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
        .then(data => {
            location.href = location.origin + "/printQRCode?codes=" + qrCodes.join(',');
        })

}