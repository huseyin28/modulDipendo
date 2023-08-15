function setAlert(str, type = 'danger', delay = 60000) {
    let closeButton = `<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>`
    $(`<div class="alert alert-${type} alert-dismissible fade show" role="alert">${str} ${closeButton}</div>`).appendTo('.alerts').delay(delay).queue(function () { $(this).remove(); });
}

function Login() {
    let res = false;
    $.ajax({
        type: "POST",
        async: false,
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

function getUnit(u) {
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

function getGirisBekleyenCount() {
    $.ajax({
        url: `https://app.dipendo.com/api/purchase-items?status=3&limit=300`,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(response => {
        $('#girisBekleyenCount').html(response.length);
    })
}