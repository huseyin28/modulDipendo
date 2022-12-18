const Authorization = 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkIzNzkxNUQ1QUYzMkNBM0ZBNzhDNzlERjg5NDUxRTREQkM4NzgyREYiLCJ4NXQiOiJzM2tWMWE4eXlqLW5qSG5maVVVZVRieUhndDgiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiI2MmIwZGJjZmVkNTAwNDU5NGNmYzIwNzkiLCJuYW1lIjoiaHVzZXlpbnlpbG1hekBjZWxzYW5jZWxpay5jb20iLCJTdG9jayI6IjEiLCJFZGl0VXNlcnMiOiIxIiwiVmlld0Nvc3QiOiIxIiwiRWRpdEN1c3RvbWVycyI6IjEiLCJWaWV3UmVwb3J0cyI6IjEiLCJQdXJjaGFzZSI6IjEiLCJFZGl0UHVyY2hhc2VzIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zUHVyY2hhc2VDb3VudCI6IjEiLCJTYWxlIjoiMSIsIkVkaXRTYWxlcyI6IjEiLCJWaWV3U2FsZXMiOiIxIiwiRWRpdFNhbGVJdGVtcyI6IjEiLCJDYWxlbmRhciI6IjEiLCJFZGl0U3VwcGxpZXJzIjoiMSIsIkVkaXRQcm9kdWN0cyI6IjEiLCJUZW5hbnQiOiI4MTAyNmRhMC0xMjQ4LTRkNWMtYjc3OC1iN2YxNjg3YzBhOWMiLCJDdWx0dXJlIjoidHItVFIiLCJvaV9wcnN0IjoiRGlwZW5kb1dlYiIsImNsaWVudF9pZCI6IkRpcGVuZG9XZWIiLCJvaV90a25faWQiOiI2MzdlNzY3Njc0MmY5ZjIwNjM4MWY2MjkiLCJhdWQiOiJEaXBlbmRvV2ViIiwiZXhwIjoxNjcxODI0MjQ2LCJpc3MiOiJodHRwczovL2lkLmRpcGVuZG8uY29tLyIsImlhdCI6MTY2OTIzMjI0Nn0.psEGK4smSz9uf5OtR8x96AcZKx6neODvgzI4eiCsBoG8arzkS8bkEijn27O-dR8X8t6SyCNUrQUdF8KvIOmNavb9lmOzMA7IDH15rrao2dA9kBdgz3207JCpkgw5AE5m_jm0xgLwHya1Ou-WsrUH7YFKiP-oVIrsamPDXVd6NwD41LUjMsG2RX3EfeLyJRG82hnQl6C-1DTeM13y9C1-ZHCUZ8Egc96McvxP36agy1NV4PcKkvRrbhNHjkClGHo9hbT8qHeBoBHeVb9bJWIQY6vnQGaU4FJnYXQjFuhncKVExzjNN2eKCvcD6hz-5xmcKHZv9JNCtAWV70huRd4SbQ';

function setAlert(str, type = 'danger'){
    $(`<div class="alert alert-${type} alert-dismissible fade show" role="alert">${str}</div>`).appendTo('.alerts').delay(5555).queue(function() { $(this).remove(); });
}

function getUnit(u){
    switch (u) {
        case "meter":
            return "m"
        case "piece":
            return " adet"
        default:
            return "";
    }
}

getGirisBekleyenCount();

function getGirisBekleyenCount(){
    $.ajax({
        url : `https://app.dipendo.com/api/purchase-items?status=3&limit=300`,
        headers: { "Authorization": Authorization }
    }).then(response => {
        $('#girisBekleyenCount').html(response.length);
    })
}