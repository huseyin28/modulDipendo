class main {
    constructor() {
        this.getLastSales()
        this.getGirisBeklenler()
    }

    ajaxFail(error) {
        setAlert("Malesef işlem başarısız lütfen daha sonra tekrar deneyiniz")
        console.log(error);
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
            $('#girisBekleyen').append(`<div class="row">
            <div class="col">${element.product.name} 
            <span class="float-right mr-4"><i onclick="mymain.depoyaAl(${element.purchaseItemId})" style="cursor: pointer;" class="fa-solid fa-fw fa-arrow-right-to-bracket text-success"></i></span></div>
        </div>`)
        /*
        depodaya giriş fonksiyonu yazılacak
        not : https://app.dipendo.com/api/purchase-items/${element.purchaseItemId}  Method : PATCH DATA : {"status":4}
        yukarıdaki linke ilgili method ile status : 4 objesi eklenip gönderilecek ardından listeleme yenilenecek.
        */
            console.log(element);
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
            $('#sonGelenSiparisler').append(`<div class="row">
                <div class="col">${sale.customer.title} 
                <span class="float-right mr-4"><i onclick="window.open('/detay?id=${sale.id}');" style="cursor: pointer;" class="fa-solid fa-fw fa-arrow-right text-success"></i></span></div>
            </div>`)
        });
    }

}

let mymain = new main()