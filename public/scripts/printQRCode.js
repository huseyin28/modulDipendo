let searchParams = new URLSearchParams(window.location.search)
let codes = searchParams.get('codes').split(',')
codes.forEach((element,index) => {
    if((index)%8 == 0){
        $('.conteiner').append('<div class="a4"></div>')
    }
    $('.a4:last-child').append(`<div class="row">
            <div class="qr">${element}</div>
            <div class="atr">
                <span>${element}</span>
                <span>36mm 6x36 ÇÖ UNGALV 1960 A2 RHRL Erciyes</span>
                <span>2000 m</span>
                <span>2351 kg</span>
            </div>
        </div>`)
});

