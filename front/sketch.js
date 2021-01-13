
let dino

let listaCactus = []

let anchoDino = 15

let altoDino = 30

let anchoCactus = 20

let segundos=-1

let segundosAnteriores=-1

let nombre

function setup() {

	vex.dialog.alert({ unsafeMessage: 
		`<h1>Como es tu nombre?</h1><br/>
		<input id="nombre" type="text"/>`,
		callback: function (data) {

			loop()

			nombre = document.getElementById("nombre").value

			console.log(nombre)
			
    	}
	})

	noLoop()

	createCanvas(window.innerWidth, window.innerHeight)

	dino = new Dinosaurio(anchoDino,window.innerHeight-(altoDino+2),anchoDino,altoDino)

}



function draw(){

	background(1, 2, 28)

	let hoy = new Date()

	let segundosReales = hoy.getSeconds()

	if(segundosAnteriores != segundosReales){
		segundos++
		segundosAnteriores=segundosReales
	}


	fill(255)
	textSize(32)
	text(segundos+" segundos", 10, 40)
	


	if(Math.random() < 0.01){

		listaCactus.push(new Cactus(window.innerWidth,window.innerHeight-anchoCactus,anchoCactus))	

	}

	for(let i=0;i<listaCactus.length;i++){

		listaCactus[i].actualizar()

		listaCactus[i].mostrar()

	}

	dino.mostrar()

	for(let i=0;i<listaCactus.length;i++){

		if(dino.colisiona(listaCactus[i])){

			gameOver()

		}

	}

}

function empezar(){

	listaCactus = []

	segundos=-1

	segundosAnteriores=-1

	dino = new Dinosaurio(anchoDino,window.innerHeight-(altoDino+2),anchoDino,altoDino)

}

function gameOver(){

	noLoop()

	vex.dialog.alert({ unsafeMessage: 
		`<h1>Game over ` + nombre + `! Tiempo: ` + segundos + ` segundos</h1>`,
		callback: function (data) {

			fetch('http://localhost:8050/?nombre=' + nombre + '&tiempo=' + segundos)
				.then(response => response.json())
				.then(data => {

					console.log(data)

					tablaTiempos = data

					tablaTiempos.sort((a, b) => parseFloat(b.mejorTiempo) - parseFloat(a.mejorTiempo))

					let mensaje = `<h1>Tabla de Tiempos:</h1>
												</br>
												<table class="table table-striped table-dark">
												  <thead>
												    <tr>
												      <th scope="col">#</th>
												      <th scope="col">Nombre</th>
												      <th scope="col">Ultimo Tiempo</th>
												      <th scope="col">Mejor Tiempo</th>
												    </tr>
												  </thead>
												  <tbody>`;


					for (let i = 0; i < tablaTiempos.length; i++) {

						mensaje = mensaje + `
												    <tr>
												      <th scope="row">` + (i + 1) + `</th>
												      <td>` + tablaTiempos[i].nombre + `</td>
												      <td>` + tablaTiempos[i].ultimoTiempo + `</td>
												      <td>` + tablaTiempos[i].mejorTiempo + `</td>
												    </tr>`
					}

					mensaje = mensaje + `</tbody></table>`

					vex.dialog.alert({

						unsafeMessage: mensaje,

						callback: function(data) {

							empezar()

							loop()

						}
					})



				})
			
		}
	})
}

function mousePressed() {

	dino.saltar()

}


function keyPressed(){

	if (key == ' '){

		dino.saltar()

	}

}


function Cactus(x,y,ancho){

	this.x = x

	this.y = y

	this.ancho = ancho

	this.actualizar = function(){

		this.x -= 4

	}

	this.mostrar = function(){

		fill(15, 150, 8)

		rect(this.x, this.y, this.ancho, this.ancho, 20)

	}


}


function Dinosaurio(x,y,ancho,alto){

	this.ancho = ancho

	this.alto = alto

	this.x = x

	this.y = y

	this.piso = y

	this.velocidad = 0

	this.enElPiso=true

	this.gravedad = 1


	this.saltar = function(){

		if(this.enElPiso){

			this.velocidad = -19

		}


	}

	this.colisiona = function(c){

		return collideRectRect(this.x, this.y, this.ancho, this.alto, c.x, c.y, c.ancho, c.ancho)

	}

	this.mostrar = function(){

		this.velocidad += this.gravedad

		this.y += this.velocidad

		if(this.y >= this.piso){

			this.y = this.piso

			this.velocidad = 0

			this.enElPiso = true

		}else{

			this.enElPiso = false

		}



		fill(255)

		rect(this.x, this.y, this.ancho, this.alto)

	}

}