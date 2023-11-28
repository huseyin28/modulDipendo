$('#sidebarToggle').trigger('click')
let control = true;
var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 1 });

$(window).on("focus", function () {
    html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 1 });
    control = true;
})


html5QrcodeScanner.render(function (decodedText, decodedResult) {
    if (control) {
        let txt = decodedText.replaceAll('dipendo://', '')
        txt = txt.split('?id=')
        if (txt[0] == 'info')
            window.open('/purchaseItem/detay/' + txt[1], '_blank', 'noopener, noreferrer');
        else if (txt[0] == 'sale')
            window.open('/detay?id=' + txt[1], '_blank', 'noopener, noreferrer');
        control = false
    }
});