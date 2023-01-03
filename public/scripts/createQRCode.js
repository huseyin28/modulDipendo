// dipendo://info?id=49795
$(document).ready(ready);
let sayac = 1;

function ready() {
    //qr();
    loadBekleyenler()
}

function loadBekleyenler() {
    $.ajax({
        url: "https://app.dipendo.com/api/purchase-items?status=4&limit=20",
        headers: { "Authorization": localStorage.getItem('token') },
        success: response => {
            $('#tblList').html('')
            if (response.length > 0) {
                response.forEach(element => {
                    $('#tblList').append(`<tr>
                        <td><input type="checkbox" value="${element.purchaseItemId}"></td>
                        <td>${element.purchaseItemId}</td>
                        <td>${element.product.name}</td>
                        <td>${element.purchaseCount}</td>
                    </tr>`)
                });
            } else {
                $('#lblInfo').html('Ürün bulunamadı')
            }
        }
    })
}

function qr() {
    new QRCode(document.getElementById("qrcode"), {
        text: "dipendo://info?id=49795",
        width: 94,
        height: 94,
    });
}