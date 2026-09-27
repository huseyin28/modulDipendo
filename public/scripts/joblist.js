$(document).ready(init);

function init() {
    getJobList();
    document.querySelectorAll('.dropzone').forEach(function (el) {
        new Sortable(el, {
            group: {
                name: 'jobs',
                pull: true,
                put: true
            },
            animation: 150,
            ghostClass: 'drag-ghost',
            onEnd: function (evt) {
                console.log("Taşınan ID:", evt.item.dataset.id);
                console.log("Eski liste:", evt.from.dataset.category);
                console.log("Yeni liste:", evt.to.dataset.category);
                console.log("Yeni sıra:", evt.newIndex);
                saveJobPositions();
            }
        });

    });
}

function getJobList() {
    $.ajax({
        url: 'https://app.dipendo.com/api/sale-items?status=1&offset=0&limit=9999&view=ReadyForShipment',
        method: 'GET',
        headers: { "Authorization": localStorage.getItem('token') },
        success: function (data) {
            let ids = {};
            data.forEach(element => {
                ids[element.saleId] = {
                    id: element.saleId,
                    name: element.customer.title,
                };
            });
            for (const key in ids) {
                $(`#pendingJobs`).append(`<li><a class="job-item" data-id="${key}" target="_blank" href="/sale/detail/${ids[key].id}">${ids[key].name}</a></li>`);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}


function saveJobPositions() {

    const data = [];

    document.querySelectorAll('.dropzone').forEach(function (dropzone) {

        const category = dropzone.dataset.category;

        dropzone.querySelectorAll('.job-item').forEach(function (item, index) {

            data.push({
                id: item.dataset.id,
                category: category,
                order: index + 1
            });

        });

    });

    console.log(data);

    // fetch('/api/jobs/reorder', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // })
    //     .then(response => response.json())
    //     .then(result => {
    //         console.log('Kaydedildi:', result);
    //     })
    //     .catch(error => {
    //         console.error('Kaydetme hatası:', error);
    //     });
}
