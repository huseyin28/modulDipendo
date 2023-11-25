const axios = require('axios').default;
let connection = require('./controllers/DBManager')
let litelist = require('./public/data/productsLite')

let url = 'https://app.dipendo.com/api/products?groupId=896&offset=0&limit=30&groupIds=';
let reqHeaders = {
	Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkIzNzkxNUQ1QUYzMkNBM0ZBNzhDNzlERjg5NDUxRTREQkM4NzgyREYiLCJ4NXQiOiJzM2tWMWE4eXlqLW5qSG5maVVVZVRieUhndDgiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiI2MmIwZGJjZmVkNTAwNDU5NGNmYzIwNzkiLCJuYW1lIjoiaHVzZXlpbnlpbG1hekBjZWxzYW5jZWxpay5jb20iLCJTdG9jayI6IjEiLCJFZGl0VXNlcnMiOiIxIiwiVmlld0Nvc3QiOiIxIiwiRWRpdEN1c3RvbWVycyI6IjEiLCJWaWV3UmVwb3J0cyI6IjEiLCJQdXJjaGFzZSI6IjEiLCJFZGl0UHVyY2hhc2VzIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zUHVyY2hhc2VDb3VudCI6IjEiLCJTYWxlIjoiMSIsIkVkaXRTYWxlcyI6IjEiLCJWaWV3U2FsZXMiOiIxIiwiRWRpdFNhbGVJdGVtcyI6IjEiLCJDYWxlbmRhciI6IjEiLCJFZGl0U3VwcGxpZXJzIjoiMSIsIkVkaXRQcm9kdWN0cyI6IjEiLCJUZW5hbnQiOiI4MTAyNmRhMC0xMjQ4LTRkNWMtYjc3OC1iN2YxNjg3YzBhOWMiLCJDdWx0dXJlIjoidHItVFIiLCJvaV9wcnN0IjoiRGlwZW5kb1dlYiIsImNsaWVudF9pZCI6IkRpcGVuZG9XZWIiLCJvaV90a25faWQiOiI2NGI4MjhiMzE1MTY3OGMzM2I3MmQ5ZDYiLCJhdWQiOiJEaXBlbmRvV2ViIiwiZXhwIjoxNjkyMzgyNjQzLCJpc3MiOiJodHRwczovL2lkLmRpcGVuZG8uY29tLyIsImlhdCI6MTY4OTc5MDY0M30.tHWWbFrn2M29acKhwOnsL4zEwO43P1bhb7rdfRX0vElReUOPgZUY0Tdquqj_5cgh0P2FSJC0Yqy9aEHj0sUtvywqoJNB7bgXPO0GRBbyVAswMiSS_scHak6UILJUBfnZCfyRUn8eoMT7FirDVebpzCKNXgbieP2thzQUS80gSCjucHE7V7k69NqPGQErLBiDP6bHaCHPcUd-6iqkD_7R1JN3CYjFSezEetPwb1RRdmcRLAQbYS2mW6lIWe49iilQAYhEx6voFcQEt2eJNFqkcN0PA06mNYZYQt8GUzHXXDnT2cZ8WZs7plX6Upg6wzf80Gk3m9tpCZTzKWU4KmFzTQ'
}


shortNameSet();


//UPDATE products SET`shortName` = '48mm Hyfil 8 GALV', brand = 'KSW' WHERE id = (SELECT id FROM `products` WHERE`shortName` = '' ORDER BY id DESC LIMIT 1);

//SELECT * FROM`products` WHERE`shortName` = '' ORDER BY id DESC;


/*

UPDATE products SET `shortName` = 'Soket A. Kamalı 20-22mm', brand = 'GR' WHERE id= 254242;

SELECT COUNT(*) FROM `products` WHERE `shortName` = ''

*/


function shortNameSet() {
	let sqlString = '';
	Object.keys(litelist).forEach(id => {
		sqlString = `UPDATE products SET shortName='${litelist[id].name}', brand='${litelist[id].brand}' WHERE id=${id};`;
		connection.query(sqlString, function (error, results, fields) {
			if (error) throw error;
			console.log(results);
		});
	});
}

async function controlProducts() {
	const response = await axios.get("https://app.dipendo.com/api/products?offset=0&limit=99999&groupIds=", {
		headers: reqHeaders,
		cache: false
	});
	console.log('dipendo : ', response.data.length);
	connection.connect();
	connection.query(`SELECT COUNT(id) as ct FROM products`, function (error, results, fields) {
		if (error) throw error;
		console.log(results);
	});
	connection.end();

}

async function startProductsShortName() {
	connection.connect();
	Object.keys(productsLite).forEach(async index => {
		connection.query(`UPDATE products SET shortName=?, brand=? WHERE id=?`, [productsLite[index].name, productsLite[index].brand, index], function (error, results, fields) {
			if (error) throw error;
			console.log('changed ' + results.changedRows + ' rows');
		})
	})
	connection.end();
}

async function startProductsInsert() {
	const response = await axios.get("https://app.dipendo.com/api/products?offset=0&limit=99999&groupIds=", {
		headers: reqHeaders
	});
	connection.connect();
	response.data.forEach(async element => {
		connection.query(`INSERT INTO products(id, name, isActive, unitMass, unitOfMass, groupId, propertyValues, images, brand) VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				element.id,
				element.name,
				element.isActive == true ? 1 : 0,
				element.unitMass,
				element.unitOfMass,
				element.groupId,
				JSON.stringify(element.propertyValues),
				'[]',
				''
			], function (error, results, fields) {
				if (error) throw error;
				console.log(results);
			})
	})
	connection.end();
}

async function startGroupsInsert() {
	const response = await axios.get("https://app.dipendo.com/api/product-groups?offset=0&limit=10000&isActive=true", {
		headers: reqHeaders
	});
	connection.connect();
	response.data.forEach(async element => {
		connection.query(`INSERT INTO groups(id, name, unit, ordr, isActive, properties) VALUES (?, ?, ?, ?, ?, ?)`,
			[
				element.id,
				element.name,
				element.measurementUnit,
				element.order,
				element.isActive == true ? 1 : 0,
				JSON.stringify(element.properties),
			], function (error, results, fields) {
				if (error) throw error;
				console.log(results.insertId);
			})
	})
	connection.end();
}

