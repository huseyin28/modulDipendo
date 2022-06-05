let Authorization = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiJ9.eyJuYW1laWQiOiI0MyIsInVuaXF1ZV9uYW1lIjoiaHVzZXlpbnlpbG1hekBjZWxzYW5jZWxpay5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL2FjY2Vzc2NvbnRyb2xzZXJ2aWNlLzIwMTAvMDcvY2xhaW1zL2lkZW50aXR5cHJvdmlkZXIiOiJBU1AuTkVUIElkZW50aXR5IiwiQXNwTmV0LklkZW50aXR5LlNlY3VyaXR5U3RhbXAiOiJiZTZhZWFhMS1mOThmLTQ5MmMtODViNy00YzU0NzdiZWI5MDQiLCJTdG9jayI6IjEiLCJFZGl0VXNlcnMiOiIxIiwiVmlld0Nvc3QiOiIxIiwiRWRpdEN1c3RvbWVycyI6IjEiLCJWaWV3UmVwb3J0cyI6IjEiLCJQdXJjaGFzZSI6IjEiLCJFZGl0UHVyY2hhc2VzIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zUHVyY2hhc2VDb3VudCI6IjEiLCJTYWxlIjoiMSIsIkVkaXRTYWxlcyI6IjEiLCJWaWV3U2FsZXMiOiIxIiwiRWRpdFNhbGVJdGVtcyI6IjEiLCJDYWxlbmRhciI6IjEiLCJFZGl0U3VwcGxpZXJzIjoiMSIsIkVkaXRQcm9kdWN0cyI6IjEiLCJUZW5hbnQiOiI4MTAyNmRhMC0xMjQ4LTRkNWMtYjc3OC1iN2YxNjg3YzBhOWMiLCJDdWx0dXJlIjoidHItVFIiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0L0RpcGVuZG8uQVBJLyIsImF1ZCI6ImM5MmQ1ZTQ1OGI1NmUyNDMyOGVmMzE1NWEwZGU1YmE3IiwiZXhwIjoxNjU1MjIxNzc0LCJuYmYiOjE2NTI2Mjk3NzR9.nzyl2Nj8U6UqAsTodXugavYlOCp_q1llhbJc4cJdw2qb6ujCdKVrxZNkXdRRuBzUdLr1ApD4OF6p5QljpkOe-Q`;
let units = `{"896":"m","897":"m","898":"m","899":"m","900":"m","901":"m","902":"m","903":"m","904":"m","905":"m","906":"m","907":"m","908":"m","909":"m","910":"m","911":"m","912":"m","913":"m","914":"m","915":"adet","916":"adet","917":"adet","918":"adet","919":"adet","920":"adet","921":"adet","922":"m","923":"adet","924":"adet","925":"adet","926":"adet","927":"adet","928":"adet","929":"adet","930":"adet","931":"adet","932":"adet","933":"kg","934":"adet","935":"adet","936":"adet","937":"kg","943":"adet","944":"adet"}`;
let Sale = null

$(document).ready(Login)

function Login() {
    units = JSON.parse(units)
    const urlParams = new URLSearchParams(location.search);
    $.ajax({
        url: "https://app.dipendo.com/api/sales/" + urlParams.get('id'),
        headers: { "Authorization": Authorization }
    }).then(response => {
        Sale = response
        FORM.createPrintForm(response);
        PAGE.writeForm(response, urlParams.get('id'));
    })
}

let PAGE = {
    writeForm: function (response, sid) {
        $('#HtmlForm #htmlCustomer').html(response.customer.title)
        $('#HtmlForm #htmlSendDate').html(`Sevk Tarihi : ${FORM.getTarih(response.deliveryTime)}`)
        $('#HtmlForm #htmlExplanation').html(response.explanation)
        $('#HtmlForm #htmlUser').html(response.user.firstName + ' ' + response.user.lastName + ' / <small>' + FORM.getTarih(response.recordTime) + '</small>')
        $('#htmlSaleCode').html(`Sipariş No : ${response.externalSaleCode}`)

        PAGE.writeProducts(response.saleItems)
    },
    writeProducts: function (items) {
        let list = {};
        for (const i in items) {
            if (Object.hasOwnProperty.call(items, i)) {
                if (units[items[i].purchaseItem.product.productGroupId] != "m") {
                    if (!Object.hasOwnProperty.call(list, items[i].purchaseItem.productId)) {
                        list[items[i].purchaseItem.productId] = items[i]
                    }
                } else {
                    list[items[i].saleItemId] = items[i]
                }
            }
        }
        $('#htmlProducts').html(PAGE.getHead())
        for (const [key, value] of Object.entries(list)) {
            $('#htmlProducts').append(PAGE.getRow(value))
        }
    },
    getRow: function (item) {
        let btnCreateEtiket = `<button type="button" onclick="PAGE.createEtiket(${item.saleItemId})" class="btn btn-link btn-sm p-0">OLUŞTUR</button>`
        return `<div class="row">
            <div class="col-8">${item.purchaseItem.product.name}</div>
            <div class="col-1">${units[item.purchaseItem.product.productGroupId] == "m" ? item.purchaseItemId : ""}</div>
            <div class="col-1">${(item.purchaseItem.product.unitMass * item.saleCount).toFixed(2)} ${item.purchaseItem.product.unitOfMass}</div>
            <div class="col-1">${item.saleCount} ${units[item.purchaseItem.product.productGroupId]}</div>
            <div class="col-1">${units[item.purchaseItem.product.productGroupId] == "m" ? btnCreateEtiket : ""}</div>
        </div>`;
    },
    createEtiket : function(saleItemId){
        Sale.saleItems.forEach(element => {
            if(element.saleItemId == saleItemId){
                console.log(Sale.customer);
                let data = {
                    "sipno" :  Sale.externalSaleCode,
                    "customer" : Sale.customer.title.slice(0, 20),
                    "size" : element.purchaseItem.product.productPropertyValues[0].propertyValue,
                    "tanim" : element.purchaseItem.product.productPropertyValues[1].propertyValue +' '+element.purchaseItem.product.productPropertyValues[2].propertyValue +' '+ element.purchaseItem.product.productPropertyValues[4].propertyValue +' '+ element.purchaseItem.product.productPropertyValues[6].propertyValue,
                    "metraj" : element.saleCount,
                    "agirlik" : (element.purchaseItem.product.unitMass * element.saleCount).toFixed(0),
                    "pid" : element.purchaseItemId
                }

                $.ajax({
                    type : "POST",
                    url : "/createEtiket",
                    dataType : "JSON",
                    data : data
                }).then(response => {
                    if(response.success){
                        alert("Etiket oluşturuldu")
                    }else{
                        alert("işlem başarısız")
                    }
                })
                return;
            }
        });
    },
    getHead: function () {
        return `<div class="row">
        <div class="col-8 h6">ÜRÜN</div>
        <div class="col-1 h6">KİMLİK</div>
        <div class="col-1 h6">AĞIRLIK</div>
        <div class="col-1 h6">MİKTAR</div>
        <div class="col-1 h6">ETİKET</div>
    </div>`
    }
}


let FORM = {
    createPrintForm: function (response) {
        $('#customer').html(response.customer.title)
        $('#explanation').html(response.explanation)
        $('#record').html(FORM.getTarih(response.recordTime))
        $('#teslimat').html(FORM.getTarih(response.deliveryTime))
        $('#externalSaleCode').html(response.externalSaleCode)
        $('#user').html(response.user.firstName + ' ' + response.user.lastName)

        FORM.writeRows(response);

        $(".n").clone().appendTo(".form");
    },
    writeRows: function (response) {
        let list = {};
        for (const i in response.saleItems) {
            if (Object.hasOwnProperty.call(response.saleItems, i)) {
                if (units[response.saleItems[i].purchaseItem.product.productGroupId] != "m") {
                    if (Object.hasOwnProperty.call(list, response.saleItems[i].purchaseItem.productId)) {
                        list[response.saleItems[i].purchaseItem.productId].saleCount += response.saleItems[i].saleCount
                    } else {
                        list[response.saleItems[i].purchaseItem.productId] = response.saleItems[i]
                    }
                } else {
                    list[response.saleItems[i].purchaseItemId + '' + i] = response.saleItems[i]
                }
            }
        }
        for (const [key, value] of Object.entries(list)) {
            $('#products').append(FORM.getRow(value))
        }
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







