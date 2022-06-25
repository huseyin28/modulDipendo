let url = '';
let pageTitle = $('title').html();

let sCount = null;
var audio = new Audio('/public/sound.mp3');

let daterangepickerOptions = {
    opens: 'left',
    "locale": {
        "format": "DD.MM.YYYY",
        "separator": " - ",
        "applyLabel": "Uygula",
        "cancelLabel": "Vazgeç",
        "fromLabel": "Dan",
        "toLabel": "a",
        "customRangeLabel": "Seç",
        "daysOfWeek": [
            "Pz",
            "Pt",
            "Sl",
            "Çr",
            "Pr",
            "Cm",
            "Ct"

        ],
        "monthNames": [
            "Ocak",
            "Şubat",
            "Mart",
            "Nisan",
            "Mayıs",
            "Haziran",
            "Temmuz",
            "Ağustos",
            "Eylül",
            "Ekim",
            "Kasım",
            "Aralık"
        ],
        "firstDay": 1
    }
}
let myInterval = null
let searchInterval = null

let queryParams = {
    search: "",
    offset: 0,
    limit: 1000000,
    startTime: new Date(),
    endTime: new Date()
}


$(document).ready(ready)

function ready() {
    $('#txtSearch').off('keyup').on('keyup',(e)=>{
        if(searchInterval != null)
            clearInterval(searchInterval)
        
        searchInterval = setTimeout(function(val){
            queryParams.search = val
            setURL()
        },500, e.target.value)    
    })
    
    const searchParams = new URLSearchParams(location.search);

    if (searchParams.has('limit')) queryParams.limit = searchParams.get('limit')
    if (searchParams.has('search')) {
        queryParams.search = searchParams.get('search')
        $('#txtSearch').val(queryParams.search)
    }
    if (searchParams.has('offset')) queryParams.offset = searchParams.get('offset')

    if (searchParams.has('startTime')) {
        queryParams.startTime = new Date(searchParams.get('startTime').split('T')[0])
    }

    if (searchParams.has('endTime')) {
        queryParams.endTime = new Date(searchParams.get('endTime').split('T')[0])
    }

    daterangepickerOptions.startDate = queryParams.startTime
    daterangepickerOptions.endDate = queryParams.endTime

    $('input[name="daterange"]').daterangepicker(daterangepickerOptions, eventSetDate);
    if (daterangepickerOptions.startDate == daterangepickerOptions.endDate)
        queryParams.startTime.setDate(queryParams.startTime.getDate() - 1)

    setURL()
}

function setURL() {
    url = `https://app.dipendo.com/api/sales?` + getDipendoParamsStr()

    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + getParamsStr();
    window.history.pushState({ path: newurl }, '', newurl);

    getList()

    if (myInterval != null) clearInterval(myInterval)

    myInterval = setInterval(getList, 1000 * 60)
}

function getDipendoParamsStr() {
    let ret = '';
    ret += `search=${queryParams.search}&offset=${queryParams.offset}&limit=${queryParams.limit}&`
    ret += `startTime=${queryParams.startTime.getFullYear()}-${queryParams.startTime.getMonth() + 1}-${queryParams.startTime.getDate() - 1}T21:00:00.000Z&`
    ret += `endTime=${queryParams.endTime.getFullYear()}-${queryParams.endTime.getMonth() + 1}-${queryParams.endTime.getDate()}T21:00:00.000Z`
    return ret
}
function getParamsStr() {
    let ret = `search=${queryParams.search}&offset=${queryParams.offset}&limit=${queryParams.limit}&`;
    ret += `startTime=${queryParams.startTime.getFullYear()}-${queryParams.startTime.getMonth() + 1}-${queryParams.startTime.getDate()}&`
    ret += `endTime=${queryParams.endTime.getFullYear()}-${queryParams.endTime.getMonth() + 1}-${queryParams.endTime.getDate()}`
    return ret
}

function eventSetDate(start, end) {
    queryParams.startTime = start._d
    queryParams.endTime = end._d
    setURL()
}

function getList() {
    $.ajax({
        url: url,
        headers: { "Authorization": Authorization }
    }).then(LoadList).fail(error => {
        console.warn(error)
    })
}

function LoadList(response) {
    $('#message').remove()

    $('title').html(`(${response.length}) ${pageTitle}`)


    if (sCount == null)
        sCount = response.length
    else if (sCount != response.length) {
        audio.play();
        sCount = response.length
    }

    $('#list').html('')
    response.forEach(element => {
        if (element.status == 3)
            $('#list').append(getRowHTML(element))
    });

    $('#listCount').html(response.length + ' adet sipariş bulunmuştur.')
}

function getRowHTML(element) {
    return `<tr>
    <td>${element.customer.title}</td>
    <td><a href="/detay?id=${element.id}" target="_blank" class="btn btn-sm btn-outline-primary" aria-pressed="true">Detay</a></td>
    </tr>
    `
}