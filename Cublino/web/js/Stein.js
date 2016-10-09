"use strict";

// Konstruktor der Klasse Stein
function Stein(m, farbe){
	this.material = m;
	this.feld = null;
	this.setFeld = setFeld;
	// this.mesh = new THREE.Mesh(new THREE.BoxGeometry( sl, sl, sl ), m);
	this.mesh = diceBSP.toMesh( m );
	var fac = this.mesh.geometry.faces;
	var norm;
	var farb3, farb4, farb5, farb2;
	if (farbe == 0){
		farb4 = 3;
		farb3 = 2;
		farb5 = 4;
		farb2 = 1;
	} else {
		farb4 = 2;
		farb3 = 3;
		farb5 = 1;
		farb2 = 4;
	}
	for (var i=0; i<fac.length; i++){
		norm = fac[i].normal;
		if (norm.x == 1 && norm.y == 0 && norm.z == 0){
			fac[i].materialIndex = farb4;
		}
		if (norm.x == -1 && norm.y == 0 && norm.z == 0){
			fac[i].materialIndex = farb3;
		}
		if (norm.x == 0 && norm.y == 1 && norm.z == 0){
			fac[i].materialIndex = 5;
		}
		if (norm.x == 0 && norm.y == -1 && norm.z == 0){
			fac[i].materialIndex = 0;
		}
		if (norm.x == 0 && norm.y == 0 && norm.z == 1){
			fac[i].materialIndex = farb5;
		}
		if (norm.x == 0 && norm.y == 0 && norm.z == -1){
			fac[i].materialIndex = farb2;
		}
	}
	scene.add(this.mesh);
}

function setFeld(feld){
	// Alte Verbindung lösen
	if (this.feld != null){
		this.feld.stein = null;
	}
	// Neue Verbindung setzen
	this.feld = feld;
	feld.stein = this;
	this.mesh.position.set(feld.xAbs, 30, feld.zAbs);
}
