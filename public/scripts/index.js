let url = '';
let pageTitle = $('title').html();

let sCount = null;
var audio = new Audio('/public/sounds/s1.wav');

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
    $('#txtSearch').off('keyup').on('keyup', (e) => {
        if (searchInterval != null)
            clearInterval(searchInterval)

        searchInterval = setTimeout(function (val) {
            queryParams.search = val
            setURL()
        }, 500, e.target.value)
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

    myInterval = setInterval(getList, 1000 * 60, true)
}

function getDipendoParamsStr() {
    queryParams.startTime.setDate(queryParams.startTime.getDate() - 1)
    let ret = '';
    ret += `search=${queryParams.search}&offset=${queryParams.offset}&limit=${queryParams.limit}&status=3&`
    ret += `startTime=${queryParams.startTime.getFullYear()}-${queryParams.startTime.getMonth() + 1}-${queryParams.startTime.getDate()}T21:00:00.000Z&`
    ret += `endTime=${queryParams.endTime.getFullYear()}-${queryParams.endTime.getMonth() + 1}-${queryParams.endTime.getDate()}T21:00:00.000Z`
    queryParams.startTime.setDate(queryParams.startTime.getDate() + 1)
    return ret
}
function getParamsStr() {
    let ret = `search=${queryParams.search}&offset=${queryParams.offset}&limit=${queryParams.limit}&status=3&`;
    ret += `startTime=${queryParams.startTime.getFullYear()}-${queryParams.startTime.getMonth() + 1}-${queryParams.startTime.getDate()}&`
    ret += `endTime=${queryParams.endTime.getFullYear()}-${queryParams.endTime.getMonth() + 1}-${queryParams.endTime.getDate()}`
    return ret
}

function eventSetDate(start, end) {
    queryParams.startTime = start._d
    queryParams.endTime = end._d
    setURL()
}

function getList(sound = false) {
    $.ajax({
        url: url,
        headers: { "Authorization": localStorage.getItem('token') }
    }).then(response => LoadList(response, sound)).fail(error => {
        if (error.status == 401) {
            if(Login()){
                getList(sound)
            }
        } else if (window.navigator.onLine == false) {
            setAlert('İnternet bağlantısını kontrol ediniz')
        }
    })
}

function LoadList(response, sound) {
    let count = 0;
    $('#message').remove()

    if (sCount == null)
        sCount = response.length
    else if (sCount != response.length) {
        if (sound)
            audio.play();
        sCount = response.length
    }

    $('#list').html('')
    response.forEach(element => {
        $('#list').append(getRowHTML(element))
        count++;
    });

    $('title').html(`(${count}) ${pageTitle}`)

    $('#listCount').html(response.length + ' adet sipariş bulunmuştur.')
}

function getRowHTML(element) {
    let dt = new Date(element.deliveryTime)
    dt.setDate(dt.getDate() + 1)
    let create = new Date(element.recordTime)
    return `<tr>
    <td>${element.customer.title}</td>
    <td>${create.getDate()}.${create.getMonth() + 1}.${create.getFullYear()} ${create.getHours() + 3}:${create.getMinutes()}</td>
    <td>${dt.getDate()}.${dt.getMonth() + 1}.${dt.getFullYear()}</td>
    <td class="py-1"><a href="/detay?id=${element.id}" target="_blank" class="btn btn-sm btn-outline-primary" aria-pressed="true">Detay</a></td>
    </tr>
    `
}