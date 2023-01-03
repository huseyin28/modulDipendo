$(document).ready(ready)

function ready(){
    getCikisBekleyenler()
}

function getCikisBekleyenler(){
    $.ajax({
        url : `https://app.dipendo.com/api/sale-items?status=1&limit=3000`,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(response => {
        $('#list').html('');
        response.forEach(element => {
            $('#list').append(`<tr>
            <td>${element.customer.title}</td>
            <td>${element.purchaseItem.product.name}</td>
            <td>${element.saleCount}</td>
            <td><button type="button" class="btn btn-link" onclick="Hazirla(${element.saleItemId})">Hazırla</button></td>
        </tr>`)
        });
    })
}

function Hazirla(saleItemId){
    $.ajax({
        type : "PATCH",
        url : `https://app.dipendo.com/api/sale-items/${saleItemId}`,
        data : {"status":2},
        headers : { "Authorization": localStorage.getItem('token') }
    }).then(response => {
        getCikisBekleyenler()
    })
}