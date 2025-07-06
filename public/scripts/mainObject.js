let units = { "896": "m", "897": "m", "898": "m", "899": "m", "900": "m", "901": "m", "902": "m", "903": "m", "904": "m", "905": "m", "906": "m", "907": "m", "908": "m", "909": "m", "910": "m", "911": "m", "912": "m", "913": "m", "914": "m", "915": "adet", "916": "adet", "917": "adet", "918": "adet", "919": "adet", "920": "adet", "921": "adet", "922": "m", "923": "adet", "924": "adet", "925": "adet", "926": "adet", "927": "adet", "928": "adet", "929": "adet", "930": "adet", "931": "adet", "932": "adet", "933": "kg", "934": "adet", "935": "adet", "936": "adet", "937": "kg", "943": "adet", "944": "adet" };

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