const Authorization = 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkIzNzkxNUQ1QUYzMkNBM0ZBNzhDNzlERjg5NDUxRTREQkM4NzgyREYiLCJ4NXQiOiJzM2tWMWE4eXlqLW5qSG5maVVVZVRieUhndDgiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiI2MmIwZGJjZmVkNTAwNDU5NGNmYzIwNzkiLCJuYW1lIjoiaHVzZXlpbnlpbG1hekBjZWxzYW5jZWxpay5jb20iLCJTdG9jayI6IjEiLCJFZGl0VXNlcnMiOiIxIiwiVmlld0Nvc3QiOiIxIiwiRWRpdEN1c3RvbWVycyI6IjEiLCJWaWV3UmVwb3J0cyI6IjEiLCJQdXJjaGFzZSI6IjEiLCJFZGl0UHVyY2hhc2VzIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zUHVyY2hhc2VDb3VudCI6IjEiLCJTYWxlIjoiMSIsIkVkaXRTYWxlcyI6IjEiLCJWaWV3U2FsZXMiOiIxIiwiRWRpdFNhbGVJdGVtcyI6IjEiLCJDYWxlbmRhciI6IjEiLCJFZGl0U3VwcGxpZXJzIjoiMSIsIkVkaXRQcm9kdWN0cyI6IjEiLCJUZW5hbnQiOiI4MTAyNmRhMC0xMjQ4LTRkNWMtYjc3OC1iN2YxNjg3YzBhOWMiLCJDdWx0dXJlIjoidHItVFIiLCJvaV9wcnN0IjoiRGlwZW5kb1dlYiIsImNsaWVudF9pZCI6IkRpcGVuZG9XZWIiLCJvaV90a25faWQiOiI2MzNhNzhlNTIzMzUyYmI5MGFmNDFjNWUiLCJhdWQiOiJEaXBlbmRvV2ViIiwiZXhwIjoxNjY3MzY4NDIxLCJpc3MiOiJodHRwczovL2lkLmRpcGVuZG8uY29tLyIsImlhdCI6MTY2NDc3NjQyMX0.eNt_Xbhd9m3SyPzJbWdeEmck6k9Yp-He-w8nhRFGGBHypeFodauMuMdVFRVKDKBwuPL8OiGiIinc51PlP6OwKVApkACutxN3mibAQMjqnV-n2vpQ0_PWGmJp6_826LZKYezZYh85_QDOlB4IKzn46ZrbW4GFJNX9NoeAnZYSyjCK1ZkA4UDJkRxo8BUkMXwkJvKyZqoO8nPS57vUyZYQ8iB-ySD5Vwzm7W0KdC6nkH0Nn0NpnP-SwsnZNiZJAGB79cPDUm-SUZ0FYaFjmkXvuVewVmPQyTwAE8kgtZlrV_MAuaJorMsiVZYtpxspZHdhy22TJO7jW9kKPjRAuGxMmg';

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