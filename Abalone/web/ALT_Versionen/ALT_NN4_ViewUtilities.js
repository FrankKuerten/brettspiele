function zeigeSpielstand(spielstand) {

	ausWeiss = 0;
	ausSchwarz = 0;
	ausgewaehlt = new Array();
	var x = 0;
	var y = 0;
	var z = 0;
	var offset = 0;

	for (var i=0, offset=0; i<maxKugel; i++, offset += 3) {
		x = parseInt(spielstand.substr(offset,1));
		y = parseInt(spielstand.substr(offset+1,1));
		z = parseInt(spielstand.substr(offset+2,1));

		kugel[i].positioniere(x, y, z);
		kugel[i].zeigeAn();
	}

	pruefeEnde();

	// Der aktuelle Spielstand

	var formular = (document.layers)
		? document.Spieler.document.Standform
		: document.Standform;

	formular.nameSchwarz.value = nameSchwarz;
	formular.punkteSchwarz.value = ausWeiss;
	formular.AmZugSchwarz.value = (amZug == "s" && !istBeendet)
		? "<-"
		: "";

	formular.nameWeiss.value = nameWeiss;
	formular.punkteWeiss.value = ausSchwarz;
	formular.AmZugWeiss.value = (amZug == "w" && !istBeendet)
		? "<-"
		: "";

	for (var i=0; i<maxPfeil; i++) {
		sichtbar(pfeil[i], false);
	}
}
function sichtbar(div, istSichtbar) {

	if (document.layers) {
		div.visibility = (istSichtbar)
			? "visible"
			: "hidden";
	} else {
		div.style.visibility = (istSichtbar)
			? "visible"
			: "hidden";
	}
}

function positioniereDiv(div, pLeft, pTop) {

	if (document.layers) {
		div.left = pLeft;
		div.top = pTop;
	} else {
		div.style.left = pLeft;
		div.style.top = pTop;
	}
}
function schreibeInhalt(div, inhalt) {

	// Nur für NN4 gedacht (hoffentlich wird der bald begraben!)
	
	if (document.layers) {
		with (div.document) {
			open("text/html");
			write(inhalt);
			close();
		}
	}
}

function aendereBildgroesse(bildname, pBreite, pHoehe) {

	// Nur in W3C-Browsern möglich (IE5, NN6, Opera5, Mozilla)
	document[bildname].height = pHoehe;
	document[bildname].width = pBreite;
}

function ermittleDiv(id) {
	return (document.layers) 
		? document[id]
		: document.getElementById(id);
}

function ermittleFensterGroesse() {
	breite = (self.innerWidth) 
		? innerWidth 
		: document.body.offsetWidth;
	hoehe = (self.innerHeight) 
		? innerHeight 
		: document.body.offsetHeight;
}

function noop() {}

function ziehen(richtung) {

	// Einer der Richtungspfeile wurde gedrückt

	self.focus();			// entfernt den Focus-Rahmen im IE
	if (spieler == "w") {		// Für den weissen Spieler ist das Brett gedreht!
		richtung += (richtung > 2) ? -3 : 3;
	}

	for (var i=0; i<ausgewaehlt.length; i++) {
		if (ausgewaehlt[i] != null) {
			ausgewaehlt[i].schiebe(richtung);
			ausgewaehlt[i] = null;
		}
	}

	speichereZug();
}

function highlight(nr, high) {

	if (document.layers) {
		pfeil[nr].document["PfeilBild"+nr].src = (high) 
			? pfeilHigh[nr].src
			: pfeilNorm[nr].src;
	} else {
		document["PfeilBild"+nr].src = (high) 
			? pfeilHigh[nr].src
			: pfeilNorm[nr].src;
	}
}

function istAusserhalb(x, y, z) {
	return (x<0 || x>8 || y<0 || y>8 || z<0 || z>8);
}

function plausiPfeile() {

	for (var j=0; j<maxPfeil; j++) {

		var istSichtbar = false;

		var richtung = j;
		if (spieler == "w") {	// Für den weissen Spieler ist das Brett gedreht!
			richtung += (richtung > 2) ? -3 : 3;
		}

		if (ausgewaehlt.length == 1) {
			istSichtbar = plausiEineKugel(richtung);
		}

		if (ausgewaehlt.length > 1) {
			istSichtbar = plausiAlleKugeln(richtung);
		}

		sichtbar(pfeil[j], istSichtbar);
	}
}

function plausiEineKugel(richtung) {

	var ergebnis = false;
	for (var k=0 ; k<ausgewaehlt.length; k++) {
		if (ausgewaehlt[k] != null) {
			var nachbarn = ausgewaehlt[k].gibNachbarn(richtung, spieler);
			if (	nachbarn == "g " ||
				nachbarn == "gg " ||
				nachbarn == "ggg " ||
				nachbarn == "gga " ||
				nachbarn == "ggga " ||
				nachbarn == "gggaa " ||
				nachbarn == "gga-" ||
				nachbarn == "ggga-" ||
				nachbarn == "gggaa-") {
					ergebnis =  true;
					break;
			}
		}
	}
	return ergebnis;
}

function plausiAlleKugeln(richtung) {

	var ergebnis = true;
	for (var k=0 ; k<ausgewaehlt.length; k++) {
		if (ausgewaehlt[k] != null) {
			var nachbarn = ausgewaehlt[k].gibNachbarn(richtung, spieler);
			if (nachbarn != "g ") {
				ergebnis = false;
				break;
			}
		}
	}
	return ergebnis;
}

function pruefeEnde() {
	if (ausSchwarz >= 6) {
		window.status = "Herzlichen Glückwunsch, " + nameWeiss;
		istBeendet = true;
	}

	if (ausWeiss >= 6) {
		window.status = "Herzlichen Glückwunsch, " + nameSchwarz;
		istBeendet = true;
	}
}

function konvertiereHTML(text) {

	var ergebnis = text;

	ergebnis = ergebnis.replace(/&/g,"&amp;");
	ergebnis = ergebnis.replace(/</g,"&lt;");
	ergebnis = ergebnis.replace(/>/g,"&gt;");
	ergebnis = ergebnis.replace(/\"/g,"&quot;");
	ergebnis = ergebnis.replace(/ä/g,"&auml;");
	ergebnis = ergebnis.replace(/ö/g,"&ouml;");
	ergebnis = ergebnis.replace(/ü/g,"&uuml;");
	ergebnis = ergebnis.replace(/Ä/g,"&Auml;");
	ergebnis = ergebnis.replace(/Ö/g,"&Ouml;");
	ergebnis = ergebnis.replace(/Ü/g,"&Uuml;");
	ergebnis = ergebnis.replace(/ß/g,"&szlig;");
	return ergebnis;
}

function fehlerFalle() {

	var tfeld = null;
	// Fange ich ihn hiermit? (Yo, hab' ihn erlegt!)
	for (var t=0; t<maxKugel; t++) {
		tfeld = kugel[t].feld;
		if (tfeld != null && tfeld.kugel != kugel[t]) {
			alert("Ups, Kugel fehlt " + t + " " + tfeld.kugel);
		}
	}
}