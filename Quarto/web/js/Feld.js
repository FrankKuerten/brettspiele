"use strict";

// Konstruktor der Klasse Feld
function Feld(x, z, istRand, istWeiss){
	this.x = x;
	this.z = z;
	this.istRand = istRand;
	this.stein = null;
	this.abs = abs;
	this.xAbs = this.abs(x);
	this.zAbs = this.abs(z);
	this.mesh = null;
	if (!istRand){
		this.mesh = new THREE.Mesh(feldGeo, (istWeiss ? feldMatW : feldMatS));
		this.mesh.position.set(this.xAbs, -5, this.zAbs);
		scene.add(this.mesh);
	}
}

function abs(coord){
	return coord*75-113;
}
