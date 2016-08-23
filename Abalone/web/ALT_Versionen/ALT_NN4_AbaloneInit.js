// Globale Variablen ausserhalb der Functions
	breiteAlt = null;
	hoeheAlt = null;
	breite = 0;
	hoehe = 0;

// Spielfeld, Kugeln und Pfeile
	maxKugel = 28;
	maxFeld = 61;
	maxPfeil = 6;

// Preload einiger Bilder 
	feldHigh = new Image();
	feldHigh.src = "/FeldH.gif";
	feldNorm = new Image();
	feldNorm.src = "/Feld.gif";

	pfeilNorm = new Array(maxPfeil);
	pfeilHigh = new Array(maxPfeil);

	for (var i=0; i<maxPfeil; i++) {
		pfeilNorm[i] = new Image();
		pfeilNorm[i].src = "/PfeilN_"+i+".gif";
		pfeilHigh[i] = new Image();
		pfeilHigh[i].src = "/PfeilH_"+i+".gif";
	}
// SpielstandHoehe ist durch die Tabelle der Spieler und Punkte belegt
	spielstandHoehe = 60;

// Die Semaphore steuert, dass zu einer Zeit nur ein Thread 
// in der function init() läuft. Synchronized fehlt in JavaScript.
	semaphore = false;

function init() {

	ermittleFensterGroesse();
	if (semaphore || (breiteAlt == breite && hoeheAlt == hoehe)) return;

	semaphore = true;
	breiteAlt = breite;
	hoeheAlt = hoehe;

	ausgewaehlt = new Array();
	spielstand = null;
	spieler = null;
	amZug = null;
	amZugAlt = null;
	nameWeiss = null;
	nameSchwarz = null;
	kiebitz = null;
	istBeendet = false;

	// Diese Faktoren werden benötigt, um die Pfeile im Sechseck anzuordnen
	offx = new Array(1.7, 1.2, 0.5, 0, 0.5, 1.2);
	offy = new Array(2.5, 1.5, 1.5, 2.5, 3.6, 3.6);

	var ah = (hoehe - spielstandHoehe) / 15; // Seitenlänge eines Felds (von Hoehe abh.)
	var hh = ah / Math.tan(Math.PI/6);	// Hoehe eines Felds (von Hoehe abh.)
	var hb = breite / 11;			// Hoehe eines Felds (von Breite abh.)
	var ab = hb * Math.tan(Math.PI/6);	// Seitenlänge eines Felds (von Breite abh.)
	if (ah < ab) {				// je nach Verhältnis Hoehe / Breite
		a = ah;
		h = hh;
	} else {
		a = ab;
		h = hb;
	}
	d = 2 * a;				// Diagonale eines Felds
	r = 3 * a / 4				// Radius einer Kugel

	mittex = breite/2;
	mittey = (hoehe + spielstandHoehe) / 2;

	initSpielfelder();
	initSpielkugeln();
	initPfeile();

	holeSpielstand();
	semaphore = false;
}

function passeGroesseAn() {
	// Der Browser Opera kennt den Event 'onResize' nicht.
	// Zunächst wird eine zyklische Funktion gestartet, die jede halbe Sekunde
	// die aktuelle Bildschirmgrösse überprüft. Ein Browser, der 'onResize'
	// unterstützt, ruft diese Funktion auf, und setzt den Timer ausser Funktion.

	clearInterval(groesseTimer);
	init();
}

function initSpielfelder() {

	// Spielfelder Grundbelegung null
	Feld = new Array(9);
	for (var x=0; x<9; x++) {
		Feld[x] = new Array(9);
		for (var y=0; y<9; y++) {
			Feld[x][y] = new Array(9);
			for (var z=0; z<9; z++) {
				Feld[x][y][z] = null;
			}
		}
	}

	var lfdnr = 0;
	var feldImg = "<img src='/Feld.gif' name='FeldBildNummer' width='"+h+"' height='"+d+"'>";
	for (var x=0; x<9; x++) {

		var miny = (x>=4) ? 0 : 4-x;	// Grenzen für wohlgeformte Felder
		var maxy = (x<=4) ? 8 : 12-x;
		var minz = (x<=4) ? 0 : x-4;

		var z = minz;
		for (var y=miny; y<=maxy; y++) {
			var yabs = mittey - ((4 - y) * 1.5 * a);
			var xabs = mittex - ((8 - x - z) * h / 2);

			var div = ermittleDiv("Feld"+lfdnr);
			var neuesBild = feldImg.replace(/Nummer/g,lfdnr);
			if (document.layers) {
				schreibeInhalt(div, neuesBild);
			} else {
				aendereBildgroesse("FeldBild" + lfdnr, h, d);
			}

			Feld[x][y][z] = new Spielfeld(div, xabs, yabs, lfdnr);
			z++;
			lfdnr++;
		}
	}
}

function initSpielkugeln() {

	kugel = new Array(maxKugel);
	var farbe = "";
	var kugelImg = "<a href='javascript:noop()' onClick='kugel[Nummer].angeklickt();return false'>";
	var weissImg = "<img src='/ballsilber.gif'";
	var schwarzImg = "<img src='/ballschwarz.gif'";
	var kugelImgEnde = " name='KugelBildNummer' border=0 width="+2*r+" height="+2*r+"></a>";
	for (var i=0; i<maxKugel; i++) {
		var neuesBild = kugelImg;
		if (i<14) {
			neuesBild += weissImg;
			farbe = "w";
		} else {
			neuesBild += schwarzImg;
			farbe = "s";
		}
		neuesBild += kugelImgEnde;
		neuesBild = neuesBild.replace(/Nummer/g,i);

		var div = ermittleDiv("Kugel"+i);
		kugel[i] = new Kugel(div, farbe);
		if (document.layers) {
			schreibeInhalt(div, neuesBild);
		} else {
			aendereBildgroesse("KugelBild" + i, 2*r, 2*r);
		}
	}
}

function initPfeile() {

	pfeil = new Array(maxPfeil);

	var pfeilImg = "<a href='javascript:noop()' onClick='ziehen(Nummer);return false' ";
	pfeilImg += "onMouseover='highlight(Nummer, true)' onMouseout='highlight(Nummer, false)'>";
	pfeilImg += "<img src='/PfeilN_Nummer.gif' name='PfeilBildNummer' ";
	pfeilImg += "border=0 width="+a+" height="+a+"></a>";

	for (var i=0; i<maxPfeil; i++) {
		var neuesBild = pfeilImg.replace(/Nummer/g,i);

		pfeil[i] = ermittleDiv("Pfeil"+i);

		if (document.layers) {
			schreibeInhalt(pfeil[i], neuesBild);
		} else {
			aendereBildgroesse("PfeilBild" + i, a, a);
		}

		var links = h * offx[i] + a / 2;
		var oben = hoehe - a * offy[i];
		positioniereDiv(pfeil[i], links, oben);
	}
}
