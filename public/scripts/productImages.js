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
    $.ajax('/api/products/getByGroupId/' + id).done(response => {
        if (response.success) {
            response.data.forEach(product => { $('#products').append(`<tr><td><a href="/product/detail/${product.id}">${product.name}</a></td></tr>`) })
        } else {
            setAlert(response.message)
        }
    })
}