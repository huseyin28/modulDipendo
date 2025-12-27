var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 1 });

html5QrcodeScanner.render(function (decodedText, decodedResult) {
    let txt = decodedText.replaceAll('dipendo://', '')
    txt = txt.split('?id=')
    if (txt[0] == 'info') {
        insertPurchaseItem(txt[1])
    }
});

function SayimComplete() {
    insertStatu()
};

function inputSave() {
    let val = $('#sayimInput').val().trim();
    if (val === '' || val.length !== 5) {
        alert('Lütfen geçerli bir ürün kodu veya barkod giriniz!');
        return;
    }
    insertPurchaseItem(val);
    $('#sayimInput').val('');
}

async function insertStatu() {
    try {
        const token = localStorage.getItem('token');
        const urls = [
            `https://app.dipendo.com/api/sale-items?status=1&offset=0&limit=99999&view=ReadyForShipment`,
            `https://app.dipendo.com/api/sale-items?status=2&offset=0&limit=99999&view=ReadyForShipment`
        ];
        const [res1, res2] = await Promise.all(urls.map(u =>
            fetch(u, { headers: { "Authorization": token } })
                .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
        ));

        const list1 = Array.isArray(res1) ? res1 : [];
        const list2 = Array.isArray(res2) ? res2 : [];
        const merged = [...list1, ...list2];

        const sendResp = await fetch('/api/purchaseItem/sayim/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(merged)
        });

        const sendResult = await sendResp.json();
        if (sendResult.success) {
            alert('İşlem başarılı');
        } else {
            alert(sendResult.error || 'Sunucu hatası');
        }
    } catch (err) {
        console.error(err);
        alert('Hata: ' + (err.message || err));
    }
}

function insertPurchaseItem(piid) {
    $.ajax({
        url: `https://app.dipendo.com/api/purchase-items/${piid}`,
        headers: { "Authorization": localStorage.getItem('token') },
        success: sendAPI,
        error: function (xhr, status, error) {
            alert('Hata oluştu lütfen Hüseyin Yılmaz ile görüşünüz! ');
        }
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