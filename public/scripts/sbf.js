$(document).ready(main)

function main() {
    $.ajax({
        url: `https://app.dipendo.com/api/sale-items?status=3&offset=0&limit=150`,
        headers: { "Authorization": Authorization }
    }).then(loadList)
}

function loadList(response){
    $('#list').html("");
    console.log(response);
    for (const i in response) {
        if (Object.hasOwnProperty.call(response, i)) {
            const element = response[i];
            $('#list').append(`<div class="row">
                <div class="col-3"><i class="fa-solid fa-plus fa-fw text-success"></i> ${strReplace.getCustomer(element.customer.title)}</div>
                <div class="col-5">${strReplace.getProduct(element.purchaseItem.product.name)}</div>
            </div>`)

        }
    }
}

class strReplace{
    static getCustomer(title){
        let exp = title.split(" ")
        return `${exp[0]} ${exp[1]}`
    }

    static getProduct(name){
        name = name.replaceAll('Omega ', 'O ')
        name = name.replaceAll(' Ton ', 'T ')
        name = name.replaceAll(' Yellow Pin ', ' YP ')
        name = name.replaceAll(' Polyester Sapan ', ' PS ')
        name = name.replaceAll(' UNGALV', '')
        name = name.replaceAll(' A1', '')
        name = name.replaceAll(' A2', '')
        name = name.replaceAll(' A3', '')
        name = name.replaceAll(' A4', '')
        name = name.replaceAll(' A5', '')
        name = name.replaceAll(' DRY', '')
        name = name.replaceAll(' 1960', '')
        name = name.replaceAll(' 1770', '')
        name = name.replaceAll(' 2160', '')
        name = name.replaceAll(' RHRL', '')
        name = name.replaceAll(' RHLL', '')
        name = name.replaceAll(' LHRL', ' SOL')
        name = name.replaceAll(' LHLL', ' SOL')
        name = name.replaceAll(' WS', '')
        name = name.replaceAll(' KÖ', '+1')
        name = name.replaceAll(' SEALE', 'S')
        name = name.replaceAll(' Van Beest', ' VANB')
        return name
    }
}