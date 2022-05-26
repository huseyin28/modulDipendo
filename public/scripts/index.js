let url = ``
let Authorization = ``

$(document).ready(ready)

function ready(){
    Login();
}

function Login(){
    $.ajax({
        type : "POST",
        url : "https://app.dipendo.com/oauth/token",
        data : "username=huseyinyilmaz@celsancelik.com&password=asdasd528&grant_type=password&client_id=DipendoWeb",
    }).then(response => {
        Authorization = response.token_type+' '+response.access_token
        setURL();
    })
}

function setURL(){
    let today = new Date()
    let yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    console.log(today);

    url = `https://app.dipendo.com/api/sales?search=&offset=0&limit=100&`
    url += `startTime=${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}T21:00:00.000Z&`
    url += `endTime=${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}T20:59:59.999Z`

    getList()
    setInterval(getList, 1000*60)
}

function getList(){
    $.ajax({
        url : url, 
        headers: {"Authorization": Authorization}
    }).then(function (response){
        $('#list').html('')
        response.forEach(element => {
            if(element.status == 3)
                $('#list').append(getRowHTML(element))
        });
    })
}

function getRowHTML(element) {
    return `<tr>
    <td>${element.customer.title}</td>
    <td><a href="/detay?id=${element.id}" target="_blank" class="btn btn-sm btn-outline-primary" aria-pressed="true">Detay</a></td>
    </tr>
    `
}