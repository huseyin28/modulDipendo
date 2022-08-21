$(document).ready(ready);

function ready(){
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
    console.log(response);
    $('#productName').html(response.product.name);
    $('#purchaseItemId').html(response.purchaseItemId);
}