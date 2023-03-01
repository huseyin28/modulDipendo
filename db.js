const axios = require('axios').default;
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')


let dbOptions = {
	filename: 'db.db',
	driver: sqlite3.cached.Database
};
let url = 'https://app.dipendo.com/api/products?groupId=896&offset=0&limit=30&groupIds=';
let reqHeaders = {
	Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkIzNzkxNUQ1QUYzMkNBM0ZBNzhDNzlERjg5NDUxRTREQkM4NzgyREYiLCJ4NXQiOiJzM2tWMWE4eXlqLW5qSG5maVVVZVRieUhndDgiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiI2MmIwZGJjZmVkNTAwNDU5NGNmYzIwNzkiLCJuYW1lIjoiaHVzZXlpbnlpbG1hekBjZWxzYW5jZWxpay5jb20iLCJTdG9jayI6IjEiLCJFZGl0VXNlcnMiOiIxIiwiVmlld0Nvc3QiOiIxIiwiRWRpdEN1c3RvbWVycyI6IjEiLCJWaWV3UmVwb3J0cyI6IjEiLCJQdXJjaGFzZSI6IjEiLCJFZGl0UHVyY2hhc2VzIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zIjoiMSIsIkVkaXRQdXJjaGFzZUl0ZW1zUHVyY2hhc2VDb3VudCI6IjEiLCJTYWxlIjoiMSIsIkVkaXRTYWxlcyI6IjEiLCJWaWV3U2FsZXMiOiIxIiwiRWRpdFNhbGVJdGVtcyI6IjEiLCJDYWxlbmRhciI6IjEiLCJFZGl0U3VwcGxpZXJzIjoiMSIsIkVkaXRQcm9kdWN0cyI6IjEiLCJUZW5hbnQiOiI4MTAyNmRhMC0xMjQ4LTRkNWMtYjc3OC1iN2YxNjg3YzBhOWMiLCJDdWx0dXJlIjoidHItVFIiLCJvaV9wcnN0IjoiRGlwZW5kb1dlYiIsImNsaWVudF9pZCI6IkRpcGVuZG9XZWIiLCJvaV90a25faWQiOiI2M2RmZmRmMTY1MTExMTRhZWY0ZGI0MGIiLCJhdWQiOiJEaXBlbmRvV2ViIiwiZXhwIjoxNjc4MjE1OTIxLCJpc3MiOiJodHRwczovL2lkLmRpcGVuZG8uY29tLyIsImlhdCI6MTY3NTYyMzkyMX0.Z-MtFF6NKwAohauf1JN6GKPWqHeW6KrJ4yP_tbKs7tJonkmGkdIRrTtgKWgxc6NnHyAkaC6TlBwrmBNsb26PnzXMBYBX9ZR2TVQZ8sP_dblOxiNASHj3wcspjEKYNbDCEOzFUfTQ4iJgRRYu_KDS4Ib787sNidzHgJBhRyzruz8Ehn46YhWtI3e1-8X41pEvYcQ3pB0bcusDEOFw-_eRnp17N9VCy94LEU9Sd-K8C-3-uHZfdS6Gp7vdT_DvApj1aNh39O_MpRwuquh0hMnwWT9obZK8kTFKFcBs8p0JIh9Ol833bpVU7onIZBwfS3My0C_sQASOpzOtygkq3KwMYA'
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
		cache : false
	});
	const result = await db.get(`SELECT COUNT(id) as ct FROM products`);

	console.log(response.data.length);
	console.log(result);
}

async function startProductsShortName(db){
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
				':unitMass' : element.unitMass,
				':unitOfMass' : element.unitOfMass,
				':groupId' : element.groupId,
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

