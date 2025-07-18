let selectesItems = [];
let list = {};
let listAdd = {};
let bugun = new Date(Date.now());
$(document).ready(main)

function main() {
    $('#start').val(getDateString(bugun))
    $('#start').off('change').on('change', () => {
        bugun = new Date($('#start').val());
        main();
    })
    $('#btnOnay').off('click').on('click', createForm)

    $.ajax({
        url: `https://app.dipendo.com/api/sale-items?status=3&offset=0&limit=500`,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(loadList)
}

function getDateString(dt) {
    return `${dt.getFullYear()}-${("0" + (dt.getMonth() + 1)).slice(-2)}-${("0" + dt.getDate()).slice(-2)}`
}

function getDateStringDipendo(dt) {
    let dpdt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
    dpdt.setDate(dpdt.getDate() - 1)
    return `${dpdt.getFullYear()}-${("0" + (dpdt.getMonth() + 1)).slice(-2)}-${("0" + dpdt.getDate()).slice(-2)}T21:00:00`
}

async function loadList(response) {
    $('#SBF').html("");
    for (const i in response) {
        if (Object.hasOwnProperty.call(response, i)) {
            const element = response[i];
            if (element.deliveryTime == getDateStringDipendo(bugun)) {
                let product = await getProduct(element.purchaseItem.product.id, element.purchaseItem.product)
                if (product == undefined) {
                    listAdd[element.purchaseItem.product.id] = element.purchaseItem.product
                    let addButton = `<button onclick="addProduct(${element.purchaseItem.product.id})" type="button" class="btn btn-link"><i class="fa-solid fa-plus"></i></button>`
                    $('#SBF').append(`<tr id="${element.saleItemId}">
                        <td>${strReplace.getCustomer(element.customer.title)}</div> 
                        <td>${addButton}${logNonLiteName(element.purchaseItem.product)}</div>
                        <td>${element.saleCount}</div>
                        <td></div>
                        <td>${getNote(element)}</div>
                    </tr>`)
                } else {
                    $('#SBF').append(`<tr id="${element.saleItemId}">
                        <td>${strReplace.getCustomer(element.customer.title)}</div>
                        <td>${product.shortName || logNonLiteName(element.purchaseItem.product)}</div>
                        <td>${element.saleCount}</div>
                        <td>${product.brand || ''}</div>
                        <td>${getNote(element)}</div>
                    </tr>`)
                }
            }
        }
    }
    $('#SBF tr').off('click').on('click', selectItem);
}

function addProduct(id) {
    $('#modalShortName').modal('show')
    $('#modalShortName #modalShortNameBaslik').html(listAdd[id].name)
    $('#modalShortName #shortName').val(listAdd[id].name)
    $('#modalShortName #brand').val(listAdd[id].name)
    $('#modalShortName #btnOK').off('click').on('click', { product: listAdd[id] }, function (e) {
        $.ajax({
            type: 'POST',
            url: '/api/products/add',
            data: {
                id: e.data.product.id,
                groupId: e.data.product.groupId,
                isActive: 1,
                name: e.data.product.name,
                propertyValues: JSON.stringify(e.data.product.propertyValues),
                unitMass: e.data.product.unitMass,
                unitOfMass: e.data.product.unitOfMass,
                shortName: $('#modalShortName #shortName').val(),
                images: JSON.stringify([]),
                brand: $('#modalShortName #brand').val()
            },
            success: response => {
                if (response.success) {
                    main();
                    $('#modalShortName').modal('hide')
                }
            }
        })
    })
}

async function getProduct(pid, product) {
    let pr = null;
    $.ajax({
        url: `/api/products/getById/${pid}`,
        async: false
    }).done(response => { if (response.success) pr = response.data })
    return pr
}

function logNonLiteName(product) {
    return `<span class="text-danger">${product.name}</span>`;
}

function Join(vals) {
    let str = '';
    for (let i = 0; i < vals.length - 1; i++) {
        const element = vals[i];
        if (i != 0) str += ' ';
        str += element.value;
    }
    return str
}

function createForm() {
    list = {}
    selectesItems.forEach(element => {
        $.ajax({
            url: "https://app.dipendo.com/api/sale-items/" + element,
            async: false,
            headers: { "Authorization": localStorage.getItem('token') },
            success: response => {
                let kod = '';
                if (response.saleCount == response.purchaseItem.purchaseCount && response.purchaseItem.product.groupUnit == "meter") {
                    kod = `${response.customer.id}-${response.purchaseItem.product.id}`
                } else if (response.purchaseItem.product.groupUnit == "piece") // Adetli ürün 
                    kod = `${response.customer.id}-${response.purchaseItem.product.id}`;
                else if (response.purchaseItem.product.groupUnit == "meter") // halat
                    kod = `${response.customer.id}-${response.purchaseItem.purchaseItemId}`;

                if (kod in list) {
                    list[kod].saleCount += response.saleCount;
                } else {
                    list[kod] = response
                }
            }
        })
    })
    loadList(Object.values(list))
}


function getNote(element) {
    if (element.purchaseItem.product.groupUnit == 'piece') {
        return 'Verildi'
    } else {
        return ``;
    }

}

function selectItem() {
    let id = $(this).attr('id');
    const index = selectesItems.indexOf(id);
    if (index > -1) {
        selectesItems.splice(index, 1);
        $(this).removeClass('bg-success text-white')
    } else {
        $(this).addClass('bg-success text-white')
        selectesItems.push($(this).attr('id'));
    }
}

function selectAll() {
    console.log($('#SBF tr').attr('id'))
}

function getVal(vals, Name) {
    let sonuc = '';
    vals.forEach(element => {
        if (element.propertyName == Name) {
            sonuc = element.value
        }
    });
    return sonuc
}

class strReplace {
    static getCustomer(title) {
        let exp = title.split(" ")
        let str = `${exp[0]} ${exp[1]}`
        if (str.length > 10)
            str = str.slice(0, 11)
        return str
    }

    static getMarka(Marka) {
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
        Marka = Marka.replaceAll('SEVERSTAL', 'SVR')
        Marka = Marka.replaceAll('KJ CHAIN', 'KJC')
        Marka = Marka.replaceAll('Yeni Doğan', 'YD')
        Marka = Marka.replaceAll('NEMAG', 'NMG')
        return Marka
    }

    static getProduct(name) {
        name = name.replaceAll('MS ASANSÖR', 'MS')
        name = name.replaceAll('ARAS KALIP', 'ARAS')
        name = name.replaceAll('VAN BEEST', 'VANB')
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
        name = name.replaceAll('1370/1770', '')
        name = name.replaceAll('Zincir Kancası Gözlü B Tipi', 'Kanca B Gözlü')

        let dm = name.split(' ')
        dm.splice(dm.length - 1, 1)
        return dm.join(' ');
    }
}

function setYesterday() {
    bugun.setDate(bugun.getDate() - 1)
    $('#start').val(getDateString(bugun))
    bugun.setDate(bugun.getDate() + 1)
    $('#start').trigger('change')
}