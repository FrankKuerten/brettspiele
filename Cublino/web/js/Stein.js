"use strict";

// Konstruktor der Klasse Stein
function Stein(m){
	this.material = m;
	this.feld = null;
	this.setFeld = setFeld;
	// this.mesh = new THREE.Mesh(new THREE.BoxGeometry( sl, sl, sl ), m);
	this.mesh = diceBSP.toMesh( m );
	var fac = this.mesh.geometry.faces;
	var norm;
	for (var i=0; i<fac.length; i++){
		norm = fac[i].normal;
		if (norm.x == 1 && norm.y == 0 && norm.z == 0){
			fac[i].materialIndex = 0;
		}
		if (norm.x == -1 && norm.y == 0 && norm.z == 0){
			fac[i].materialIndex = 1;
		}
		if (norm.x == 0 && norm.y == 1 && norm.z == 0){
			fac[i].materialIndex = 2;
		}
		if (norm.x == 0 && norm.y == -1 && norm.z == 0){
			fac[i].materialIndex = 3;
		}
		if (norm.x == 0 && norm.y == 0 && norm.z == 1){
			fac[i].materialIndex = 4;
		}
		if (norm.x == 0 && norm.y == 0 && norm.z == -1){
			fac[i].materialIndex = 5;
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
