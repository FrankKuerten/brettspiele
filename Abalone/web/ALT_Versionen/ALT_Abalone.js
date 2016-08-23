function init() {

	// Spielfeld, Kugeln und Pfeile
	// Die DIVs der Bildelemente werden vom Server erzeugt
	maxKugel = 28;
	maxFeld = 61;
	maxPfeil = 6;
	ausgewaehlt = new Array();
	anzAusgewaehlt = 0;
	spielstand = null;
	spieler = null;
	amZug = null;
	amZugAlt = null;
	kiebitz = null;

	// Diese Faktoren werden benötigt, um Pfeile und 
	// ausgespielte Kugeln im Sechseck anzuordnen
	offx = new Array(1.7, 1.2, 0.5, 0, 0.5, 1.2);
	offy = new Array(2.5, 1.5, 1.5, 2.5, 3.6, 3.6);

	ermittleFensterGroesse();

	a = hoehe / 15; 			// Seitenlänge eines Felds
	h = a / Math.tan(Math.PI/6);		// Hoehe eines Felds
	d = 2 * a;				// Diagonale eines Felds
	r = 3 * a / 4				// Radius einer Kugel

	mittex = breite/2;
	mittey = hoehe/2;

	initSpielfelder();
	initSpielkugeln();
	initPfeile();

	holeSpielstand();
}

function holeSpielstand() {

	// Die Daten werden vom Server geliefert (target = Kommunikation)

	clearTimeout(kiebitz);
	document.HoleStand.submit();

/*	spielstand = "400501602703804310411512613714815422523624";
	spielstand += "264365466073174275376477578084185286387488";
	spieler = "w";
	amZug = "w";
*/

}

function spielstandGeladen() {

	// Dies ist die Callback-Funktion des Frames 'Kommunikation'.

	formular = top.Kommunikation.document.AktuellerStand;

	spielstand = formular.stand.value;
	spieler = formular.spielfarbe.value;
	amZug = formular.amZug.value;

	if (amZug != amZugAlt) {
		zeigeSpielstand(spielstand);
		amZugAlt = amZug;
	}
	if (amZug != spieler) {
		kiebitz = setTimeout("holeSpielstand()", 3000);
	}
}

function zeigeSpielstand(spielstand) {

	ausWeiss = 0;
	ausSchwarz = 0;

	for (i=0, offset=0; i<maxKugel; i++, offset += 3) {
		x = parseInt(spielstand.substr(offset,1));
		y = parseInt(spielstand.substr(offset+1,1));
		z = parseInt(spielstand.substr(offset+2,1));

		kugel[i].positioniere(x, y, z);
		kugel[i].zeigeAn();
//		pruefeEnde();
	}
}

function Spielfeld(div, x, y) {

	// Konstruktor der Klasse Spielfeld

	this.div = div;
	this.x = x;
	this.y = y;
	this.kugel = null;		// 0..1 Assoziaton zum Kugelobjekt

	// Instanzmethoden
	this.waehleAus = waehleAus;
	this.waehleAb = waehleAb;

	if (div == null) return this;

	if (document.getElementById) {
		this.div.style.left = x - h / 2;
		this.div.style.top = y - d / 2;
		this.div.style.visibility = "visible";
	} else {
		this.div.left = x - h / 2;
		this.div.top = y - d / 2;
		this.div.visibility = "visible";
	}
	return this;
}

function waehleAus() {

	feldImg = "<img src='../../../FeldH.gif' width='"+h+"' height='"+d+"'>";
	schreibeInhalt(this.div, feldImg);	
}

function waehleAb() {

	feldImg = "<img src='../../../Feld.gif' width='"+h+"' height='"+d+"'>";
	schreibeInhalt(this.div, feldImg);
}

function schreibeInhalt(div, inhalt) {

	if (div == null) return;
	
	if (document.layers) {
		with (div.document) {
			open("text/html");
			write(inhalt);
			close();
		}
	} else {
		div.innerHTML = inhalt;
	}
	
}

