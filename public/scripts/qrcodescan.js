var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10 });
let loc = false;
$(document).ready(function () {
    loc = false;
})
html5QrcodeScanner.render(function (decodedText, decodedResult) {
    let txt = decodedText.replaceAll('dipendo://', '')
    txt = txt.split('?id=')
    if (!loc) {
        if (txt[0] == 'info')
            window.open('/purchaseItem/detay/' + txt[1], '_blank', 'noopener, noreferrer');
        else if (txt[0] == 'sale')
            window.open('/detay?id=' + txt[1], '_blank', 'noopener, noreferrer');
        loc = true
    }
});