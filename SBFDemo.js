
let connection = require('./controllers/DBManager')
const axios = require('axios');


let sql = "SELECT * FROM`sales` WHERE deleveryDate = '2025-05-15 00:00:00'"
let auth = 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjMxRkVDMENBMDJCNjRGMkVBNDI2ODk0MDY3MjE0NUFDNDBFMEVGMDgiLCJ4NXQiOiJNZjdBeWdLMlR5NmtKb2xBWnlGRnJFRGc3d2ciLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiI2MmIwZGJjZmVkNTAwNDU5NGNmYzIwNzkiLCJuYW1lIjoiaHVzZXlpbnlpbG1hekBjZWxzYW5jZWxpay5jb20iLCJTdG9jayI6IjEiLCJFZGl0Q3VzdG9tZXJzIjoiMSIsIlZpZXdSZXBvcnRzIjoiMSIsIlB1cmNoYXNlIjoiMSIsIkVkaXRQdXJjaGFzZXMiOiIxIiwiRWRpdFB1cmNoYXNlSXRlbXMiOiIxIiwiRWRpdFB1cmNoYXNlSXRlbXNQdXJjaGFzZUNvdW50IjoiMSIsIlNhbGUiOiIxIiwiRWRpdFNhbGVzIjoiMSIsIlZpZXdTYWxlcyI6IjEiLCJFZGl0U2FsZUl0ZW1zIjoiMSIsIkNhbGVuZGFyIjoiMSIsIkVkaXRTdXBwbGllcnMiOiIxIiwiRWRpdFByb2R1Y3RzIjoiMSIsIlRlbmFudCI6IjgxMDI2ZGEwLTEyNDgtNGQ1Yy1iNzc4LWI3ZjE2ODdjMGE5YyIsIkN1bHR1cmUiOiJ0ci1UUiIsIm9pX3Byc3QiOiJEaXBlbmRvV2ViIiwiY2xpZW50X2lkIjoiRGlwZW5kb1dlYiIsIm9pX3Rrbl9pZCI6IjY4MjYzMWQ4YzA0MGRiOTEwNjM2YWNkOSIsImF1ZCI6IkRpcGVuZG9XZWIiLCJleHAiOjE3NDk5MjU1OTIsImlzcyI6Imh0dHBzOi8vaWQuZGlwZW5kby5jb20vIiwiaWF0IjoxNzQ3MzMzNTkyfQ.HjfPJnVP6qS7mVKHb7a7Gwdv7_ZgSjAuiYrcSaGXLw6iAHloXh9CbtSe0oExHzaVHoSBKcSzWOzbKitVZZWOzaX1AeuKiV179iXghSQ_t8rvK7d2P7a8JPqwTQDN0iKDDDN65FgzRpdFWMwUlxDqozbgxwleynC_nG8cdVBw33BAhkHjhti_5GVLHCDHLd_16cUZ39Rg56eCEBY7YEPTvwB_g148M8_Exk-r0b8i-E_f5EqcUHcVNu_NyOH5K1I7p_BPZvRRXaod_fbzw7hg7w6oKZyn5stnZIgQDO3DbFDjKoZyNSM66lv2W1AK_N4ZTCsRHcv5QGWHHPFB9WVncg'

// getSales();
getSaleById(35243);

function getSales() {
    connection.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            for (let i = 0; i < results.length; i++) {
                let saleId = results[i].saleId;
                console.log(saleId);
            }
        }
    })
}


function getSaleById(saleId) {
    axios.get('https://app.dipendo.com/api/sales/' + saleId, {
        headers: {
            'Authorization': auth
        }
    }).then(function (response) {
        console.log(JSON.stringify(response.data.saleItems));
    }).catch(function (error) {
        console.log(error);
    });
}