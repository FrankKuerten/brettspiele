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

	if (div == null) return this;

	positioniereDiv(div, x - h / 2, y - a);
	sichtbar(div, true);
	this.highlight(false);
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
	if (document.layers) {
		this.div.document[name].src = (high) 
			? feldHigh.src
			: feldNorm.src
	} else {
		document[name].src = (high) 
			? feldHigh.src
			: feldNorm.src
	}
}