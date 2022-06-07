let url = '';
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
    $('#list').html('')
    response.forEach(element => {
        if(element.status == 3)
            $('#list').append(getRowHTML(element))
    });
}

function getRowHTML(element) {
    return `<tr>
    <td>${element.customer.title}</td>
    <td><a href="/detay?id=${element.id}" target="_blank" class="btn btn-sm btn-outline-primary" aria-pressed="true">Detay</a></td>
    </tr>
    `
}