var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 5 });

html5QrcodeScanner.render(function (decodedText, decodedResult) {
    let txt = decodedText.replaceAll('dipendo://', '')
    txt = txt.split('?id=')
    if (txt[0] == 'info') {
        insertPurchaseItem(txt[1])
    }
});

function insertPurchaseItem(piid) {
    $.ajax({
        url: `https://app.dipendo.com/api/purchase-items/${piid}`,
        headers: { "Authorization": localStorage.getItem('token') },
        success: sendAPI
    })
}

function sendAPI(data) {
    data.location = $('#konumDropdown').val();
    if (data.location == "0") {
        alert('Lütfen bir depo seçiniz!')
        return;
    }
    $.ajax({
        url: '/api/purchaseItem/sayim',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: response => {
            if (response.success) {
                alert('Sayım işlemi başarılı!')
            } else {
                alert(response.error)
            }
        }
    });
}