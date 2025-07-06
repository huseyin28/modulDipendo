let bugun;
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('date')) {
    bugun = new Date(urlParams.get('date'));
} else {
    bugun = new Date(Date.now());
    urlParams.set('date', getDateString(bugun));
    window.history.replaceState({}, '', `${location.pathname}?${urlParams}`);
}
let selectedItems = [];
let saleItems = [];
$(document).ready(main)

function main() {
    $('#start').val(getDateString(bugun))
    $('#start').off('change').on('change', () => {
        bugun = new Date($('#start').val());
        urlParams.set('date', getDateString(bugun));
        window.history.replaceState({}, '', `${location.pathname}?${urlParams}`);
        main();
    })
    $('#btnOnay').off('click').on('click', createForm)
    init(bugun)
}

function init(dt) {
    $('#SBF').html("");
    saleItems = [];
    $.ajax({
        url: `/api/sales/getSevkList/${getDateString(dt)}`,
    }).then(response => {
        for (const i in response.data) {
            getSaleById(response.data[i].saleId);
        }
    })
}

function getSaleById(saleId) {
    $.ajax({
        url: `https://app.dipendo.com/api/sales/${saleId}`,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(response => {
        for (const i in response.saleItems) {
            response.saleItems[i].customer = response.customer;
            saleItems.push(response.saleItems[i])
            writeSaleItem(response.saleItems[i])
        }
    })
}

function writeSaleItem(item) {
    $('#SBF').append(`<tr id="${item.saleItemId}">
        <td>${getCustomerName(item.customer.title)}</td> 
        <td>${item.purchaseItem.product.name}</td>
        <td>${item.saleCount}</td>
        <td>${item.purchaseItem.product.productPropertyValues.at(-1).propertyValue}</td>
        <td></td>
    </tr>`);
    $('#SBF tr').off('click').on('click', selectItem);
}

function selectItem() {
    let id = $(this).attr('id');

    if (selectedItems.includes(id)) {
        selectedItems = selectedItems.filter(item => item !== id);
        $(this).removeClass('bg-success text-white');
    } else {
        selectedItems.push(id);
        $(this).addClass('bg-success text-white');
    }
}

function createForm() {
    if (selectedItems.length == 0) {
        alert('Lütfen en az bir ürün seçiniz');
        return;
    }
    selectedItems = saleItems.filter(element => selectedItems.includes(String(element.saleItemId)));
    mergeItems()
}

function mergeItems() {
    let list = {};
    selectedItems.forEach(element => {
        let kod = '';
        if (element.saleCount == element.purchaseItem.purchaseCount && units[element.purchaseItem.product.productGroupId] == "m") {
            kod = `${element.customer.customerId}-${element.purchaseItem.product.productId}`
        } else if (units[element.purchaseItem.product.productGroupId] == "adet" || units[element.purchaseItem.product.productGroupId] == "kg") {
            kod = `${element.customer.customerId}-${element.purchaseItem.product.productId}`;
        } else if (units[element.purchaseItem.product.productGroupId] == "m") {
            kod = `${element.customer.customerId}-${element.purchaseItem.purchaseItemId}`;
        }

        if (kod in list) {
            list[kod].saleCount += element.saleCount;
        } else {
            list[kod] = element
        }
    })
    $('#SBF').html('');
    Object.values(list).forEach(writeSaleItem);
}

function getCustomerName(name) {
    name = name.replaceAll(' Asansör', ' As.');
    name = name.replaceAll(' Demir Çelik', ' DÇ');
    name = name.replaceAll(' Demir ve Çelik', ' DÇ');
    let customerName = name.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    let words = customerName.split(/\s+/);

    // İlk 2 kelimeyi birleştir
    let result = words.slice(0, 2).join(' ');

    // Eğer 3. kelime varsa ve result 10 karakterden küçükse 3. kelimeyi ekle
    if (result.length < 7 && words.length >= 3) {
        result += ' ' + words[2];
    }

    // Eğer result 20 karakterden büyükse ilk 20 karakterini döndür
    if (result.length > 15) {
        return result.slice(0, 15);
    }

    return result;
}

function getDateString(dt) {
    return `${dt.getFullYear()}-${("0" + (dt.getMonth() + 1)).slice(-2)}-${("0" + dt.getDate()).slice(-2)}`
}

function setYesterday() {
    bugun.setDate(bugun.getDate() - 1)
    $('#start').val(getDateString(bugun))
    bugun.setDate(bugun.getDate() + 1)
    $('#start').trigger('change')
}