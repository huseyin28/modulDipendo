const Authorization = 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkIzNzkxNUQ1QUYzMkNBM0ZBNzhDNzlERjg5NDUxRTREQkM4NzgyREYiLCJ4NXQiOiJzM2tWMWE4eXlqLW5qSG5maVVVZVRieUhndDgiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiI2MmIwZGJjZmVkNTAwNDU5NGNmYzIwNzkiLCJuYW1lIjoiaHVzZXlpbnlpbG1hekBjZWxzYW5jZWxpay5jb20iLCJTdG9jayI6IjEiLCJFZGl0VXNlcnMiOiIxIiwiVmlld0Nvc3QiOiIxIiwiRWRpdEN1c3RvbWVycyI6IjEiLCJWaWV3UmVwb3J0cyI6IjEiLCJQdXJjaGFzZSI6IjEiLCJFZGl0UHVyY2hhc2VzIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zUHVyY2hhc2VDb3VudCI6IjEiLCJTYWxlIjoiMSIsIkVkaXRTYWxlcyI6IjEiLCJWaWV3U2FsZXMiOiIxIiwiRWRpdFNhbGVJdGVtcyI6IjEiLCJDYWxlbmRhciI6IjEiLCJFZGl0U3VwcGxpZXJzIjoiMSIsIkVkaXRQcm9kdWN0cyI6IjEiLCJUZW5hbnQiOiI4MTAyNmRhMC0xMjQ4LTRkNWMtYjc3OC1iN2YxNjg3YzBhOWMiLCJDdWx0dXJlIjoidHItVFIiLCJvaV9wcnN0IjoiRGlwZW5kb1dlYiIsImNsaWVudF9pZCI6IkRpcGVuZG9XZWIiLCJvaV90a25faWQiOiI2MzJhYWQ4ZmU5NTZmMDI4MzhiYzU4MzEiLCJhdWQiOiJEaXBlbmRvV2ViIiwiZXhwIjoxNjY2MzMzMzI3LCJpc3MiOiJodHRwczovL2lkLmRpcGVuZG8uY29tLyIsImlhdCI6MTY2Mzc0MTMyN30.E_ptc_jcVvSWVGYl4J9ZMu-OxaEsQIVEXltbYoNNGYXqFQfD2uT1kljppy2KWkoTWnsrKKoZPrCUUj9XHMp0YJjoGrAY-sdXcEtepANWfM3OimuBeaRVEoZLwFMnBPmKWW76NyrmjEGjM50N6vi3zTsCpna2aCKK4_PIRF_Fikd4AbeCd4gzJYY8U3LFbvb2iapNImOfXRe8Gc4J1mZn8HzUCBzR6Y6O7Y4nj2zCVq_jqsq1K35ggCHRREvzieTMp2WfP3aFtqjeb4_3Fg-fkP7MpuN_lPq5tKg2IQUyVCaG0b7xSgnitHuNZlpL05Z55Ydu_8d1Fwf4VLlDE3oKAw';

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