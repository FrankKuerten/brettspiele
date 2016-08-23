function Spielfeld(div, x, y, lfdnr) {

	// Konstruktor der Klasse Spielfeld

	this.div = div;
	this.x = x;
	this.y = y;
	this.lfdnr = lfdnr;
	this.kugel = null;		// 0..1 Assoziaton zum Kugelobjekt

	// Instanzmethoden
	this.waehleAus = waehleFeldAus;
	this.waehleAb = waehleFeldAb;
	this.highlight = highlightFeld;
	this.zeigeAn = zeigeFeldAn;

    this.zeigeAn();
	return this;
}

function waehleFeldAus() {

	this.highlight(true);
}

function waehleFeldAb() {

	this.highlight(false);
}

function highlightFeld(high) {

	var name = "FeldBild" + this.lfdnr;
	document[name].src = (high) 
		? feldHigh.src
		: feldNorm.src
}
function zeigeFeldAn(){
	if (this.div == null) return;

	positioniereDiv(this.div, this.x - h / 2, this.y - a);
	sichtbar(this.div, true);
	this.waehleAb();
}
