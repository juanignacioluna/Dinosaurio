var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient

const fetch = require("node-fetch");


router.get('/', function(req, res, next) {

	let nombre = req.query.nombre

	let tiempo = parseInt(req.query.tiempo)

	let connectionString = 'mongodb+srv://luna:messi@cluster0.hqnpi.mongodb.net/dinosauriodb?retryWrites=true&w=majority'

	MongoClient.connect(connectionString, { useUnifiedTopology: true })
	.then(client => {
		console.log('Connected to Database')
		const db = client.db('dinosauriodb')
		const coleccion = db.collection('jugadores')

		const cursor = coleccion.find({ nombre: nombre }).toArray()
		.then(results => {

			console.log(results)

			if(results.length == 0){

				coleccion.insertOne({ nombre: nombre, ultimoTiempo: tiempo, mejorTiempo: tiempo })
				.then(result => {

					coleccion.find().toArray()
					.then(results2 => {

						res.send(results2)

					})

				})
				.catch(error => console.error(error))

			}else{

				let mejorTiempo

				if(tiempo>parseInt(results[0].mejorTiempo)){
					mejorTiempo=tiempo
				}else{
					mejorTiempo=parseInt(results[0].mejorTiempo)
				}

				coleccion.findOneAndUpdate(
					{ nombre: nombre },
					{
						$set: {
							ultimoTiempo: tiempo,
							mejorTiempo: mejorTiempo
						}
					}
				)
				.then(result => {

					coleccion.find().toArray()
					.then(results2 => {

						res.send(results2)

					})

				})
				.catch(error => console.error(error))

			}

		})

	})
	.catch(error => console.error(error))



});

module.exports = router;
