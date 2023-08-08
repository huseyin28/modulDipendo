const request = require('request');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'hyy.com.tr',
    user: 'hyyaevff_huseyin',
    password: 'HuseyinEsra281',
    database: 'hyyaevff_celsan'
});

connection.connect();
connection.end();

const options = {
    url: 'https://app.dipendo.com/api/products?offset=0&limit=30000000',
    headers: {
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkIzNzkxNUQ1QUYzMkNBM0ZBNzhDNzlERjg5NDUxRTREQkM4NzgyREYiLCJ4NXQiOiJzM2tWMWE4eXlqLW5qSG5maVVVZVRieUhndDgiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiI2MmIwZGJjZmVkNTAwNDU5NGNmYzIwNzkiLCJuYW1lIjoiaHVzZXlpbnlpbG1hekBjZWxzYW5jZWxpay5jb20iLCJTdG9jayI6IjEiLCJFZGl0VXNlcnMiOiIxIiwiVmlld0Nvc3QiOiIxIiwiRWRpdEN1c3RvbWVycyI6IjEiLCJWaWV3UmVwb3J0cyI6IjEiLCJQdXJjaGFzZSI6IjEiLCJFZGl0UHVyY2hhc2VzIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zUHVyY2hhc2VDb3VudCI6IjEiLCJTYWxlIjoiMSIsIkVkaXRTYWxlcyI6IjEiLCJWaWV3U2FsZXMiOiIxIiwiRWRpdFNhbGVJdGVtcyI6IjEiLCJDYWxlbmRhciI6IjEiLCJFZGl0U3VwcGxpZXJzIjoiMSIsIkVkaXRQcm9kdWN0cyI6IjEiLCJUZW5hbnQiOiI4MTAyNmRhMC0xMjQ4LTRkNWMtYjc3OC1iN2YxNjg3YzBhOWMiLCJDdWx0dXJlIjoidHItVFIiLCJvaV9wcnN0IjoiRGlwZW5kb1dlYiIsImNsaWVudF9pZCI6IkRpcGVuZG9XZWIiLCJvaV90a25faWQiOiI2NGIwMjM5ZGVjNDc4YTQxM2JkMmUyMGIiLCJhdWQiOiJEaXBlbmRvV2ViIiwiZXhwIjoxNjkxODU3MDUzLCJpc3MiOiJodHRwczovL2lkLmRpcGVuZG8uY29tLyIsImlhdCI6MTY4OTI2NTA1M30.fMZ0V3pQczWY0KZJ279ntyUmN18WAUgjLfhTthA_xPw8lsRUHPA9gNF9WnZkPfq4yk1OU3nxBOdtAIQmgNzQvf_8EeQf4uBrPbNR2Q0yqdSpbC1C0GXpNDYgfU4ARp0OvY1bQ5M5wX4idZN50ljy3M8GQCBgNO9tLQDKpbCJcsC1q-mZ1vVSJ1WIGKGE2FUJzKeq2YZikOlBQ27GGoZK2wbUez91-_vFgNZqyOPsWC7yAqPMRRXeSEbOl-eOV6ZrhfRsx5EeyjlnmIY2VtOYrO76XRTHlti6PkWDo_-G6T5EO5xE4s20CBRHkelq1uQNCsWI4wOzo_fnRl7BV9mb-Q'
    }
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        const info = JSON.parse(body);

        console.log(info[0]);
    }
}

//request(options, callback);