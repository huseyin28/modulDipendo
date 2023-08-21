var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10 });
html5QrcodeScanner.render(function (decodedText, decodedResult) {
    console.log(decodedText, decodedResult);
    location.assign('/purchaseItem/detay/' + decodedText.replaceAll('dipendo://info?id=', ''))
});