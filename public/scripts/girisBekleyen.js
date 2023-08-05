$(document).ready(function () {
    getList();
});

function getList() {
    $.ajax({
        url: `https://app.dipendo.com/api/purchase-items?status=3&limit=300`,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(writeList).fail(ajaxFail)
}

function writeList(list) {
    $('#tblList').html('')
    list.forEach((element, i) => {
        $('#tblList').append(`<tr>
            <th scope="row">${i + 1}</th>
            <td>${element.product.groupName}</td>
            <td>${element.product.name}</td>
            <td>${element.purchaseCount} ${getUnit(element.product.groupUnit)}</td>
            <td><button type="button" class="btn btn-primary btn-sm" onclick="inStock(${element.purchaseItemId})">Depoya Al</button></td>
        </tr>`)
    });
}

function inStock(purchaseItemId) {
    try {
        $.ajax({
            url: `https://app.dipendo.com/api/purchase-items/${purchaseItemId}`,
            type: 'PATCH',
            headers: { "Authorization": localStorage.getItem('token') },
            data: { status: 4 }
        }).fail(ajaxFail).then(response => {
            getList()
        })
    } catch (error) {
        alert('Hata')
        console.log(error);
    }
}

function ajaxFail(err) {
    console.error(err)
    setAlert("Sunucuya erişim sağlanılamadı lütfen daha sonra tekrar deneyin")
}