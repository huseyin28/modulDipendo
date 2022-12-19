const Authorization = 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkIzNzkxNUQ1QUYzMkNBM0ZBNzhDNzlERjg5NDUxRTREQkM4NzgyREYiLCJ4NXQiOiJzM2tWMWE4eXlqLW5qSG5maVVVZVRieUhndDgiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiI2MmIwZGJjZmVkNTAwNDU5NGNmYzIwNzkiLCJuYW1lIjoiaHVzZXlpbnlpbG1hekBjZWxzYW5jZWxpay5jb20iLCJTdG9jayI6IjEiLCJFZGl0VXNlcnMiOiIxIiwiVmlld0Nvc3QiOiIxIiwiRWRpdEN1c3RvbWVycyI6IjEiLCJWaWV3UmVwb3J0cyI6IjEiLCJQdXJjaGFzZSI6IjEiLCJFZGl0UHVyY2hhc2VzIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zUHVyY2hhc2VDb3VudCI6IjEiLCJTYWxlIjoiMSIsIkVkaXRTYWxlcyI6IjEiLCJWaWV3U2FsZXMiOiIxIiwiRWRpdFNhbGVJdGVtcyI6IjEiLCJDYWxlbmRhciI6IjEiLCJFZGl0U3VwcGxpZXJzIjoiMSIsIkVkaXRQcm9kdWN0cyI6IjEiLCJUZW5hbnQiOiI4MTAyNmRhMC0xMjQ4LTRkNWMtYjc3OC1iN2YxNjg3YzBhOWMiLCJDdWx0dXJlIjoidHItVFIiLCJvaV9wcnN0IjoiRGlwZW5kb1dlYiIsImNsaWVudF9pZCI6IkRpcGVuZG9XZWIiLCJvaV90a25faWQiOiI2Mzg5YjRhZDRjMjAwNGJmNGEzMTdiZDEiLCJhdWQiOiJEaXBlbmRvV2ViIiwiZXhwIjoxNjcyNTYxMDY5LCJpc3MiOiJodHRwczovL2lkLmRpcGVuZG8uY29tLyIsImlhdCI6MTY2OTk2OTA2OX0.JswZLcE6ZrLsu-AjyDQZm8d7lvaIHNW7g8QZSBhTv8ATV4KGIW2HImpugYwCr5lL1xj18qDweChPw2rrghs3xyhrfwk97cqeZSZ6rjnQDGkyZIoYsfSO2lMXojkvP8WiVCFQ2-6M2cRII3SzrtL5VfgltWYMIu-gSjAQH8piRnN9a5xl10IEOd-NE0dpuX8zJH43NgMvwyRnwd7y0UVea7vtvUFJHAOd9mqVmjVxXJUdYgrrzOgKk3H4XXzU-weys2umEXso2T_LCKhv7UNrDPUslA69PGUSTn7CimhSIv3C3aB5AMNHBsPAMSazspa6YwPl-8cLgvCHdbHTKYlb_w';

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