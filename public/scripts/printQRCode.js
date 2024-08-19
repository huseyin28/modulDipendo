let searchParams = new URLSearchParams(window.location.search)
let codes = searchParams.get('codes').split(',')

codes.forEach((element, index) => {
    if ((index) % 8 == 0) {
        $('.conteiner').append('<div class="a4"></div>')
    }
    addQRCode(element)
});

function addQRCode(id) {
    $.ajax({
        url: `https://app.dipendo.com/api/purchase-items/${id}`,
        headers: { "Authorization": localStorage.getItem('token') },
        async: false,
        success: response => {
            $('.a4:last-child').append(`<div class="row">
                <div class="qr" id="div${response.purchaseItemId}"></div>
                <div class="atr">
                    <span><b>${response.purchaseItemId}</b></span>
                    <span>${getname(response.product.name)}</span>
                    <span>${response.purchaseCount} ${getBirim(response.product.groupUnit)}</span>
                    <span>${Math.floor(response.product.unitMass * response.purchaseCount)} ${response.product.unitOfMass}</span>
                </div>
            </div>`)
            new QRCode(document.getElementById("div" + response.purchaseItemId), {
                text: "dipendo://info?id=" + response.purchaseItemId,
                width: 104,
                height: 104,
            });
        }
    })
}

function getname(name) {
    name = name.replaceAll(' GALV ', ' <b>GALV</b> ')
    name = name.replaceAll(' LHRL ', ' <b>LHRL</b> ')
    name = name.replaceAll(' LHLL ', ' <b>LHLL</b> ')
    return name;
}

function getBirim(nt) {
    if (nt == "meter") {
        return "m"
    } else {
        return ' adet'
    }
}