function Kugel(div, farbe) {

	// Konstruktor der Klasse Kugel

	this.div = div;
	this.farbe = farbe;
	this.aus = false		// Kugel ist im Spiel
	this.feld = null;		// 0..1 Assoziaton zum Spielfeldobjekt

	// Die Koordinaten x,y und z sind keine rechtwinkligen Koordinaten
	// x gibt den Abstand vom linken, nach rechts unten schrägen Brettrand an.
	// y gibt den Abstand vom oberen Brettrand an.
	// z gibt den Abstand vom linken, nach rechts oben schrägen Brettrand an.

	this.x = 0;
	this.y = 0;
	this.z = 0;

	// Instanzmethoden
	this.zeigeAn = zeigeAn;
	this.positioniere = positioniere;
	this.gibKoordinaten = gibKoordinaten;
	return this;
}

function positioniere(x, y, z) {

	// Evtl. Kugel vom alten Platz löschen
	if (this.feld != null) {
		this.feld.kugel = null;
		this.feld = null;
	}

	this.x = x;
	this.y = y;
	this.z = z;

	if (x<0 || x>8 || y<0 || y>8 || z<0 || z>8) {	// Kugel ist raus
		this.aus = true;
		if (this.farbe == "w") {
			ausWeiss++;
			this.x = ausWeiss;
		} else {
			ausSchwarz++;
			this.x = ausSchwarz;
		}
		this.y = 9;
		this.z = 9;
	} else {
		this.feld = Feld[x][y][z];
		this.feld.kugel = this;
	}
}

function zeigeAn() {

	// if (this.feld == null) return;

	if (this.aus) {
		links = breite - (h * offx[this.x-1] + a / 2);
// ToDo: Spieler == Gast??
		if (spieler == this.farbe) {
			oben = hoehe - a * offy[this.x-1];
		} else {
			oben = a * offy[this.x-1];
		}
	} else {
		if (spieler == "w") {	// Spielfeld drehen für den weissen Spieler
			links = breite - this.feld.x - r;
			oben  = hoehe - this.feld.y - r;
		} else {
			links = this.feld.x - r;
			oben  = this.feld.y - r;
		}
	}

	if (document.getElementById) {
		this.div.style.left = links;
		this.div.style.top = oben;
		this.div.style.visibility = "visible";
	} else {
		this.div.left = links;
		this.div.top = oben;
		this.div.visibility = "visible";
	}
}

