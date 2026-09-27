$(document).ready(init);

function init() {
    getJobList();
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
            console.log(ids);
        },
        error: function (err) {
            console.log(err);
        }
    });
}