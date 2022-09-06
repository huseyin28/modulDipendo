let units = { "896": "m", "897": "m", "898": "m", "899": "m", "900": "m", "901": "m", "902": "m", "903": "m", "904": "m", "905": "m", "906": "m", "907": "m", "908": "m", "909": "m", "910": "m", "911": "m", "912": "m", "913": "m", "914": "m", "915": "adet", "916": "adet", "917": "adet", "918": "adet", "919": "adet", "920": "adet", "921": "adet", "922": "m", "923": "adet", "924": "adet", "925": "adet", "926": "adet", "927": "adet", "928": "adet", "929": "adet", "930": "adet", "931": "adet", "932": "adet", "933": "kg", "934": "adet", "935": "adet", "936": "adet", "937": "kg", "943": "adet", "944": "adet" };
let Sale = null

$(document).ready(ready)

function ready() {
    const urlParams = new URLSearchParams(location.search);
    $.ajax({
        url: "https://app.dipendo.com/api/sales/" + urlParams.get('id'),
        headers: { "Authorization": Authorization }
    }).then(response => {
        Sale = response
        $('#print').off('click').on('click',function(){
            window.open('/formPrint/'+ urlParams.get('id'), "_blank") 
        })
        Sale.listItems = []
        PAGE.joinItems()
        FORM.createPrintForm();
        PAGE.writeForm();
    })
}

function setStatu() {
    for(let i = 1; i < arguments.length; i++){
        Sale.saleItems.forEach(item => {
            if (item.saleItemId == arguments[i])
                item.status = arguments[0];
        })
    }
    updateSale();
}

function allStatus(statu) {
    Sale.saleItems.forEach(item => {
        item.status = statu;
        // item.deliveryTime = '2022-09-05T21:00:00'
        console.log('deliveryTime');
    })
    updateSale();
}

function updateSale() {
    $.ajax({
        url: "https://app.dipendo.com/api/sales/" + Sale.saleId,
        type: "PUT",
        dataType: "JSON",
        data: Sale,
        headers: { "Authorization": Authorization }
    }).then(response => {
        setAlert('İşlem başarılı', "success")
        ready()
    }).fail(err => {
        setAlert('Hata oluştu')
    })
}


