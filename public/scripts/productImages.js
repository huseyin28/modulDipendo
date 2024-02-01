let filters = {
    text: null,
    nonImg: false
},
    timeOut = null

$(document).ready(init)

function init() {
    getGroups()
}

function getGroups() {
    $.ajax('/api/group/get').done(response => {
        if (response.success) {
            response.data.forEach(group => { $('#groups').append(`<option value="${group.id}">${group.name}</opiton>`) })
            $('#groups').on('change', getProdcuts).trigger('change')
        } else {
            setAlert(response.message)
        }
    })
}

function getProdcuts(id = null) {
    if (this.value)
        id = this.value
    $('#products').html('')
    $.ajax({
        url: '/api/products/getByGroupId/' + id,
        data: filters
    }).done(response => {
        if (response.success) {
            response.data.forEach(product => {
                $('#products').append(
                    `<tr><td><a href="/product/detail/${product.id}">${product.name} <small class="text-secondary float-right">( ${product.shortName} ${product.brand} )</small></a></td></tr>`)
            })
            $('#search').off('keyup').on('keyup', setKeyup)
            $('#nonImg').off('change').on('change', setNonImg)
        } else {
            setAlert(response.message)
        }
    })
}

function setKeyup() {
    if (timeOut != null) {
        clearTimeout(timeOut)
        timeOut = null
    }
    timeOut = setTimeout(function () {
        filters.text = $('#search').val().trim()
        $('#groups').trigger('change')
    }, 750)
}

function setNonImg() {
    filters.nonImg = $(this).prop('checked')
    $('#groups').trigger('change')
}