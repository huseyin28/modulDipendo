$(document).ready(ready);
let purchaseItem = null;
let stok;
let groupUnit = {
    "meter": "m",
    "piece": " adet"
}
let unit;
function ready() {
    $('#goDipendo').on('click', () => {
        window.open('https://app.dipendo.com/purchase-items/' + purchaseItemId + '/detail', '_blank');
    })
    getDetay(purchaseItemId)
}

function getDetay(id) {
    getpurchaseItem(id)
    $.ajax({
        url: `https://app.dipendo.com/api/purchase-items/${id}`,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(writeDetay).fail(ajaxFail)
}

function getpurchaseItem(id) {
    $.ajax({
        url: `/api/purchaseItem/getpurchaseItem/${id}`,
        method: 'GET',
        success: function (response) {
            if (response.success) {
                $('#konumDropdown').val(response.data.location || '0');
            } else {
                alert('Purchase item not found');
            }
        },
    })
}

function ajaxFail(e) {
    alert("Sunucuya erişemedik lütfen daha sonra tekrar deneyin")
    console.error(e)
}

function writeDetay(response) {
    purchaseItem = response;
    $('#productName').html(response.product.name);
    $('#purchaseItemId').html(response.purchaseItemId);
    $('#purchaseItemId').attr('onclick', `location.assign('/product/detail/${response.product.id}')`)
    $('div[name="propertyValues"]').html('')
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
    $('#stok').html(`<div class="col-6">SATIN ALINAN</div><div class="col-6">${response.purchaseCount}${unit}</div>`)
    $('#stok').append(`<div class="col-6">STOK</div><div class="col-6">${response.stockCount}${unit}</div>`)
    $('#stok').append(`<div class="col-6">SATILABİLİR</div><div class="col-6">${response.saleableCount}${unit}</div>`)
    $('#stok').append(`<div class="col-6">REZERVE EDİLEBİLİR</div><div class="col-6">${response.reservableCount}${unit}</div>`)
    $('#stok').append(`<button id="openFireFazlaModal" class="btn btn-sm btn-secondary float-right" style="position: absolute; right:20px; bottom:20px; width: 40px; height:40px; border-radius:50%"><i class="fas fa-fw fa-plus-minus"></i></button>`)
    stok = response.stockCount;
    writeLogs(response.activities);
    GetStatu1(response.product.id, response.purchaseItemId)
    GetStatu2(response.product.id, response.purchaseItemId)
    GetStatu3(response.product.id, response.purchaseItemId)
    GetStatu4(response.product.id, response.purchaseItemId)

    controlProduct(response.product)
    $('#openFireFazlaModal').off('click').on('click', function () {
        $('#txtFF').keypress(function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') savePurchaseCount()
        });
        $('#modalFireFazla').on('shown.bs.modal', function (e) {
            document.getElementById("txtFF").focus();
        })
        $('#modalFireFazla').modal('show');
    })
}

function writeLogs(activities) {
    $('#logs').html('');

    activities.forEach(element => {
        $('#logs').append(`<div class="mb-3">${element.content} <span class="float-right"><small>${element.user.firstName} ${element.user.lastName} - ${getDT(element.recordTime)} ${getTM(element.recordTime)}</small></span></div>`)
    });
}

// Satıldılar statu 1
function GetStatu1(productId, PurItemId) {
    $('#satildi').html('')
    let ekle = 0;
    $.ajax({
        url: `https://app.dipendo.com/api/sale-items?productId=${productId}&status=1&offset=0&limit=1000`,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(response => {
        response.forEach(element => {
            if (element.purchaseItem.purchaseItemId == PurItemId) {
                ekle += element.saleCount;
                $('#satildi').append(`<div class="col-9">${element.customer.title}</div><div class="col-3">${element.saleCount}${unit}</div>`)
            }
        });
        stok += ekle
        $('#anlik').html(stok);
    }).fail(ajaxFail)
}

// Sevke hazırlar statu 2
function GetStatu2(productId, PurItemId) {
    $('#hazir').html('')
    $.ajax({
        url: `https://app.dipendo.com/api/sale-items?productId=${productId}&status=2&offset=0&limit=1000`,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(response => {
        response.forEach(element => {
            if (element.purchaseItem.purchaseItemId == PurItemId)
                $('#hazir').append(`<div class="col-9">${element.customer.title}</div><div class="col-3">${element.saleCount}${unit}</div>`)
        });
    }).fail(ajaxFail)
}

// gönderilenler statu 3 
function GetStatu3(productId, PurItemId) {
    $('#gonderildi').html('')
    $.ajax({
        url: `https://app.dipendo.com/api/sale-items?productId=${productId}&status=3&offset=0&limit=1000`,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(response => {
        let dt = new Date();
        response.reverse().forEach(element => {
            if (element.purchaseItem.purchaseItemId == PurItemId) {
                dt = new Date(element.deliveryTime)
                dt.setDate(dt.getDate() + 1);
                console.log(dt.toLocaleDateString('tr-TR'), dt);
                $('#gonderildi').append(`<div class="row my-2" >
                    <div class="col-6 text-truncate">${element.customer.title}</div>
                    <div class="col-2">${element.saleCount}${unit}</div>
                    <div class="col-4 text-right">${dt.toLocaleDateString('tr-TR')}</div>
                </div>`)
            }
        })
    }).fail(ajaxFail)
}

function changeKonum() {
    let selectedValue = $('#konumDropdown').val();
    $.ajax({
        url: '/api/purchaseItem/updateLocation',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            purchaseItemId: purchaseItemId,
            location: selectedValue
        }),
        error: function (err) {
            alert('Konum güncellenirken hata oluştu.');
            console.error(err);
        }
    });
}

// rezerveler statu 4 
function GetStatu4(productId, PurItemId) {
    $.ajax({
        url: `https://app.dipendo.com/api/sale-items?productId=${productId}&status=4&offset=0&limit=1000`,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(response => {
        //console.log(response);
    }).fail(ajaxFail)
}

function savePurchaseCount() {
    let val = $('#txtFF').val();
    val = Number(val)
    if (isNaN(val)) val = 0;

    val += purchaseItem.purchaseCount

    $.ajax({
        type: "PATCH",
        headers: { "Authorization": localStorage.getItem('token') },
        dataType: "json",
        contentType: "application/json",
        url: "https://app.dipendo.com/api/purchase-items?fields=purchaseCount",
        data: JSON.stringify([{ "id": purchaseItemId, "op": "update", "purchaseCount": val }]),
        success: response => {
            $('#modalFireFazla').modal('hide');
            getDetay(purchaseItemId)
        }
    })
}

function getDT(dt) {
    let mydt = new Date(dt)
    return `${mydt.getDate()}.${mydt.getMonth() + 1}.${mydt.getFullYear()}`
}

function getTM(dt) {
    let mydt = new Date(dt)
    return `${mydt.getHours()}:${mydt.getMinutes()}`
}

function controlProduct(product) {
    $.ajax('/api/products/getById/' + product.id).done(response => {
        if (response.success) {
            if (response.data) {
                let images = JSON.parse(response.data.images)
                $('#lblImgCount').html(images.length)
                if (images.length == 0) $('#lblImgCount').addClass('text-danger font-weight-bold')
            } else {
                console.log('bu ürün veritabenında yok kayıt işlemi yapılacak');
                addProductToDatabase(product);
            }
        } else {
            setAlert(response.message)
        }
    })
}

function addProductToDatabase(product) {
    console.log(product);

    let productName = prompt('Lütfen ürün kısa adını girin:', product.name);
    let productBrand = prompt('Lütfen ürün markasını girin:', product.name);
    let newProduct = {
        "id": product.id,
        "groupId": product.groupId,
        "isActive": 1,
        "name": product.name,
        "propertyValues": JSON.stringify(product.propertyValues),
        "unitMass": 0,
        "unitOfMass": "kg",
        "shortName": productName,
        "images": JSON.stringify([]),
        "brand": productBrand
    }
    $.ajax({
        type: "POST",
        url: '/api/products/add',
        data: JSON.stringify(newProduct),
        contentType: "application/json",
        success: response => {
            if (response.success) {
                console.log('Ürün başarıyla eklendi');
                controlProduct(product);
            } else {
                setAlert(response.message);
            }
        },
        error: err => {
            console.error('Ürün eklenirken hata oluştu:', err);
            setAlert('Ürün eklenirken hata oluştu');
        }
    });
}