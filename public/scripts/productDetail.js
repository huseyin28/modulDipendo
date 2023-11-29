//productId
var _URL = window.URL || window.webkitURL
import Lightbox from '/public/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new Lightbox({
    gallery: '#images2',
    children: 'a',
    pswpModule: () => import('/public/photoswipe/photoswipe.esm.js')
});

let imgWidth = 0, imgHeight = 0;

$(document).ready(init)

function init() {
    $('#imgUpload').off('click').on('click', imgUpload)
    $('#fileImage').off('change').on('change', function () {
        var objectUrl = _URL.createObjectURL(document.getElementById('fileImage').files[0]);
        let img = new Image();
        img.onload = function () {
            imgWidth = this.width
            imgHeight = this.height
            _URL.revokeObjectURL(objectUrl);
        };
        img.src = objectUrl;
    })
    getProdcutDetail()
}

function getProdcutDetail() {
    $.ajax('/api/products/getById/' + productId).done(response => {
        if (response.success) {
            response.data.images = JSON.parse(response.data.images)
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
    lightbox.init();
}

function imgUpload() {
    if (document.getElementById('fileImage').files.length != 0) {
        let img = new Image();
        img.src = _URL.createObjectURL(document.getElementById('fileImage').files[0]);
        let formData = new FormData();
        formData.append('img', document.getElementById('fileImage').files[0])
        formData.append('width', imgWidth)
        formData.append('height', imgHeight)
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
    $('#images2').append(` 
    <a href="/public/images/products/${img.img}" data-pswp-width="${img.width}" data-pswp-height="${img.height}" target="_blank">
        <img src="/public/images/products/${img.img}" alt="" />
    </a>`)
}