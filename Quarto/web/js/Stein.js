"use strict";

// Konstruktor der Klasse Stein
function Stein(f, m, h, s){
	this.form = f;
	this.material = m;
	this.hoehe = h;
	this.spitz = s;
	this.wert = f*1000 + m*100 + h*10 + s;
	this.feld = null;
	this.setFeld = setFeld;
	// radiusOben, radiusUnten, höhe, anzahlSegmenteRundum, anzahlSegmenteHoch, obenOffen, drehung
	var radU = (form[f] == 4 ? 25 : 20);
	var radO = (spitz[s] == 0 ? 0 : radU);
	var geometrie = new THREE.CylinderGeometry( radO, radU, hoehe[h], form[f], 1, false, Math.PI / 4 );
	this.mesh = new THREE.Mesh( geometrie, material[m] );
	scene.add(this.mesh);
}

function setFeld(feld){
	// Alte Verbindung zum Rand lösen
	if (this.feld != null){
		this.feld.stein = null;
	}
	// Neue Verbindung setzen
	this.feld = feld;
	feld.stein = this;
	this.mesh.position.set(feld.xAbs, hoehe[this.hoehe] / 2, feld.zAbs);
}
