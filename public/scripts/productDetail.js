//productId

$(document).ready(init)

function init() {
    getProdcutDetail()
}

function getProdcutDetail() {
    $.ajax('/api/products/getById/' + productId).done(response => {
        if (response.success) {
            response.data.images = JSON.parse(response.data.images)
            console.log(response.data);
            $('#name').html(response.data.name)
            $('#id').html(response.data.id)
            loadImages(response.data.images)
        } else {
            setAlert(response.message)
        }
    })
}

function loadImages(images) {
    images.forEach(appendImage);
}

function imgUpload() {
    if (document.getElementById('fileImage').files.length != 0) {
        let formData = new FormData();
        formData.append('img', document.getElementById('fileImage').files[0])

        $.ajax({
            type: "POST",
            url: '/api/products/imgUpload/' + productId,
            data: formData,
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        }).done(response => {
            if (response.success) {
                appendImage(response.data)
                $('#fileImage').val('')
            } else {
                setAlert(response.message)
            }
        })
    }
}

function appendImage(img) {
    $('#images').append(`<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"><img class="img-fluid m-2" src="/public/images/products/${img}"></div>`)
}