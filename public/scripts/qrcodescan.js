var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10 });
let loc = false;
$(document).ready(function () {
    loc = false;
})
html5QrcodeScanner.render(function (decodedText, decodedResult) {
    if (!loc) {
        location.assign('/purchaseItem/detay/' + decodedText.replaceAll('dipendo://info?id=', ''))
        loc = true
    }
});