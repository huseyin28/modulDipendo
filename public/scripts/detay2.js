let aylar = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
let gunler = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"]
$(document).ready(function () {
    if (LoginControl()) {
        // getDetail(getSaleID())
    } else {
        Login(function () {
            const urlParams = new URLSearchParams(location.search);
            $.ajax({
                url: "https://app.dipendo.com/api/sales/" + urlParams.get('id'),
                headers: { "Authorization": localStorage.getItem('Authorization') }
            }).then(loadDetail).fail(err => {
                console.log(err);
            })
        })
    }
})

function loadDetail(sale) {
    let deliveryTime = new Date(sale.deliveryTime)
    deliveryTime.setHours(deliveryTime.getHours() + 3)
    let recordTime = new Date(sale.recordTime)
    recordTime.setHours(recordTime.getHours() + 3)

    $('#customerTitle').html(sale.customer.title)
    $('#explanation').html(sale.explanation)
    $('#userAndDate').html(sale.user.firstName + " " + sale.user.lastName + " (" + `${recordTime.getDate()} ${aylar[recordTime.getMonth()]} ${recordTime.getFullYear()})`)
    $('#deliveryTime').html(`${deliveryTime.getDate()} ${aylar[deliveryTime.getMonth()]} ${deliveryTime.getFullYear()} ${gunler[deliveryTime.getDay()]}`)

    loadProducts(sale.saleId, sale.saleItems)
}

function getType(gid) {
    let units = { "896": "m", "897": "m", "898": "m", "899": "m", "900": "m", "901": "m", "902": "m", "903": "m", "904": "m", "905": "m", "906": "m", "907": "m", "908": "m", "909": "m", "910": "m", "911": "m", "912": "m", "913": "m", "914": "m", "915": "adet", "916": "adet", "917": "adet", "918": "adet", "919": "adet", "920": "adet", "921": "adet", "922": "m", "923": "adet", "924": "adet", "925": "adet", "926": "adet", "927": "adet", "928": "adet", "929": "adet", "930": "adet", "931": "adet", "932": "adet", "933": "kg", "934": "adet", "935": "adet", "936": "adet", "937": "kg", "943": "adet", "944": "adet" };
    if (units[gid] == "m") {
        return "halat"
    } else {
        return "ekmalzeme"
    }
}

function loadProducts(sid, items) {
    let products = [];
    items.forEach((item, i) => {
        item.type = getType(item.purchaseItem.product.productGroupId)
        console.log(item);
        if(item.type == "halat"){
            products[item.purchaseItemId] = item
        }
        $('#tblProducts').append(`<tr>
            <th scope="row">${i + 1}</th>
            <td>${item.purchaseItem.product.name}</td>
            <td>${item.type == "halat" ? item.purchaseItem.purchaseItemId : ""}</td>
            <td>${Math.round(item.saleCount * item.purchaseItem.product.unitMass)} ${item.purchaseItem.product.unitOfMass}</td>
            <td>@mdo</td>
        </tr>`)
    });
}

function LoginControl() {
    if (localStorage.getItem('Authorization') == null) {
        return false;
    } else {
        let res = false;
        $.ajax({
            url: "https://app.dipendo.com/api/product-groups?offset=0&limit=10000&isActive=true",
            async: false,
            headers: {
                "Authorization": localStorage.getItem('Authorization')
            }
        }).then(res => {
            res = true;
        }).fail(err => {
            res = false;
        })
        return res
    }
}

function Login(coll) {
    $.ajax({
        url: "https://app.dipendo.com/oauth/token",
        data: "username=huseyinyilmaz@celsancelik.com&password=asdasd528&grant_type=password&client_id=DipendoWeb",
        type: "POST",
    }).then(response => {
        localStorage.setItem('Authorization', response.token_type + " " + response.access_token)
        coll()
    }).fail(err => {
        console.log("Giriş yapılamadı");
        console.log(err);
        alert("Giriş yapılamadı")
    })
}