function gibKoordinaten() {
	return "" + this.x + this.y + this.z;
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

function auswaehlen(nr) {

	self.focus();				// entfernt den Focus-Rahmen im IE

	if (amZug != spieler) return;
	if (spieler != kugel[nr].farbe) return;
	if (kugel[nr].aus) return;

	for (i=0 ; i<3; i++) {
		if (ausgewaehlt[i] == nr) {
// todo: Prüfung - nicht die Mittlere von drei deselektieren!
			ausgewaehlt[i] = null;
			anzAusgewaehlt--;
			sfeld = ermittleFeld(nr);
			if (sfeld != null) sfeld.waehleAb();
			return;
		}
	}

	for (i=0 ; i<3; i++) {
		if (ausgewaehlt[i] == null) {
// todo: Prüfung - nur in einer Reihe fortlaufend selektieren!
			ausgewaehlt[i] = nr;
			anzAusgewaehlt++;
			sfeld = ermittleFeld(nr);
			if (sfeld != null) sfeld.waehleAus();
			break;
		}
	}

}

function ermittleFeld(nr) {

	sfeld = kugel[nr].feld;

	if (spieler == "w") {	// Für den weissen Spieler ist das Brett gedreht
		sx = 8 - kugel[nr].x;
		sy = 8 - kugel[nr].y;
		sz = 8 - kugel[nr].z;
		sfeld = Feld[sx][sy][sz];
	}
	return sfeld;
}

function initSpielfelder() {

	// Spielfelder Grundbelegung null
	Feld = new Array(9);
	for (x=0; x<9; x++) {
		Feld[x] = new Array(9);
		for (y=0; y<9; y++) {
			Feld[x][y] = new Array(9);
			for (z=0; z<9; z++) {
				Feld[x][y][z] = null;
			}
		}
	}

	bild = 0;
//	feldImg = "<img src='Hexagon.gif' width='"+h+"' height='"+d+"'>";
	feldImg = "<img src='../../../Feld.gif' width='"+h+"' height='"+d+"'>";
	for (x=0; x<9; x++) {

		miny = (x>=4) ? 0 : 4-x;	// Grenzen für wohlgeformte Felder
		maxy = (x<=4) ? 8 : 12-x;
		minz = (x<=4) ? 0 : x-4;

		z=minz;
		for (y=miny; y<=maxy; y++) {
			yabs = mittey - ((4 - y) * 1.5 * a);
			xabs = mittex - ((8 - x - z) * h / 2);

			div = ermittleDiv("Feld"+bild);
			schreibeInhalt(div, feldImg);

			Feld[x][y][z] = new Spielfeld(div, xabs, yabs);
			z++;
			bild++;
		}
	}
}

function initSpielkugeln() {

	kugel = new Array();
	kugelImg = "<a href='javascript:noop()' onClick='auswaehlen(Nummer);return false'>";
	weissImg = "<img src='../../../ballsilber.gif' border=0 width="+2*r+" height="+2*r+"></a>";
	schwarzImg = "<img src='../../../ballschwarz.gif' border=0 width="+2*r+" height="+2*r+"></a>";
	for (i=0; i<maxKugel; i++) {
		neuesBild = kugelImg.replace(/Nummer/g,i);
		if (i<14) {
			neuesBild += weissImg;
			farbe = "w";
		} else {
			neuesBild += schwarzImg;
			farbe = "s";
		}

		div = ermittleDiv("Kugel"+i);
		kugel[i] = new Kugel(div, farbe);
		schreibeInhalt(div, neuesBild);
	}
}

function initPfeile() {

	pfeil = new Array(maxPfeil);
	pfeilNorm = new Array(maxPfeil);
	pfeilHigh = new Array(maxPfeil);

	pfeilImg = "<a href='javascript:noop()' onClick='ziehen(Nummer);return false' ";
	pfeilImg += "onMouseover='highlight(Nummer, true)' onMouseout='highlight(Nummer, false)'>";
	pfeilImg += "<img src='../../../PfeilN_Nummer.gif' name='PfeilBildNummer' ";
	pfeilImg += "border=0 width="+a+" height="+a+"></a>";

	for (i=0; i<maxPfeil; i++) {
		neuesBild = pfeilImg.replace(/Nummer/g,i);

		pfeil[i] = ermittleDiv("Pfeil"+i);
		pfeilNorm[i] = new Image();
		pfeilNorm[i].src = "../../../PfeilN_"+i+".gif";
		pfeilHigh[i] = new Image();
		pfeilHigh[i].src = "../../../PfeilH_"+i+".gif";

		schreibeInhalt(pfeil[i], neuesBild);
		if (document.layers) {
			pfeil[i].left = h * offx[i] + a / 2;
			pfeil[i].top = hoehe - a * offy[i];
			pfeil[i].visibility = "visible";
		} else {
			pfeil[i].style.left = h * offx[i] + a / 2;
			pfeil[i].style.top = hoehe - a * offy[i];
			pfeil[i].style.visibility = "visible";
		}
	}
}

function ziehen(nr) {

	// Einer der Richtungspfeile wurde gedrückt

	self.focus();				// entfernt den Focus-Rahmen im IE
	if (spieler == "w") {			// Für den weissen Spieler ist das Brett gedreht!
		nr += (nr > 2) ? -3 : 3;
	}

	for (i=0; i<ausgewaehlt.length; i++) {
		knr = ausgewaehlt[i];
		if (knr != null) {

			sfeld = ermittleFeld(knr);
			if (sfeld != null) sfeld.waehleAb();

			xneu = kugel[knr].x;
			yneu = kugel[knr].y;
			zneu = kugel[knr].z;

			switch (nr) {
				case 0:	xneu++; zneu++; break;
				case 1:	yneu++; zneu++; break;
				case 2:	yneu++; xneu--; break;
				case 3:	xneu--; zneu--; break;
				case 4:	yneu--; zneu--; break;
				case 5:	xneu++; yneu--; break;
			}
			kugel[knr].positioniere(xneu, yneu, zneu);
			kugel[knr].zeigeAn();
			ausgewaehlt[i] = null;
		}
	}

	// Speichern des Spielstands auf dem Server

	formular = top.Kommunikation.document.AktuellerStand;

	standNeu = "";

	for (i=0; i<maxKugel; i++) {
		standNeu += kugel[i].gibKoordinaten();
	}

	formular.stand.value = standNeu;
	formular.submit();
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