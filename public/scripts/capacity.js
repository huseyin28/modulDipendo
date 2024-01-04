function Start() {
    let halat = Number($('#dia').val())
    let makara_capi = cm2mm(Number($('#makara_cap').val()))
    let gobek_capi = makara_capi - cm2mm(Number($('#derinlik').val()) * 2)
    let h = cm2mm(Number($('#aralik').val()))

    let limit = hesapla(halat, makara_capi, gobek_capi, h)

    let tavsiye = hesapla(halat, makara_capi - getPay(halat), gobek_capi, h)

    ekranaYaz(limit, tavsiye)
}

function ekranaYaz(l, t) {
    let html = `<div class="p-3 mb-2 bg-success text-white">Tavsiye edilen : <b>${t}</b></div>
    <div class="p-3 mb-2 bg-warning text-dark">Makara limiti : <b>${l}</b></div>`

    $(html).prependTo('.card-body').delay(100000).queue(function () { $(this).remove(); });
}

function getPay(halat) {
    if (halat < 26)
        return 50;
    else
        return halat * 2
}

function hesapla(halat, makaraCap, gobekCap, h) {
    console.log(halat, makaraCap, gobekCap, h);
    let brutHacim = getVolume(makaraCap / 2, h)
    let gobekHacim = getVolume(gobekCap / 2, h)
    let netHacim = brutHacim - gobekHacim

    let halatHacim = Math.pow(halat, 2) * cm2mm(100)

    return Math.floor(netHacim / halatHacim)
}

function getVolume(r, h) {
    return Math.PI * Math.pow(r, 2) * h
}

function cm2mm(val) {
    return val * 10
}