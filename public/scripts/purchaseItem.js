$(document).ready(ready);
let stok ;
let groupUnit = {
    "meter" : "m",
    "piece" : " adet"
}
let unit ;
function ready(){
    $('#goDipendo').on('click',()=>{
        window.open('https://app.dipendo.com/purchase-items/'+purchaseItemId+'/detail', '_blank');
    })
    getDetay(purchaseItemId)
}

function getDetay(id){
    $.ajax({
        url : `https://app.dipendo.com/api/purchase-items/${id}`,
        headers: { "Authorization": Authorization }
    }).then(writeDetay).fail(ajaxFail)
}

function ajaxFail(e){
    alert("Sunucuya erişemedik lütfen daha sonra tekrar deneyin")
    console.error(e)
}

function writeDetay(response){
    $('#productName').html(response.product.name);
    $('#purchaseItemId').html(response.purchaseItemId);
    for (const i in response.product.propertyValues) {
        if (Object.hasOwnProperty.call(response.product.propertyValues, i)) {
            const element = response.product.propertyValues[i];
            $('div[name="propertyValues"]').append(`<div class="row">
                <div class="col-4">${element.propertyName}</div>
                <div class="col-4">${element.value}</div>
            </div>`)
        }
    }
    unit = groupUnit[response.product.groupUnit]
    $('#stok').html(`<div class="col-6">STOK</div><div class="col-6">${response.stockCount}${unit}</div>`)
    $('#stok').append(`<div class="col-6">SATILABİLİR</div><div class="col-6">${response.saleableCount}${unit}</div>`)
    $('#stok').append(`<div class="col-6">REZERVE EDİLEBİLİR</div><div class="col-6">${response.reservableCount}${unit}</div>`)
    stok = response.stockCount;
    console.log(response);
    writeLogs(response.activities);
    GetStatu1(response.product.id, response.purchaseItemId)
    GetStatu2(response.product.id, response.purchaseItemId)
    GetStatu3(response.product.id, response.purchaseItemId)
    GetStatu4(response.product.id, response.purchaseItemId)
}

function writeLogs(activities){
    activities.forEach(element => {
        $('#logs').append(``)
    });
    // #logs
}

// Satıldılar statu 1
function GetStatu1(productId, PurItemId){
    let ekle = 0;
    $.ajax({
        url : `https://app.dipendo.com/api/sale-items?productId=${productId}&status=1&offset=0&limit=1000`,
        headers: { "Authorization": Authorization }
    }).then(response => {
        response.forEach(element => {
            if(element.purchaseItem.purchaseItemId == PurItemId){
                ekle += element.saleCount;
                $('#satildi').append(`<div class="col-9">${element.customer.title}</div><div class="col-3">${element.saleCount}${unit}</div>`)
            }
        });
        stok += ekle
        $('#anlik').html(stok);
    }).fail(ajaxFail)
}

// Sevke hazırlar statu 2
function GetStatu2(productId, PurItemId){
    $.ajax({
        url : `https://app.dipendo.com/api/sale-items?productId=${productId}&status=2&offset=0&limit=1000`,
        headers: { "Authorization": Authorization }
    }).then(response => {
        response.forEach(element => {
            if(element.purchaseItem.purchaseItemId == PurItemId)
                $('#hazir').append(`<div class="col-9">${element.customer.title}</div><div class="col-3">${element.saleCount}${unit}</div>`)
        });
    }).fail(ajaxFail)
}

// gönderilenler statu 3
function GetStatu3(productId, PurItemId){
    $.ajax({
        url : `https://app.dipendo.com/api/sale-items?productId=${productId}&status=3&offset=0&limit=1000`,
        headers: { "Authorization": Authorization }
    }).then(response => {
        for (let i = response.length-1; i >= 0; i--) {
            if(response[i].purchaseItem.purchaseItemId == PurItemId){
                console.log(response[i]);
                $('#gonderildi').append(`<div class="col-7">${response[i].customer.title}</div><div class="col-3">${response[i].saleCount}${unit}</div><div class="col-2">t</div>`)
            }
        }
    }).fail(ajaxFail)
}

// rezerveler statu 4 
function GetStatu4(productId, PurItemId){
    $.ajax({
        url : `https://app.dipendo.com/api/sale-items?productId=${productId}&status=4&offset=0&limit=1000`,
        headers: { "Authorization": Authorization }
    }).then(response => {
        //console.log(response);
    }).fail(ajaxFail)
}