let PAGE = {
    writeForm: function () {
        $('#HtmlForm #htmlCustomer').html(Sale.customer.title)
        $('#HtmlForm #htmlSendDate').html(`Sevk Tarihi : &ensp;${FORM.getTarih(Sale.deliveryTime)}`)
        $('#HtmlForm #htmlExplanation').html(Sale.explanation.replaceAll('\n','<br>'))
        $('#HtmlForm #htmlUser').html(Sale.user.firstName + ' ' + Sale.user.lastName + ' / <small>' + FORM.getTarih(Sale.recordTime) + '</small>')
        $('#htmlSaleCode').html(`Sipariş No : &ensp; ${Sale.externalSaleCode || ''}`)
        PAGE.writeProducts()
    },
    joinItems: function () {
        for (const i in Sale.saleItems)
            PAGE.addItem(Sale.saleItems[i])
       
    },
    addItem: function (item) {
        if (units[item.purchaseItem.product.productGroupId] == "m") {
            Sale.listItems.push(item)
        } else {
            let index = PAGE.getIndex(item)
            if (index == -1) {
                Sale.listItems.push(item)
            } else {
                PAGE.importItem(item, index)
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
        $('#htmlProducts').html('')
        for (const i in Sale.listItems)
            $('#htmlProducts').append(PAGE.getRow(Sale.listItems[i]))

    },
    getRow: function (item) {
        let params = item.saleItemId+''
        if (Object.hasOwnProperty.call(item, 'otherItems')){
            params += ','+item.otherItems.join(',')
        }
        let btnStatus =
            `<div class="btn-group" role="group">
            <button type="button" onclick="setStatu(1, ${params})" class="btn btn-sm btn-${item.status == 1 ? '' : 'outline-'}dark"><i class="fa-solid fa-hourglass-start"></i></button>
            <button type="button" onclick="setStatu(2, ${params})" class="btn btn-sm btn-${item.status == 2 ? '' : 'outline-'}primary"><i class="fa-solid fa-hourglass-end"></i></button>
            <button type="button" onclick="setStatu(3, ${params})" class="btn btn-sm btn-${item.status == 3 ? '' : 'outline-'}success"><i class="fa-solid fa-check"></i></button>
        </div>`
        let btnCreateEtiket = `<button type="button" onclick="PAGE.createEtiket(${item.saleItemId})" class="ml-2 btn btn-primary btn-sm my-1"><i class="fa-solid fa-tag"></i></button>`

        return `<div class="row" style="line-height: 39px;">
            <div class="col-12 col-sm-8 col-lg-5"><a href="/purchaseItem/detay/${item.purchaseItemId}">${item.purchaseItem.product.name}</a></div>
            <div class="d-none d-lg-block col-lg-2">${units[item.purchaseItem.product.productGroupId] == "m" ? item.purchaseItemId : ""}</div>
            <div class="d-none d-lg-block col-lg-2">${(item.purchaseItem.product.unitMass * item.saleCount).toFixed(2)} ${item.purchaseItem.product.unitOfMass}</div>
            <div class="d-none d-lg-block col-lg-1">${item.saleCount} ${units[item.purchaseItem.product.productGroupId]}</div>
            <div class="d-none d-sm-block col-sm-4 col-lg-2">${btnStatus}  ${units[item.purchaseItem.product.productGroupId] == "m" ? btnCreateEtiket : ""}</div>
        </div>`;
    },
    createEtiket: function (saleItemId) {
        Sale.saleItems.forEach(element => {
            if (element.saleItemId == saleItemId) {
                console.log(element);
                let pv = element.purchaseItem.product.productPropertyValues;
                element.purchaseItem.product.productPropertyValues.forEach(item => {
                });
                let data = {
                    "sipno": Sale.externalSaleCode,
                    "customer": Sale.customer.title.slice(0, 20),
                    "size": pv[0].propertyValue,
                    "tanim": `${pv[1].propertyValue || ''} ${pv[2].propertyValue || ''} ${pv[4].propertyValue || ''} ${pv[6].propertyValue || ''}`,
                    "metraj": element.saleCount,
                    "agirlik": (element.purchaseItem.product.unitMass * element.saleCount).toFixed(0),
                    "pid": element.purchaseItemId
                }

                $.ajax({
                    type: "POST",
                    url: "/createEtiket",
                    dataType: "JSON",
                    data: data
                }).then(response => {
                    if (response.success)
                        setAlert('Etiket oluşturuldu', 'success')
                    else
                        setAlert('işlem başarısız')
                })
                return;
            }
        });
    }
}

let FORM = {
    createPrintForm: function () {
        $('#customer').html(Sale.customer.title)
        $('#explanation').html(Sale.explanation.replaceAll('\n','<br>'))
        $('#record').html(FORM.getTarih(Sale.recordTime))
        $('#teslimat').html(FORM.getTarih(Sale.deliveryTime))
        $('#externalSaleCode').html(Sale.externalSaleCode)
        $('#user').html(Sale.user.firstName + ' ' + Sale.user.lastName)

        FORM.writeRows();

        $(".n").clone().appendTo(".form");
    },
    writeRows: function () {
        for (const i in Sale.listItems)
            $('#products').append(FORM.getRow(Sale.listItems[i]))
    },
    getRow: function (item) {
        return `<tr>
        <td>${item.purchaseItem.product.name}</td>
        <td>${units[item.purchaseItem.product.productGroupId] == "m" ? item.purchaseItemId : ""}</td>
        <td>${(item.purchaseItem.product.unitMass * item.saleCount).toFixed(2)} ${item.purchaseItem.product.unitOfMass}</td>
        <td>${item.saleCount} ${units[item.purchaseItem.product.productGroupId]}</td>
    </tr>`;
    },
    getTarih: function (dt) {
        let d = new Date(dt);
        d.setTime(d.getTime() + 3 * 60 * 60 * 1000);
        return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    }
}