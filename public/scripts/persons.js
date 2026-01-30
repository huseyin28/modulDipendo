$(document).ready(() => {
    renderPersons('#personsTableBody')
    $('#btnOpenAddModel').on('click', () => {
        $('#addPersonModal #btnOnay').off('click').on('click', addPerson);
        $('#addPersonModal').modal('show')
        $('#addPersonModal input').val('');
    });
})

function loadPersons() {
    return $.ajax({
        url: '/api/person/get',
    })
}

function renderPersons(target) {
    loadPersons().done(response => {
        if (!response.success) return setAlert(response.message)
        const $t = $(target)
        $t.html('')
        let sayac = 1
        response.data.forEach(p => {
            $t.append(`<tr>
				<td>${sayac++}</td>
				<td>${p.name} ${p.surname}</td>
				<td class="d-none d-sm-table-cell">${p.birthday || ''}</td>
				<td>${p.shoe || ''}</td>
				<td>${p.trousers || ''}</td>
				<td>${p.tshirt || ''}</td>
				<td>${p.jacket || ''}</td>
                <td class="p-0 text-center">
                    <button class="btn btn-sm btn-link mx-auto text-danger" onclick="deletePerson(${p.id})"><i class="fa-solid fa-fw fa-trash"></i></button>
                    <button class="btn btn-sm btn-link mx-auto text-primary" onclick="editPerson(${p.id})"><i class="fa-solid fa-fw fa-pencil"></i></button>
                </td>
			</tr>`)
        })
    }).fail(err => {
        if (err.status == 401) location.assign('./login')
        else setAlert('Kişiler alınırken hata oluştu')
    })
}

function addPerson() {
    const name = $('#addPersonModal #firstName').val().trim()
    const surname = $('#addPersonModal #lastName').val().trim()
    const birthday = $('#addPersonModal #birthday').val().trim()
    const shoe = $('#addPersonModal #shoe').val().trim()
    const trousers = $('#addPersonModal #trousers').val().trim()
    const tshirt = $('#addPersonModal #tshirt').val().trim()
    const jacket = $('#addPersonModal #jacket').val().trim()

    $.ajax({
        url: '/api/person/add',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            name,
            surname,
            birthday: birthday || null,
            shoe: shoe || null,
            trousers: trousers || null,
            tshirt: tshirt || null,
            jacket: jacket || null
        })
    }).done(response => {
        if (response.success) {
            setAlert('Kişi başarıyla eklendi', 'success')
            $('#addPersonModal').modal('hide')
            renderPersons('#personsTableBody')
        } else {
            setAlert(response.message)
        }
    }).fail(err => {
        setAlert('Kişi eklenirken hata oluştu')
    })
}

function editPerson(personId) {
    $.ajax({
        url: '/api/person/get/' + personId,
        method: 'GET',
        contentType: 'application/json'
    }).done(response => {
        if (response.success) {
            const person = response.data
            $('#addPersonModal #firstName').val(person.name)
            $('#addPersonModal #lastName').val(person.surname)
            $('#addPersonModal #birthday').val(person.birthday ? person.birthday.split('T')[0] : '')
            $('#addPersonModal #shoe').val(person.shoe)
            $('#addPersonModal #trousers').val(person.trousers)
            $('#addPersonModal #tshirt').val(person.tshirt)
            $('#addPersonModal #jacket').val(person.jacket)
            $('#addPersonModal #btnOnay').off('click').on('click', function () {
                updatePerson(personId)
            })
            $('#addPersonModal').modal('show')
        } else {
            setAlert(response.message)
        }
    }).fail(err => {
        setAlert('Kişi bilgileri alınırken hata oluştu')
    })
}

function updatePerson(personId) {
    const name = $('#addPersonModal #firstName').val().trim()
    const surname = $('#addPersonModal #lastName').val().trim()
    const birthday = $('#addPersonModal #birthday').val().trim()
    const shoe = $('#addPersonModal #shoe').val().trim()
    const trousers = $('#addPersonModal #trousers').val().trim()
    const tshirt = $('#addPersonModal #tshirt').val().trim()
    const jacket = $('#addPersonModal #jacket').val().trim()

    $.ajax({
        url: '/api/person/update/' + personId,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            name,
            surname,
            birthday: birthday || null,
            shoe: shoe || null,
            trousers: trousers || null,
            tshirt: tshirt || null,
            jacket: jacket || null
        })
    }).done(response => {
        if (response.success) {
            setAlert('Kişi başarıyla güncellendi', 'success')
            $('#addPersonModal').modal('hide')
            renderPersons('#personsTableBody')
        } else {
            setAlert(response.message)
        }
    }).fail(err => {
        setAlert('Kişi güncellenirken hata oluştu')
    })
}

function deletePerson(personId) {
    if (confirm('Bu kişiyi silmek istediğinize emin misiniz?')) {
        $.ajax({
            url: '/api/person/delete/' + personId,
            method: 'DELETE',
            contentType: 'application/json'
        }).done(response => {
            if (response.success) {
                setAlert('Kişi başarıyla silindi', 'success')
                renderPersons('#personsTableBody')
            } else {
                setAlert(response.message)
            }
        }).fail(err => {
            setAlert('Kişi silinirken hata oluştu')
        })
    }
}
