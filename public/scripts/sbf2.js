let bugun, addList = {}, list = {};;

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('date')) {
    bugun = new Date(urlParams.get('date'));
} else {
    bugun = new Date(Date.now());
    urlParams.set('date', getDateString(bugun));
    window.history.replaceState({}, '', `${location.pathname}?${urlParams}`);
}
let selectedItems = [];
let saleItems = [];
$(document).ready(main)

function main() {
    $('#start').val(getDateString(bugun))
    $('#start').off('change').on('change', () => {
        bugun = new Date($('#start').val());
        urlParams.set('date', getDateString(bugun));
        window.history.replaceState({}, '', `${location.pathname}?${urlParams}`);
        main();
    })
    $('#btnOnay').off('click').on('click', createForm)
    init(bugun)
}

function init(dt) {
    $('#SBF').html("");
    saleItems = [];
    $.ajax({
        url: `/api/sales/getSevkList/${getDateString(dt)}`,
    }).then(response => {
        for (const i in response.data) {
            getSaleById(response.data[i].saleId);
        }
    })
}

function getSaleById(saleId) {
    $.ajax({
        url: `https://app.dipendo.com/api/sales/${saleId}`,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(response => {
        for (const i in response.saleItems) {
            response.saleItems[i].customer = response.customer;
            saleItems.push(response.saleItems[i])
            writeSaleItem(response.saleItems[i])
        }
    })
}

async function writeSaleItem(item) {
    let shortProduct = await getShortProduct(item.purchaseItem.product);
    if (shortProduct == null)
        addList[item.purchaseItem.product.productId] = item.purchaseItem.product;

    $('#SBF').append(`<tr id="${item.saleItemId}" ${shortProduct == null ? 'class="no-select"' : ''}>
        <td>${getCustomerName(item.customer.title)}</td> 
        <td>${shortProduct != null ? shortProduct.shortName : item.purchaseItem.product.name}</td>
        <td>${item.saleCount}</td>
        <td>${shortProduct != null ? shortProduct.brand : getButtonAddProduct(item.purchaseItem.product)}</td>
        <td>${getNot(item)}</td>
    </tr>`);
    $('#SBF tr:not(.no-select)').off('click').on('click', selectItem);
}

function getNot(saleItem) {
    if (Object.keys(list).length != 0) {
        if (units[saleItem.purchaseItem.product.productGroupId] == "adet" || units[saleItem.purchaseItem.product.productGroupId] == "kg") {
            return `Verildi`;
        } else if (units[saleItem.purchaseItem.product.productGroupId] == "m") {
            return ``;
        }
    } else {
        return ``;
    }
}

async function getShortProduct(product) {
    let p = null;
    $.ajax({
        url: `/api/products/getById/${product.productId}`,
        async: false,
        success: function (response) {
            if (response.success) {
                p = response.data || null;
            }
        }
    })
    return p;
}

function selectItem() {
    let id = $(this).attr('id');

    if (selectedItems.includes(id)) {
        selectedItems = selectedItems.filter(item => item !== id);
        $(this).removeClass('bg-success text-white');
    } else {
        selectedItems.push(id);
        $(this).addClass('bg-success text-white');
    }
}

function createForm() {
    if (selectedItems.length == 0) {
        alert('Lütfen en az bir ürün seçiniz');
        return;
    }
    selectedItems = selectedItems.map(id => saleItems.find(element => String(element.saleItemId) === id)).filter(Boolean);
    mergeItems()
}

async function mergeItems() {
    selectedItems.forEach(await function (element) {
        let kod = '';
        if (element.saleCount == element.purchaseItem.purchaseCount && units[element.purchaseItem.product.productGroupId] == "m") {
            kod = `${element.customer.customerId}-${element.purchaseItem.product.productId}`
        } else if (units[element.purchaseItem.product.productGroupId] == "adet" || units[element.purchaseItem.product.productGroupId] == "kg") {
            kod = `${element.customer.customerId}-${element.purchaseItem.product.productId}`;
        } else if (units[element.purchaseItem.product.productGroupId] == "m") {
            kod = `${element.customer.customerId}-${element.purchaseItem.purchaseItemId}`;
        }

        if (kod in list) {
            list[kod].saleCount += element.saleCount;
        } else {
            list[kod] = element
        }
    })
    $('#SBF').html('');

    console.log(selectedItems);
    console.log(list);
    console.log(Object.keys(list));


    Object.values(list).forEach(await writeSaleItem);
}

function getButtonAddProduct(p) {
    return `<button class="btn btn-primary btn-sm px-3 m-0 py-1" onclick="addProductModal('${p.productId}', '${p.name}')"> + </button>`;
}

function addProductModal(productId, productName) {
    $('#modalShortName').modal('show');
    $('#modalShortName #modalShortNameBaslik').html(productName);
    $('#modalShortName #btnOK').attr('onclick', `addProduct(${productId})`);
}

function addProduct(pId) {
    let shortName = $('#modalShortName #shortName').val().trim();
    let brand = $('#modalShortName #brand').val().trim();

    $.ajax({
        type: 'POST',
        url: '/api/products/add',
        data: {
            id: pId,
            groupId: addList[pId].productGroupId,
            isActive: 1,
            name: addList[pId].name,
            propertyValues: JSON.stringify(addList[pId].productPropertyValues),
            unitMass: addList[pId].unitMass,
            unitOfMass: addList[pId].unitOfMass,
            shortName: shortName,
            images: JSON.stringify([]),
            brand: brand
        },
        success: response => {
            if (response.success) {
                location.reload();
            }
        }
    })

}

function getCustomerName(name) {
    name = name.replaceAll(' Asansör', ' As.');
    name = name.replaceAll(' Demir Çelik', ' DÇ');
    name = name.replaceAll(' Demir ve Çelik', ' DÇ');
    let customerName = name.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    let words = customerName.split(/\s+/);
    let result = words.slice(0, 2).join(' ');
    if (result.length < 7 && words.length >= 3) {
        result += ' ' + words[2];
    }
    if (result.length > 15) {
        return result.slice(0, 15);
    }
    return result;
}

function getDateString(dt) {
    return `${dt.getFullYear()}-${("0" + (dt.getMonth() + 1)).slice(-2)}-${("0" + dt.getDate()).slice(-2)}`
}

function setYesterday() {
    bugun.setDate(bugun.getDate() - 1)
    $('#start').val(getDateString(bugun))
    bugun.setDate(bugun.getDate() + 1)
    $('#start').trigger('change')
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
        Marka = Marka.replaceAll('İZMİT', 'AŞ')
        Marka = Marka.replaceAll('İzmit A.Ş.', 'AŞ')
        Marka = Marka.replaceAll('Global Rope Fittings', 'GRF')
        Marka = Marka.replaceAll('GLOBAL ROPE', 'GR')
        Marka = Marka.replaceAll('CHUNG WOO', 'CW')
        Marka = Marka.replaceAll('KÖŞKERLER', 'KŞKR')
        Marka = Marka.replaceAll('J.D.THEILE', 'JDT')
        Marka = Marka.replaceAll('AMZONE', 'AMZ')
        Marka = Marka.replaceAll('JIANGSU', 'JHS')
        Marka = Marka.replaceAll('Hamdi Küçük', 'HK')
        Marka = Marka.replaceAll('Şahinler', 'ŞHN')
        Marka = Marka.replaceAll('Van Beest', 'VANB')
        Marka = Marka.replaceAll('PEWAG', 'PWG')
        Marka = Marka.replaceAll('ŞAHİNLER', 'ŞHN')
        Marka = Marka.replaceAll('GÜL MAKİNE', 'GÜL')
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