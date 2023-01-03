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