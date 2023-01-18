$(document).ready(main)

function main() {
    $('#btnOnay').on('click',createForm)
    $.ajax({
        url: `https://app.dipendo.com/api/sale-items?status=3&offset=0&limit=150`,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(loadList)
}

function loadList(response){
    $('#list').html("");
    for (const i in response) {
        if (Object.hasOwnProperty.call(response, i)) {
            const element = response[i];
            $('#SBF').append(`<tr id="${element.saleItemId}">
                <td>${Number(i)+1}</td>
                <td>${strReplace.getCustomer(element.customer.title)}</div>
                <td>${strReplace.getProduct(element.purchaseItem.product.name)}</div>
                <td>${element.saleCount}</div>
                <td>${strReplace.getMarka(getVal(element.purchaseItem.product.propertyValues,'Marka'))}</div>
                <td>${getNote(element)}</div>
            </tr>`)

        }
    }
    $('#SBF tr').off('click').on('click', selectItem);
}

function createForm(){
    
}

/*
NOT : ürün ismini "propertyValues" ile markasız bir şekilde oluşturucam
note kısmını elle yazıcam
adetli ürünlerin birleştirilmesi mevzusu
*/


function getNote(element){
    if(element.purchaseItem.product.groupUnit == 'piece'){
        return 'Verildi'
    }else{
        return '-'
    }

}

function selectItem(){
    $(this).css("background-color", "#c4ffc4");

    console.log($(this).attr('id'));
}

function getVal(vals,Name){
    let sonuc = '';
    vals.forEach(element => {
        if(element.propertyName == Name){
            sonuc = element.value
        }
    });
    return sonuc
}

class strReplace{
    static getCustomer(title){
        let exp = title.split(" ")
        return `${exp[0]} ${exp[1]}`
    }

    static getMarka(Marka){
        Marka = Marka.replaceAll('SHANDONG', 'SHD')
        Marka = Marka.replaceAll('ERCİYES', 'ERC')
        Marka = Marka.replaceAll('Erciyes', 'ERC')
        Marka = Marka.replaceAll('MS ASANSÖR', 'MS')
        Marka = Marka.replaceAll('KAPTAN', 'KPT')
        Marka = Marka.replaceAll('DRAKO', 'DRK')
        Marka = Marka.replaceAll('KISWIRE', 'KSW')
        Marka = Marka.replaceAll('KİSWİRE', 'KSW')
        Marka = Marka.replaceAll('GÖVER', 'GVR')
        Marka = Marka.replaceAll('KÖŞKER', 'KŞKR')
        Marka = Marka.replaceAll('Köşkerler', 'KŞKR')
        Marka = Marka.replaceAll('ARAS KALIP', 'ARAS')
        Marka = Marka.replaceAll('VAN BEEST', 'VANB')
        return Marka
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
        name = name.replaceAll(' Van Beest', '')
        name = name.replaceAll('SHANDONG', 'SHD')
        return name
    }
}