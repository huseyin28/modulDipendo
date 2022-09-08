class main {
    constructor() {
        this.getLastSales()
        this.getGirisBeklenler()
        this.getCikisBekleyenler()
        this.getSevkeHazir()
    }

    ajaxFail(error) {
        setAlert("Malesef işlem başarısız lütfen daha sonra tekrar deneyiniz")
        console.log(error);
    }

    getSevkeHazir(){
        $.ajax({
            url : `https://app.dipendo.com/api/sale-items?status=2&limit=3000`,
            headers: { "Authorization": Authorization }
        }).then(response => {
            $('#sevkeHazir').html('');
            response.forEach(element => {
                $('#sevkeHazir').append(`<div class="row hover">
                <div class="col">${element.customer.title} - ${element.purchaseItem.product.name}
                <span class="float-right mr-4"><i onclick="mymain.depodanGonder(${element.saleItemId})" style="cursor: pointer;" class="fa-solid fa-fw fa-arrow-right-from-bracket text-success"></i></span></div>
            </div>`)
            });
        }).fail(this.ajaxFail)
    }

    depodanGonder(saleItemId){
        let dt = new Date();
        let deliveryTime = `${dt.getFullYear()}-${(dt.getMonth()+1).length > 9 ? dt.getMonth()+1 : '0'+(dt.getMonth()+1)}-${(dt.getDate()).length > 9 ? dt.getDate() : '0'+(dt.getDate())}T21:00:00`;
        $.ajax({
            type : "PATCH",
            url : `https://app.dipendo.com/api/sale-items/${saleItemId}`,
            data : {"status":3, "deliveryTime" : deliveryTime},
            headers : { "Authorization": Authorization }
        }).then(response => {
            this.getSevkeHazir()
        }).fail(this.ajaxFail)
    }

    getCikisBekleyenler(){
        $.ajax({
            url : `https://app.dipendo.com/api/sale-items?status=1&limit=3000`,
            headers: { "Authorization": Authorization }
        }).then(response => {
            $('#cikisBekleyen').html('');
            response.forEach(element => {
                $('#cikisBekleyen').append(`<div class="row hover">
                <div class="col">${element.customer.title} - ${element.purchaseItem.product.name}
                <span class="float-right mr-4"><i onclick="mymain.Hazirla(${element.saleItemId})" style="cursor: pointer;" class="fa-solid fa-fw fa-check text-success"></i></span></div>
            </div>`)
            });
        }).fail(this.ajaxFail)
    }

    Hazirla(saleItemId){
        $.ajax({
            type : "PATCH",
            url : `https://app.dipendo.com/api/sale-items/${saleItemId}`,
            data : {"status":2},
            headers : { "Authorization": Authorization }
        }).then(response => {
            console.log(response)
            this.getCikisBekleyenler()
        }).fail(this.ajaxFail)
    }

    getGirisBeklenler() {
        $.ajax({
            url: `https://app.dipendo.com/api/purchase-items?status=3&limit=300`,
            headers: { "Authorization": Authorization }
        }).then(this.writeGirisBekleyenler)
    }

    writeGirisBekleyenler(items) {
        // purchaseItemId 
        $('#girisBekleyen').html('')
        items.forEach(element => {
            $('#girisBekleyen').append(`<div class="row hover">
                <div class="col">${element.product.name} 
                <span class="float-right mr-4"><i onclick="mymain.depoyaAl(${element.purchaseItemId})" style="cursor: pointer;" class="fa-solid fa-fw fa-arrow-right-to-bracket text-success"></i></span></div>
            </div>`)
        });
    }

    depoyaAl(pid){
        $.ajax({
            type : "PATCH",
            url : `https://app.dipendo.com/api/purchase-items/${pid}`,
            data : {"status":4},
            headers : { "Authorization": Authorization }
        }).then(response => {
            console.log(response)
            this.getGirisBeklenler()
        }).fail(this.ajaxFail)
    }

    getLastSales() {
        $.ajax({
            url: 'https://app.dipendo.com/api/sales?limit=30&status=3',
            headers: { Authorization: Authorization }
        }).then(this.writeLastSales).fail(this.ajaxFail)
    }

    writeLastSales(sales) {
        sales.forEach(sale => {
            $('#sonGelenSiparisler').append(`<div class="row hover">
                <div class="col">${sale.customer.title} 
                <span class="float-right mr-4"><i onclick="window.open('/detay?id=${sale.id}');" style="cursor: pointer;" class="fa-solid fa-fw fa-arrow-right text-success"></i></span></div>
            </div>`)
        });
    }

}

let mymain = new main()