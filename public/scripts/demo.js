(function(){
    $.ajax({
        url : 'https://app.dipendo.com/api/sale-items?productId=0&groupId=0&status=3&saleId=0&offset=0&limit=100&startTime=&endTime=2022-06-30T21:00:00.007Z&view=Shipped',
        headers : {
            'Authorization' : 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkIzNzkxNUQ1QUYzMkNBM0ZBNzhDNzlERjg5NDUxRTREQkM4NzgyREYiLCJ4NXQiOiJzM2tWMWE4eXlqLW5qSG5maVVVZVRieUhndDgiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiI2MmIwZGJjZmVkNTAwNDU5NGNmYzIwNzkiLCJuYW1lIjoiaHVzZXlpbnlpbG1hekBjZWxzYW5jZWxpay5jb20iLCJTdG9jayI6IjEiLCJFZGl0VXNlcnMiOiIxIiwiVmlld0Nvc3QiOiIxIiwiRWRpdEN1c3RvbWVycyI6IjEiLCJWaWV3UmVwb3J0cyI6IjEiLCJQdXJjaGFzZSI6IjEiLCJFZGl0UHVyY2hhc2VzIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zUHVyY2hhc2VDb3VudCI6IjEiLCJTYWxlIjoiMSIsIkVkaXRTYWxlcyI6IjEiLCJWaWV3U2FsZXMiOiIxIiwiRWRpdFNhbGVJdGVtcyI6IjEiLCJDYWxlbmRhciI6IjEiLCJFZGl0U3VwcGxpZXJzIjoiMSIsIkVkaXRQcm9kdWN0cyI6IjEiLCJUZW5hbnQiOiI4MTAyNmRhMC0xMjQ4LTRkNWMtYjc3OC1iN2YxNjg3YzBhOWMiLCJDdWx0dXJlIjoidHItVFIiLCJvaV9wcnN0IjoiRGlwZW5kb1dlYiIsImNsaWVudF9pZCI6IkRpcGVuZG9XZWIiLCJvaV90a25faWQiOiI2MmIxZTllMDNjNzIxYmM1NjAyNmVlODYiLCJhdWQiOiJEaXBlbmRvV2ViIiwiZXhwIjoxNjU4NDE4OTEyLCJpc3MiOiJodHRwczovL2lkLmRpcGVuZG8uY29tLyIsImlhdCI6MTY1NTgyNjkxMn0.XOwWG7Y4JcbrrjQIoK0ezdDvDhcjEBjIcEvC-GZnZcToQn-Gx8ZQ5e2tRnEKScv7e2REQ7y_kV99kj-kRSAfTSmiqobSStX27C0KEl0v9Xa8ZBrt3CwGzvocxcN-6thc6C59qYfxxjuAR3yC0iODIR5BKeimbrJDnTS8-4xCInDhntsAnt1l8IUc5ce3TeHqKJxL7RJxwfNgEfDAN0l-cDHibUkIJ1Vm9GCKNis-XLpqEArbWiDhtujO3qeowsFg_Q4FtKHV_2qwDoxy59MfscMMFTpvpQdjnGh2J3GVJHblfb33SmoufS4-O3Y_3X0Z1M_l2CyIi-xl7XIxqi2rzQ'
        }
    }).then(response => {
        response.forEach(element => {
            $('#list').append(getRowHTML(element))
        });
    })
})()

function getRowHTML(item){
    console.log(item.purchaseItem.product.name, item.customer.title.slice(0, 10));
    console.log(item);
    let dt = new Date(item.deliveryTime);
    return `<div class="row">
    <div class="col-2">${dt.getDate()+1}.${dt.getMonth()+1}.${dt.getFullYear()}</div>
    <div class="col-6">${item.purchaseItem.product.name}</div>
    <div class="col-4">${item.customer.title.slice(0, 20)}</div>
    </div>`
}