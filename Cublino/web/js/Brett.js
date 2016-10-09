"use strict";

// Konstruktor der Klasse Brett
function Brett(){
	// Bespielbare Felder
	this.felder = [];

	this.beendet = false;
	this.unentschieden = true;

	var istWeiss = false;
	for (var x=0; x<7; x++){
		this.felder.push([]);
		for (var z=0; z<7; z++){
			this.felder[x].push(new Feld(x, z, istWeiss));
			istWeiss = !istWeiss;
		}
	}
/*
	// Rand für Grundstellung
	this.rand = [];
	for (var i=0; i<4; i++){
		this.rand.push	(new Feld(i, -1, true, false)
				,new Feld(i, 4, true, false)
				,new Feld(4, i, true, false)
				,new Feld(-1, i, true, false));
	}

	randMesh.position.y = -5;
	scene.add(randMesh);
*/

	// STEINE
	this.steine = [];
	var mat = [];
	mat.push(getAugenMat("r"));
	mat.push(getAugenMat("b"));

	for (var f=0; f<2; f++){
		this.steine.push([]);
		for (var i=0; i<7; i++){
			this.steine[f].push(new Stein(mat[f], f));
		}
	}
	this.reset = reset;
	this.click = click;
	this.pruefe = pruefe;
	this.zeigeGewinngruppe = zeigeGewinngruppe;
	this.zeigeSchatten = zeigeSchatten;
	this.zeigeSpielstand = zeigeSpielstand;
	this.belegtesFeld = belegtesFeld;
}

function reset(){
	waehlbare = [];
	for (var f=0; f<2; f++){
		var j = f;
		if (f == 1){
			j = 6;
		}
		for (var i=0; i<7; i++){
			this.steine[f][i].setFeld(this.felder[j][i]);
			// waehlbare.push	(this.felder[j][i].mesh	,this.steine[f][i].mesh);
		}
	}
	for (var i=0; i<gewinnMarker.length; i++){
		scene.remove(gewinnMarker[i]);
		gewinnMarker[i] = null;
	}
	gewinnMarker = [];

	steinAusgewaehlt = null;
	this.beendet = false;
}

function click(objId){
	var st, f, treffer = false, erg = null;
	if (steinAusgewaehlt == null){
		for (var i=0; i<this.steine.length; i++){
			st = this.steine[i];
			if (st.mesh.id == objId && st.feld.istRand){
				treffer = true;
				erg = i;
				steinAusgewaehlt = st;
			}
		}
	} else {
		steinAusgewaehlt.mesh.rotation.y = 0.0;
		for (var i=0; i<this.felder.length; i++){
			f = this.felder[i];
			if (f.mesh.id == objId && f.stein == null){
				steinAusgewaehlt.setFeld(f);
				steinAusgewaehlt = null;
				treffer = true;
				erg = i;
				this.pruefe();
			}
		}
	}
	if (treffer){
		// angeklicktes Objekt aus Liste der waehlbaren entfernen
		for (var i=0; i<waehlbare.length; i++){
			if (waehlbare[i].id == objId){
				waehlbare.splice(i,1);
			} 
		}
		if (waehlbare.length == 0){
			this.beendet = true;
		}
	}
	return erg;
}

function zeigeSchatten(sch){
	renderer.shadowMap.enabled = sch;
	sunLight.castShadow = sch;
	for (var f=0; f<2; f++){
		for (var i=0; i<7; i++){
			this.steine[f][i].mesh.castShadow = sch;
			this.steine[f][i].mesh.receiveShadow = sch;
		}
	}
	for (var x=0; x<7; x++){
		for (var z=0; z<7; z++){
			this.felder[x][z].mesh.receiveShadow = sch;
		}
	}
	sunLight.needsUpdate = true;
	feldMatS.needsUpdate = true;
	feldMatW.needsUpdate = true;
	material[0].needsUpdate = true;
	material[1].needsUpdate = true;
}

function zeigeSpielstand(spielzuege, bisZug){
	var stein = true;
	for (var i=0; i<bisZug; i++){
		var j = spielzuege[i];
		if (stein){
			this.click(this.steine[j].mesh.id);
		} else {
			this.click(this.felder[j].mesh.id);
		}
		stein = !stein;
	}
	var formular = document.Standform;

	formular.nameSchwarz.value = nameSchwarz;
	formular.nameWeiss.value = nameWeiss;
	if (brett.beendet){
		if (brett.unentschieden){
			formular.AmZugSchwarz.value = "remis";
			formular.AmZugWeiss.value = "remis";
		} else {
			formular.AmZugSchwarz.value = (amZug == "s")?"***":"";
			formular.AmZugWeiss.value = (amZug == "w")?"***":"";
		}
	} else {
		formular.AmZugSchwarz.value = (amZug == "s")?"<-":"";
		formular.AmZugWeiss.value = (amZug == "w")?"<-":"";
	}
}

function pruefe(){
	// Der Wert eines Steins enthält je Eigenschaft 0 oder 1
	// Jede Eigenschaft belegt eine eigene Dezimalstelle
	// Ist eine Eigenschaft von 4 Steinen gleich, so ist deren Summe 0 oder 4.
	for (var i=0; i<this.pruefGruppen.length; i++){
		var s = [];
		var sum = 50000; // um Nullenunterdrückung auszutricksen
		innen: for (var j=0; j<this.pruefGruppen[i].length; j++){
			var st = this.felder[this.pruefGruppen[i][j]].stein;
			if (st == null){
				break innen;
			}
			s.push(st);
			sum += st.wert;
		}
		if (s.length == 4 && /[04]/.test(sum)){
			this.beendet = true;
			this.unentschieden = false;
			this.zeigeGewinngruppe(s);
		}
	}
}

function zeigeGewinngruppe(s){
	var gwGeo = new THREE.Geometry();
	gwGeo.vertices.push	(new THREE.Vector3( s[0].feld.xAbs, hoehe[s[0].hoehe] / 2, s[0].feld.zAbs )
				,new THREE.Vector3( s[1].feld.xAbs, hoehe[s[1].hoehe] / 2, s[1].feld.zAbs )
				,new THREE.Vector3( s[2].feld.xAbs, hoehe[s[2].hoehe] / 2, s[2].feld.zAbs )
				,new THREE.Vector3( s[3].feld.xAbs, hoehe[s[3].hoehe] / 2, s[3].feld.zAbs ));
	var gwl = new THREE.Line(gwGeo, gwMat);
	gewinnMarker.push(gwl);
	scene.add(gwl);
}

// Zeigt die Maus auf ein belegtes Feld (auch Rand)?
function belegtesFeld(x, z){
	for (var i=0; i<this.felder.length; i++){
		if (this.felder[i].stein != null &&
			this.felder[i].istInFeld(x, z)){
			return true;
		}
		if (this.rand[i].stein != null &&
			this.rand[i].stein != steinAusgewaehlt &&
			this.rand[i].istInFeld(x, z)){
			return true;
		}
	}
	return false;
}
