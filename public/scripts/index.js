let url = '';
let pageTitle = $('title').html();
let sCount = null;
var audio = new Audio('/public/sound.mp3');

$(document).ready(ready)

function ready(){
    setURL()
}

function setURL(){
    let today = new Date()
    let yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

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
    }).then(LoadList).fail(error => {
      console.warn(error)
    })
}

function LoadList(response){
    $('#message').remove()
    $('#list').html('')
    $('title').html(`(${response.length}) ${pageTitle}`)

    if(sCount == null)
        sCount = response.length
    else if (sCount != response.length){
        audio.play();
        sCount = response.length
    }

    if(response.length == 0){
        $('.container').prepend(`<div class="alert alert-dark" id="message" role="alert">Sipariş bulunamadı</div>`)
    }else{
        response.forEach(element => {
            if(element.status == 3)
                $('#list').append(getRowHTML(element))
        });
    }
}

function getRowHTML(element) {
    return `<tr>
    <td>${element.customer.title}</td>
    <td><a href="/detay?id=${element.id}" target="_blank" class="btn btn-sm btn-outline-primary" aria-pressed="true">Detay</a></td>
    </tr>
    `
}