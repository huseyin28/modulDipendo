let units = { "896": "m", "897": "m", "898": "m", "899": "m", "900": "m", "901": "m", "902": "m", "903": "m", "904": "m", "905": "m", "906": "m", "907": "m", "908": "m", "909": "m", "910": "m", "911": "m", "912": "m", "913": "m", "914": "m", "915": "adet", "916": "adet", "917": "adet", "918": "adet", "919": "adet", "920": "adet", "921": "adet", "922": "m", "923": "adet", "924": "adet", "925": "adet", "926": "adet", "927": "adet", "928": "adet", "929": "adet", "930": "adet", "931": "adet", "932": "adet", "933": "kg", "934": "adet", "935": "adet", "936": "adet", "937": "kg", "943": "adet", "944": "adet" };
let Sale = null

$(document).ready(ready)

function ready() {
    const urlParams = new URLSearchParams(location.search);
    $.ajax({
        url: "https://app.dipendo.com/api/sales/" + urlParams.get('id'),
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(response => {
        Sale = response
        $('#print').off('click').on('click',function(){
            window.open('/formPrint/'+ urlParams.get('id'), "_blank") 
        })
        Sale.listItems = []
        $('#goDipendo').on('click',()=>{
            window.open(`https://app.dipendo.com/sales/${urlParams.get('id')}/detail/`, '_blank');
        })
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
    let dt = new Date($('#SendDate').val());
    dt.setDate(dt.getDate() - 1)
    let deliveryTime = `${dt.getFullYear()}-${(dt.getMonth()+1) > 9 ? dt.getMonth()+1 : '0'+(dt.getMonth()+1)}-${(dt.getDate()) > 9 ? (dt.getDate()) : '0'+(dt.getDate())}T21:00:00`;
    Sale.saleItems.forEach(item => {
        item.status = statu;
        item.deliveryTime = deliveryTime
    })
    Sale.deliveryTime = deliveryTime;
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
        ready()
    }).fail(err => {
        setAlert('Hata oluştu')
    })
}

function setToday(gun){
    let d = new Date(Date.now());
    d.setDate(d.getDate()+gun)
    if(gun == -1){
        if(d.getDay() == 0)
            d.setDate(d.getDate() - 2) // pazar ise cuma yap
        else if(d.getDay() == 6)
            d.setDate(d.getDate() - 1) // cumartesi ise cuma yap
    }

    $('#SendDate').val(`${d.getFullYear()}-${zeroDolgu(d.getMonth() + 1)}-${zeroDolgu(d.getDate())}`, gun);
    allStatus(3)
}

function zeroDolgu(sy){
    sy = '0'+sy;
    return sy.slice(-2);
}

let PAGE = {
    getSendDateItems : function(){
        let cont = `Sevk Tarihi : &ensp;<input type="date" id="SendDate" name="trip-start" value="${FORM.getTarih(Sale.deliveryTime, true)}">`;
        cont += `<button class="btn btn-primary btn-sm ml-2" onclick="setToday(-1)">Dün</button>`;
        cont += `<button class="btn btn-success btn-sm ml-2" onclick="setToday(0)">Bugün</button>`;
        return cont;
    },
    writeForm: function () {
        $('#HtmlForm #htmlCustomer').html(Sale.customer.title)
        $('#HtmlForm #htmlSendDate').html(PAGE.getSendDateItems())
        $('#HtmlForm #htmlExplanation').html((Sale.explanation || '').replaceAll('\n','<br>'))
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
        $('#explanation').html((Sale.explanation || '').replaceAll('\n','<br>'))
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
        <td>${FORM.nameReplace(item.purchaseItem.product.name)}</td>
        <td>${units[item.purchaseItem.product.productGroupId] == "m" ? item.purchaseItemId : ""}</td>
        <td>${(item.purchaseItem.product.unitMass * item.saleCount).toFixed(2)} ${item.purchaseItem.product.unitOfMass}</td>
        <td>${item.saleCount} ${units[item.purchaseItem.product.productGroupId]}</td>
    </tr>`;
    },
    getTarih: function (dt, input=false) {
        let d = new Date(dt);
        d.setTime(d.getTime() + 3 * 60 * 60 * 1000);
        if(input){
            let month = '0' + (d.getMonth() + 1);
            let day = '0' + (d.getDate());
            return `${d.getFullYear()}-${month.slice(-2)}-${day.slice(-2)}`;
        }
        return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    },
    nameReplace : function(name){
        name = name.replaceAll(' GALV ', ' <b>GALV</b> ')
        name = name.replaceAll(' LHRL ', ' <b>LHRL</b> ')
        return name;
    }
}