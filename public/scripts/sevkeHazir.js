$(document).ready(ready)

function ready(){
    getSevkeHazir()
}

function getSevkeHazir(){
    $.ajax({
        url : `https://app.dipendo.com/api/sale-items?status=2&limit=3000`,
        headers: { "Authorization": Authorization }
    }).then(response => {
        $('#list').html('');
        response.forEach(element => {
            $('#list').append(`<tr>
                <td>${element.customer.title}</td>
                <td>${element.purchaseItem.product.name}</td>
                <td>${element.saleCount}</td>
                <td><button type="button" class="btn btn-link" onclick="depodanGonder(${element.saleItemId})">Gönder</button></td>
            </tr>`)
        });
    })
}

function depodanGonder(saleItemId){
    let dt = new Date();
    dt.setDate(dt.getDate() - 1)
    let deliveryTime = `${dt.getFullYear()}-${(dt.getMonth()+1) > 9 ? dt.getMonth()+1 : '0'+(dt.getMonth()+1)}-${(dt.getDate()) > 9 ? (dt.getDate()) : '0'+(dt.getDate())}T21:00:00`;
    $.ajax({
        type : "PATCH",
        url : `https://app.dipendo.com/api/sale-items/${saleItemId}`,
        data : {"status":3, "deliveryTime" : deliveryTime},
        headers : { "Authorization": Authorization }
    }).then(response => {
        getSevkeHazir()
    })
}