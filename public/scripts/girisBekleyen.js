

$(document).ready(ready);

function ready(){
    getList();
}

function getList(){
    $.ajax({
        url : `https://app.dipendo.com/api/purchase-items?status=3&limit=300`,
        headers: { "Authorization": Authorization }
    })
    .then(writeList)
    .fail(ajaxFail)
}

function writeList(list){
    $('#tblList').html('')
    list.forEach((element, i) => {
        $('#tblList').append(`<tr>
            <th scope="row">${i+1}</th>
            <td>${element.product.groupName}</td>
            <td>${element.product.name}</td>
            <td>${element.purchaseCount} ${getUnit(element.product.groupUnit)}</td>
            <td>x</td>
        </tr>`)
    });
}

function ajaxFail(err){
    console.error(err)
    setAlert("Sunucuya erişim sağlanılamadı lütfen daha sonra tekrar deneyin")
}