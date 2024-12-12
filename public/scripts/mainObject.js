function setAlert(str, type = 'danger', delay = 10000) {
    let closeButton = `<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>`


    $(`<div class="alert alert-${type} alert-dismissible fade show" role="alert">${str} ${closeButton}</div>`).appendTo('.alerts').delay(delay).queue(function () { $(this).remove(); });
}

function logout() {
    localStorage.removeItem('token')
    location.assign('./login')
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
    if (screen.width < 1360)
        $('#sidebarToggle').trigger('click')
    $.ajax({
        url: `https://app.dipendo.com/api/purchase-items?status=3&limit=300`,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(response => {
        $('#girisBekleyenCount').html(response.length);
    })
}

$(document).on("ajaxStart", function () {
    $('#loading').addClass("loading");
});
$(document).on("ajaxStop", function () {
    $('#loading').removeClass("loading");
});