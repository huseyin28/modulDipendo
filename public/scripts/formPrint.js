let units = { "896": "m", "897": "m", "898": "m", "899": "m", "900": "m", "901": "m", "902": "m", "903": "m", "904": "m", "905": "m", "906": "m", "907": "m", "908": "m", "909": "m", "910": "m", "911": "m", "912": "m", "913": "m", "914": "m", "915": "adet", "916": "adet", "917": "adet", "918": "adet", "919": "adet", "920": "adet", "921": "adet", "922": "m", "923": "adet", "924": "adet", "925": "adet", "926": "adet", "927": "adet", "928": "adet", "929": "adet", "930": "adet", "931": "adet", "932": "adet", "933": "kg", "934": "adet", "935": "adet", "936": "adet", "937": "kg", "943": "adet", "944": "adet" };
const SaleID = saleId;
let Sale = null;

const tableHead = `
<div class="d-flex" style="font-weight: bold;">
    <div class="flex-fill">ÜRÜN</div>
    <div style="width: 90px;text-align: center;">KİMLİK</div>
    <div style="width: 90px;text-align: center;">AĞIRLIK</div>
    <div style="width: 90px;text-align: center;">MİKTAR</div>
</div>`


$(document).ready(ready)

function ready() {
    $.ajax({
        url: "https://app.dipendo.com/api/sales/" + SaleID,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(writeForm)
}

function writeForm(s) {
    Sale = s;
    $('[data-id="customer"]').html(Sale.customer.title);
    $('[data-id="externalSaleCode"]').html(Sale.externalSaleCode);
    $('[data-id="deliveryTime"]').html(getDt(Sale.deliveryTime));

    $('[data-id="recordTime"]').html(getDt(Sale.recordTime, true));
    $('[data-id="user"]').html(`(${Sale.user.firstName} ${Sale.user.lastName})`);
    $('[data-id="explanation"]').html('<b>AÇIKLAMA : </b>' + (Sale.explanation || '').replaceAll('\n\n', '\n').replaceAll('\n', '<br>'));
    Obj.writeProducts()
    let qrOption = {
        text: "dipendo://sale?id=" + Sale.saleId,
        width: 100,
        height: 100,
    }
    new QRCode(document.getElementById("divQR1"), qrOption);
    new QRCode(document.getElementById("divQR2"), qrOption);

    window.print();
    window.close();
}

function getDt(str, time = false) {
    let dt = new Date(str);
    dt.setHours(dt.getHours() + 3)
    let ret = `${dt.getDate()}.${dt.getMonth() + 1}.${dt.getFullYear()}`
    if (time)
        ret += ` ${dt.getHours()}:${dt.getMinutes()}`
    return ret
}

let Obj = {
    joinItems: function () {
        for (const i in Sale.saleItems)
            Obj.addItem(Sale.saleItems[i])

    },
    addItem: function (item) {
        if (units[item.purchaseItem.product.productGroupId] == "m") {
            Sale.listItems.push(item)
        } else {
            let index = Obj.getIndex(item)
            if (index == -1) {
                Sale.listItems.push(item)
            } else {
                Obj.importItem(item, index)
            }
        }
    },
    importItem: function (item, index) {
        Sale.listItems[index].saleCount += item.saleCount;
        if (Object.hasOwnProperty.call(Sale.listItems[index], 'otherItems'))
            Sale.listItems[index].otherItems.push(item.saleItemId)
        else
            Sale.listItems[index].otherItems = [item.saleItemId]
    },
    getIndex: function (item) {
        let ret = -1;
        Sale.listItems.forEach((element, index) => {
            let gelen = item.purchaseItem.product
            let cursor = element.purchaseItem.product
            if (element.purchaseItem.product.productId == item.purchaseItem.product.productId)
                ret = index
        })
        return ret
    },
    writeProducts: function () {
        Sale.listItems = []
        Obj.joinItems();
        $('[data-id="products"]').html(tableHead)
        for (const i in Sale.listItems)
            $('[data-id="products"]').append(Obj.getRow(Sale.listItems[i]))

        if (Math.ceil($('.nusha')[0].clientHeight * 0.2645833333) > 148) {
            $('.nusha').height(1050);
        }
    },
    getRow: function (item) {
        console.log(item);
        return `
        <div class="d-flex">
            <div class="flex-fill">${Obj.nameReplace(item.purchaseItem.product.name)}</div>
            <div style="width: 90px;text-align: center;">${units[item.purchaseItem.product.productGroupId] == "m" ? item.purchaseItemId : ""}</div>
            <div style="width: 90px;text-align: center;">${(item.purchaseItem.product.unitMass * item.saleCount).toFixed(2)} ${item.purchaseItem.product.unitOfMass}</div>
            <div style="width: 90px;text-align: center;">${item.saleCount} ${units[item.purchaseItem.product.productGroupId]}</div>
            </div>`;
        // <div style="width: 90px;text-align: center;">${this.getKactan(item)}</div>
    },
    getKactan: function (item) {
        if (units[item.purchaseItem.product.productGroupId] == "m")
            return `<small style="color : grey;">${item.saleCount + item.purchaseItem.stockCount}m'den</small>`
        else
            return ''

    },
    nameReplace: function (name) {
        name = name.replaceAll(' GALV ', ' <b><u>GALV</u></b> ')
        name = name.replaceAll(' LHRL ', ' <b><u>LHRL</u></b> ')
        return name;
    }
}

let Pristine = {
    writeProducts: function () {
        for (const i in Sale.saleItems) $('[data-id="products"]').append(Obj.getRow(Sale.saleItems[i]))
    }
}