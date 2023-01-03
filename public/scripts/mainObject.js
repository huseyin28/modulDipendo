const Authorization = 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkIzNzkxNUQ1QUYzMkNBM0ZBNzhDNzlERjg5NDUxRTREQkM4NzgyREYiLCJ4NXQiOiJzM2tWMWE4eXlqLW5qSG5maVVVZVRieUhndDgiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiI2MmIwZGJjZmVkNTAwNDU5NGNmYzIwNzkiLCJuYW1lIjoiaHVzZXlpbnlpbG1hekBjZWxzYW5jZWxpay5jb20iLCJTdG9jayI6IjEiLCJFZGl0VXNlcnMiOiIxIiwiVmlld0Nvc3QiOiIxIiwiRWRpdEN1c3RvbWVycyI6IjEiLCJWaWV3UmVwb3J0cyI6IjEiLCJQdXJjaGFzZSI6IjEiLCJFZGl0UHVyY2hhc2VzIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zUHVyY2hhc2VDb3VudCI6IjEiLCJTYWxlIjoiMSIsIkVkaXRTYWxlcyI6IjEiLCJWaWV3U2FsZXMiOiIxIiwiRWRpdFNhbGVJdGVtcyI6IjEiLCJDYWxlbmRhciI6IjEiLCJFZGl0U3VwcGxpZXJzIjoiMSIsIkVkaXRQcm9kdWN0cyI6IjEiLCJUZW5hbnQiOiI4MTAyNmRhMC0xMjQ4LTRkNWMtYjc3OC1iN2YxNjg3YzBhOWMiLCJDdWx0dXJlIjoidHItVFIiLCJvaV9wcnN0IjoiRGlwZW5kb1dlYiIsImNsaWVudF9pZCI6IkRpcGVuZG9XZWIiLCJvaV90a25faWQiOiI2M2IyNjcxNjdmMTQ5NWQ1M2NkZjViMzkiLCJhdWQiOiJEaXBlbmRvV2ViIiwiZXhwIjoxNjc1MjI4MTgyLCJpc3MiOiJodHRwczovL2lkLmRpcGVuZG8uY29tLyIsImlhdCI6MTY3MjYzNjE4Mn0.kIKx7-n2PgwFyJrr2BCmPKKUb7pALQs5ZnL0zVQ5XLsO4vYq9YkMDDk8TflvOWZY14mcCnv1iF4WS4B_pbFyn5MS62For81wJn1oaX0MHcYQY7UV2s5E05xM5pB4uq0kDA022fxaGVFk87xCnglDJSGROxmmyVJTBRx6HMpskAw5Jw5nTjUx-yNxCAGIlMxwfkPtjsgQi35z6DU0z2R3akRMZVxR9ESAO7ZyrDTMWd9o4oilZq67N6CHM2oUTVvSIeaVHDdd9RV0ndD9oNYvbkpp2AHV1u37KSJ17ezB-obBMtswGzI70Y6mY_KpighwpWhpbQBVci57GHnjiX2lgw';

function setAlert(str, type = 'danger'){
    $(`<div class="alert alert-${type} alert-dismissible fade show" role="alert">${str}</div>`).appendTo('.alerts').delay(5555).queue(function() { $(this).remove(); });
}

function Login() {
    let res = false;
    $.ajax({
        type: "POST",
        async : false,
        url: 'https://app.dipendo.com/oauth/token',
        data: { "username": "huseyinyilmaz@celsancelik.com", "password": "asdasd528", "grant_type": "password", "client_id": "DipendoWeb" },
        success: response => {
            localStorage.setItem('token', response.token_type + ' ' + response.access_token);
            res = true
        },
        error: err => {
            console.log(err);
        }
    })
    return res;
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
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(response => {
        $('#girisBekleyenCount').html(response.length);
    })
}