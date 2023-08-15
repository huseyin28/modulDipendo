const axios = require('axios').default;
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')


let dbOptions = {
	filename: 'db.db',
	driver: sqlite3.cached.Database
};
let url = 'https://app.dipendo.com/api/products?groupId=896&offset=0&limit=30&groupIds=';
let reqHeaders = {
	Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkIzNzkxNUQ1QUYzMkNBM0ZBNzhDNzlERjg5NDUxRTREQkM4NzgyREYiLCJ4NXQiOiJzM2tWMWE4eXlqLW5qSG5maVVVZVRieUhndDgiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiI2MmIwZGJjZmVkNTAwNDU5NGNmYzIwNzkiLCJuYW1lIjoiaHVzZXlpbnlpbG1hekBjZWxzYW5jZWxpay5jb20iLCJTdG9jayI6IjEiLCJFZGl0VXNlcnMiOiIxIiwiVmlld0Nvc3QiOiIxIiwiRWRpdEN1c3RvbWVycyI6IjEiLCJWaWV3UmVwb3J0cyI6IjEiLCJQdXJjaGFzZSI6IjEiLCJFZGl0UHVyY2hhc2VzIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zUHVyY2hhc2VDb3VudCI6IjEiLCJTYWxlIjoiMSIsIkVkaXRTYWxlcyI6IjEiLCJWaWV3U2FsZXMiOiIxIiwiRWRpdFNhbGVJdGVtcyI6IjEiLCJDYWxlbmRhciI6IjEiLCJFZGl0U3VwcGxpZXJzIjoiMSIsIkVkaXRQcm9kdWN0cyI6IjEiLCJUZW5hbnQiOiI4MTAyNmRhMC0xMjQ4LTRkNWMtYjc3OC1iN2YxNjg3YzBhOWMiLCJDdWx0dXJlIjoidHItVFIiLCJvaV9wcnN0IjoiRGlwZW5kb1dlYiIsImNsaWVudF9pZCI6IkRpcGVuZG9XZWIiLCJvaV90a25faWQiOiI2NGI4MjhiMzE1MTY3OGMzM2I3MmQ5ZDYiLCJhdWQiOiJEaXBlbmRvV2ViIiwiZXhwIjoxNjkyMzgyNjQzLCJpc3MiOiJodHRwczovL2lkLmRpcGVuZG8uY29tLyIsImlhdCI6MTY4OTc5MDY0M30.tHWWbFrn2M29acKhwOnsL4zEwO43P1bhb7rdfRX0vElReUOPgZUY0Tdquqj_5cgh0P2FSJC0Yqy9aEHj0sUtvywqoJNB7bgXPO0GRBbyVAswMiSS_scHak6UILJUBfnZCfyRUn8eoMT7FirDVebpzCKNXgbieP2thzQUS80gSCjucHE7V7k69NqPGQErLBiDP6bHaCHPcUd-6iqkD_7R1JN3CYjFSezEetPwb1RRdmcRLAQbYS2mW6lIWe49iilQAYhEx6voFcQEt2eJNFqkcN0PA06mNYZYQt8GUzHXXDnT2cZ8WZs7plX6Upg6wzf80Gk3m9tpCZTzKWU4KmFzTQ'
}

init();

async function init() {
	const db = await open(dbOptions);
	controlProducts(db);
	//startProductsShortName(db)
}

async function controlProducts(db) {
	const response = await axios.get("https://app.dipendo.com/api/products?offset=0&limit=99999&groupIds=", {
		headers: reqHeaders,
		cache: false
	});
	const result = await db.get(`SELECT COUNT(id) as ct FROM products`);

	console.log(response.data.length);
	console.log(result);
}

async function startProductsShortName(db) {
	Object.keys(someObject).forEach(async index => {
		console.log(await db.run(`UPDATE products SET shortName='${someObject[index].name}', brand='${someObject[index].brand}' WHERE id=${index};`))
	})
}

async function startProductsInsert(db) {
	try {
		const response = await axios.get("https://app.dipendo.com/api/products?offset=0&limit=99999&groupIds=", {
			headers: reqHeaders
		});
		response.data.forEach(async element => {
			const result = await db.run(`INSERT INTO products(id, name, isActive, unitMass, unitOfMass, groupId, propertyValues) VALUES 
			(:id, :name, :isActive, :unitMass, :unitOfMass, :groupId, :propertyValues)`, {
				':id': element.id,
				':name': element.name,
				':isActive': element.isActive == true ? 1 : 0,
				':unitMass': element.unitMass,
				':unitOfMass': element.unitOfMass,
				':groupId': element.groupId,
				':propertyValues': JSON.stringify(element.propertyValues),
			})
			console.log(result);
		});
	} catch (error) {
		console.error(error);
	}
}

async function startGroupsInsert(db) {
	try {
		const response = await axios.get("https://app.dipendo.com/api/product-groups?offset=0&limit=10000&isActive=true", {
			headers: reqHeaders
		});
		response.data.forEach(async element => {
			const result = await db.run('INSERT INTO groups(id, name, measurementUnit, "order", isActive, properties) VALUES (:id, :name, :unit, :order, :isActive, :properties)', {
				':id': element.id,
				':name': element.name,
				':unit': element.measurementUnit,
				':order': element.order,
				':isActive': element.isActive == true ? 1 : 0,
				':properties': JSON.stringify(element.properties),
			})
			console.log(result);
		});
	} catch (error) {
		console.error(error);
	}
}

