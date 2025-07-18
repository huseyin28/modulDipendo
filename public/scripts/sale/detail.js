
//!   saleId
let Sale = null
$(document).ready(init);

function init() {
    $.ajax({
        url: "https://app.dipendo.com/api/sales/" + saleId,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(response => {
        Sale = response;

        $('#print').off('click').on('click', printForm);
        $('#goDipendo').off('click').on('click', () => window.open(`https://app.dipendo.com/sales/${saleId}/detail/`, '_blank'));
        writeForm();
        getControlDetail()
    });
}

function getControlDetail() {
    $.ajax('/api/sales/getById/' + saleId).done(response => {
        if (response.success) {
            response.data.preparers = JSON.parse(response.data.preparers)
            response.data.images = JSON.parse(response.data.images)
            for (const key in response.data.preparers)
                $(`input[value="${response.data.preparers[key]}"]`).prop('checked', true)

            for (const key2 in response.data.images)
                $('.img-container').append(`<a href="/public/images/sales/${response.data.images[key2]}" target="_blank"><img src="/public/images/sales/${response.data.images[key2]}" alt="..." class="img-thumbnail w-25"></a>`)

        } else {
            setAlert(response.message)
        }
    })
}

function allStatus(statu) {
    let dt = new Date($('#SendDate').val());
    dt.setDate(dt.getDate() - 1)
    let deliveryTime = `${dt.getFullYear()}-${(dt.getMonth() + 1) > 9 ? dt.getMonth() + 1 : '0' + (dt.getMonth() + 1)}-${(dt.getDate()) > 9 ? (dt.getDate()) : '0' + (dt.getDate())}T21:00:00`;
    Sale.saleItems.forEach(item => {
        item.status = statu;
        item.deliveryTime = deliveryTime
    })
    Sale.deliveryTime = deliveryTime;
    Sale.status = statu;

    updateSale();
    $('#modalLastKontrol').modal()
}

function saveLastControl() {
    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    let selectedPersons = $('#modalLastKontrol input[type="checkbox"]:checked')

    if (fileInput.files.length > 0) {
        for (let i = 0; i < fileInput.files.length; i++)
            formData.append('images', fileInput.files[i]);
    }

    let arrayPersons = []
    for (let i = 0; i < selectedPersons.length; i++)
        arrayPersons.push($(selectedPersons[i]).val())

    formData.append('preparers', JSON.stringify(arrayPersons));
    formData.append('saleId', saleId);

    $.ajax({
        type: "POST",
        url: '/uploads/sale',
        data: formData,
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000
    }).done(response => {
        if (response.success) {
            $('#modalLastKontrol').modal('hide')
        } else {
            setAlert(response.message)
        }
    })
}

function setStatu() {
    for (let i = 1; i < arguments.length; i++) {
        Sale.saleItems.forEach(item => {
            if (item.saleItemId == arguments[i])
                item.status = arguments[0];
        })
    }
    updateSale();
}

function updateSale() {
    $.ajax({
        url: "https://app.dipendo.com/api/sales/" + Sale.saleId,
        type: "PUT",
        dataType: "JSON",
        data: Sale,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(response => {
        setAlert('İşlem başarılı', "success")
        setMyDBDeleryTime(Sale.saleId, Sale.deliveryTime, Sale.status)
        init()
    }).fail(err => {
        setAlert('Hata oluştu')
    })
}

function setMyDBDeleryTime(saleId, deliveryTime, statu) {
    fetch('/api/sales/setDeliveryTime', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ saleId, deliveryTime, statu })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                setAlert('İşlem başarılı', "success");
            } else {
                setAlert('Hata oluştu');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            setAlert('Hata oluştu');
        });
}

function printForm() {
    if (localStorage.getItem('printList') !== null) {
        let list = JSON.parse(localStorage.getItem('printList'))
        if (list.indexOf(saleId) == -1) {
            list.push(saleId)
            localStorage.setItem('printList', JSON.stringify(list))
        }
    } else {
        localStorage.setItem('printList', JSON.stringify([saleId]))
    }
    window.open(`/formPrint/${saleId}`, "_blank")
}

function writeForm() {
    $('#htmlCustomer').html(Sale.customer.title)
    $('#htmlSendDate').html(getSendDateItems())
    $('#htmlExplanation').html((Sale.explanation || '').replaceAll('\n', '<br>'))
    $('#htmlUser').html(Sale.user.firstName + ' ' + Sale.user.lastName + ' / <small>' + getTarih(Sale.recordTime) + '</small>')
    $('#htmlSaleCode').html(`Sipariş No : &ensp; ${Sale.externalSaleCode || ''}`)
    writeProducts()
}

function writeProducts() {
    $('#htmlProducts').html('');
    Sale.listItems = []
    joinItems();
    for (const i in Sale.listItems)
        $('#htmlProducts').append(getRow(Sale.listItems[i]))
}

function joinItems() {
    for (const i in Sale.saleItems) addItem(Sale.saleItems[i])
}

function addItem(item) {
    if (units[item.purchaseItem.product.productGroupId] == "m") {
        Sale.listItems.push(item)
    } else {
        let index = getIndex(item)
        if (index == -1) {
            item.sumSaleCount = item.saleCount;
            Sale.listItems.push(item)
        } else {
            importItem(item, index)
        }
    }
}

function importItem(item, index) {
    Sale.listItems[index].sumSaleCount += item.saleCount;
    if (Object.hasOwnProperty.call(Sale.listItems[index], 'otherItems'))
        Sale.listItems[index].otherItems.push(item.saleItemId)
    else
        Sale.listItems[index].otherItems = [item.saleItemId]
}

function getIndex(item) {
    let ret = -1;
    Sale.listItems.forEach((element, index) => {
        let gelen = item.purchaseItem.product
        let cursor = element.purchaseItem.product
        if (element.purchaseItem.product.productId == item.purchaseItem.product.productId)
            ret = index
    })
    return ret
}

function getRow(item) {
    let params = item.saleItemId + ''
    if (Object.hasOwnProperty.call(item, 'otherItems')) {
        params += ',' + item.otherItems.join(',')
    }
    let btnStatus =
        `<div class="btn-group" role="group">
            <button type="button" onclick="setStatu(1, ${params})" class="btn btn-sm btn-${item.status == 1 ? '' : 'outline-'}dark"><i class="fa-solid fa-hourglass-start"></i></button>
            <button type="button" onclick="setStatu(2, ${params})" class="btn btn-sm btn-${item.status == 2 ? '' : 'outline-'}primary"><i class="fa-solid fa-hourglass-end"></i></button>
            <button type="button" onclick="setStatu(3, ${params})" class="btn btn-sm btn-${item.status == 3 ? '' : 'outline-'}success"><i class="fa-solid fa-check"></i></button>
        </div>`

    return `<div class="row mb-3" style="line-height:25px">
            <div class="col-6 col-sm-8 col-lg-5"><a href="/purchaseItem/detay/${item.purchaseItemId}">${item.purchaseItem.product.name}</a></div>
            <div class="d-none d-lg-block col-lg-2">${units[item.purchaseItem.product.productGroupId] == "m" ? item.purchaseItemId : ""}</div>
            <div class="d-none d-lg-block col-lg-2">${(item.purchaseItem.product.unitMass * item.saleCount).toFixed(2)} ${item.purchaseItem.product.unitOfMass}</div>
            <div class="col-3 col-lg-1">${item.sumSaleCount || item.saleCount} ${units[item.purchaseItem.product.productGroupId]}</div>
            <div class="col-3 col-sm-4 col-lg-2">${btnStatus}</div>
        </div>`;
}

function setToday(gun) {
    let d = new Date(Date.now());
    d.setDate(d.getDate() + gun)
    if (gun == -1) {
        if (d.getDay() == 0)
            d.setDate(d.getDate() - 2) // pazar ise cuma yap
        else if (d.getDay() == 6)
            d.setDate(d.getDate() - 1) // cumartesi ise cuma yap
    }

    $('#SendDate').val(`${d.getFullYear()}-${zeroDolgu(d.getMonth() + 1)}-${zeroDolgu(d.getDate())}`, gun);
    allStatus(3)
}

function zeroDolgu(sy) {
    sy = '0' + sy;
    return sy.slice(-2);
}

function getSendDateItems() {
    let cont = `<div class="col-12 col-md-3 col-xl-2 mb-2 mb-md-0"><input type="date" class="form-control" id="SendDate" name="trip-start" value="${getTarih(Sale.deliveryTime, true)}"></div>`;
    cont += `<div class="col-6 col-md-2 col-xl-1"><button class="btn btn-primary btn-block" onclick="setToday(-1)">Dün</button></div>`;
    cont += `<div class="col-6 col-md-2 col-xl-1"><button class="btn btn-success btn-block" onclick="setToday(0)">Bugün</button></div>`;
    return cont;
}

function getTarih(dt, input = false) {
    let d = new Date(dt);
    d.setTime(d.getTime() + 3 * 60 * 60 * 1000);
    if (input) {
        let month = '0' + (d.getMonth() + 1);
        let day = '0' + (d.getDate());
        return `${d.getFullYear()}-${month.slice(-2)}-${day.slice(-2)}`;
    }
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
}