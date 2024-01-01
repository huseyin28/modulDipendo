//productId
var _URL = window.URL || window.webkitURL
import Lightbox from '/public/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new Lightbox({
    gallery: '#images2',
    children: 'a',
    pswpModule: () => import('/public/photoswipe/photoswipe.esm.js')
});

lightbox.on('uiRegister', function () {
    lightbox.pswp.ui.registerElement({
        name: 'test-button',
        order: 9,
        isButton: true,
        html: '<i class="fa-solid fa-trash"></i>',
        onInit: (el, pswp) => {
            pswp.on('change', () => {
                $(el).off('click').on('click', { src: pswp.currSlide.data.src }, e => {
                    console.log(e.data.src.split('/').pop());
                    console.log(location.href.split('/').pop());
                })
            });
        }
    });
});

lightbox.on('uiRegister', function () {
    lightbox.pswp.ui.registerElement({
        name: 'download-button',
        order: 8,
        isButton: true,
        tagName: 'a',

        html: {
            isCustomSVG: true,
            inner: '<path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" id="pswp__icn-download"/>',
            outlineID: 'pswp__icn-download'
        },

        onInit: (el, pswp) => {
            el.setAttribute('download', '');
            el.setAttribute('target', '_blank');
            el.setAttribute('rel', 'noopener');

            pswp.on('change', () => {
                el.href = pswp.currSlide.data.src;
            });
        }
    });
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
    <a href="/public/images/products/${img.img}" data-pswp-width="${img.width}" data-pswp-height="${img.height}" target="_blank" data-id="${img.img}">
        <img class="mb-1" src="/public/images/products/${img.img}" data-id="${img.img}"/>
    </a>`)
}