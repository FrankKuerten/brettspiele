// Globale Variablen ausserhalb der Functions
    breiteAlt = null;
    hoeheAlt = null;
    breite = 0;
    hoehe = 0;

// Spielfeld, Kugeln und Pfeile
    maxKugel = 28;
    maxFeld = 61;
    maxPfeil = 10;
    
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

// Preload einiger Bilder 
    feldHigh = new Image();
    feldHigh.src = "/Abalone/FeldH.gif";
    feldNorm = new Image();
    feldNorm.src = "/Abalone/Feld.gif";

    pfeilNorm = new Array(maxPfeil);
    pfeilHigh = new Array(maxPfeil);

    for (var i=0; i<maxPfeil; i++) {
        pfeilNorm[i] = new Image();
        pfeilNorm[i].src = "/Abalone/PfeilN_"+i+".gif";
        pfeilHigh[i] = new Image();
        pfeilHigh[i].src = "/Abalone/PfeilH_"+i+".gif";
    }
    kugel = new Array(maxKugel);
    
// Timer für die Beobachtung des Spielstands, wenn man nicht am Zug ist
    kiebitz = null;
    
// SpielstandHoehe ist durch die Tabelle der Spieler und Punkte belegt
    spielstandHoehe = 60;
    ausgewaehlt = new Array();
    partienummer = null;
    zugnummer = null;
    spielstand = null;
    spieler = null;
    amZug = null;
    amZugAlt = null;
    nameWeiss = null;
    nameSchwarz = null;
    istBeendet = false;
    
// Diese Faktoren werden benötigt, um die Pfeile im Sechseck anzuordnen
// Die ersten 6 sind die Richtungspfeile im Spielmodus,
// die letzten 4 sind die Pfeile im Replaymodus
    offx = new Array(1.7, 1.2, 0.5, 0, 0.5, 1.2, 1.2, 0.6, 1.8, 0);
    offy = new Array(2.5, 1.5, 1.5, 2.5, 3.6, 3.6, 2.5, 2.5, 2.5, 2.5);

// Die Semaphore steuert, dass zu einer Zeit nur ein Thread 
// in der function resize() läuft. Synchronized fehlt in JavaScript.
    semaphore = false;
    window.onresize = resize;
    
// Steuerung des Replaymodus
    spielzuege = null;
    zugnr = 0;
    replay = false;
    maxzug = 0;
    
// Konstante des Verhältnis Höhe zu Seitenlänge eines Feldes
    hKonst = Math.tan(Math.PI/6);

function init() {

    ermittleFensterGroesse();
    ermittleFeldGroesse()

    initSpielfelder();
    initSpielkugeln();
    initPfeile();
    initReplay();
    holeSpielstand();
}

function resize() {

    ermittleFensterGroesse();
    // if (breiteAlt == breite && hoeheAlt == hoehe) return;
    if (semaphore || (breiteAlt == breite && hoeheAlt == hoehe)) return;
    semaphore = true;
    
    ermittleFeldGroesse()

    resizeSpielfelder();
    resizeSpielkugeln();
    resizePfeile();
    initReplay();
    semaphore = false;
}

function ermittleFeldGroesse() {
    breiteAlt = breite;
    hoeheAlt = hoehe;
    
    var ah = (hoehe - spielstandHoehe) / 15; // Seitenlänge eines Felds (von Hoehe abh.)
    var hh = ah / hKonst;                    // Hoehe eines Felds (von Hoehe abh.)
    var hb = breite / 11;                    // Hoehe eines Felds (von Breite abh.)
    var ab = hb * hKonst;                    // Seitenlänge eines Felds (von Breite abh.)
    if (ah < ab) {                           // je nach Verhältnis Hoehe / Breite
        a = ah;
        h = hh;
    } else {
        a = ab;
        h = hb;
    }
    d = 2 * a;                   // Diagonale eines Felds
    r = 3 * a / 4                // Radius einer Kugel

    mittex = breite/2;
    mittey = (hoehe + spielstandHoehe) / 2;
}

function initSpielfelder() {

    var lfdnr = 0;
    for (var x=0; x<9; x++) {

        var miny = (x>=4) ? 0 : 4-x;    // Grenzen für wohlgeformte Felder
        var maxy = (x<=4) ? 8 : 12-x;
        var minz = (x<=4) ? 0 : x-4;

        var z = minz;
        for (var y=miny; y<=maxy; y++) {
            var yabs = mittey - ((4 - y) * 1.5 * a);
            var xabs = mittex - ((8 - x - z) * h / 2);

            var div = ermittleDiv("Feld"+lfdnr);
            aendereBildgroesse("FeldBild" + lfdnr, h, d);

            Feld[x][y][z] = new Spielfeld(div, xabs, yabs, lfdnr);
            z++;
            lfdnr++;
        }
    }
}

function resizeSpielfelder() {
    for (var x=0; x<9; x++) {
        for (var y=0; y<9; y++) {
            for (var z=0; z<9; z++) {
                if (Feld[x][y][z] != null){

                    Feld[x][y][z].y = mittey - ((4 - y) * 1.5 * a);
                    Feld[x][y][z].x = mittex - ((8 - x - z) * h / 2);

                    aendereBildgroesse("FeldBild" + Feld[x][y][z].lfdnr, h, d);
                    Feld[x][y][z].zeigeAn();
                }
            }
        }
    }
}

function initSpielkugeln() {

    var farbe = "";
    for (var i=0; i<maxKugel; i++) {
        if (i<14) {
            farbe = "w";
        } else {
            farbe = "s";
        }
        var div = ermittleDiv("Kugel"+i);
        kugel[i] = new Kugel(div, farbe);
        aendereBildgroesse("KugelBild" + i, 2*r, 2*r);
    }
}

function resizeSpielkugeln() {
    for (var i=0; i<maxKugel; i++) {
        kugel[i].zeigeAn();
        aendereBildgroesse("KugelBild" + i, 2*r, 2*r);
    }
}

function initPfeile() {

    pfeil = new Array(maxPfeil);

    for (var i=0; i<maxPfeil; i++) {

        pfeil[i] = ermittleDiv("Pfeil"+i);
        aendereBildgroesse("PfeilBild" + i, a, a);

        var links = h * offx[i] + a / 2;
        var oben = hoehe - a * offy[i];
        positioniereDiv(pfeil[i], links, oben);
    }
}

function resizePfeile() {

    for (var i=0; i<maxPfeil; i++) {
        aendereBildgroesse("PfeilBild" + i, a, a);
        var links = h * offx[i] + a / 2;
        var oben = hoehe - a * offy[i];
        positioniereDiv(pfeil[i], links, oben);
    }
}

function initReplay(){
    vor = pfeil[6];
    rueck = pfeil[7];
    ende = pfeil[8];
    anfang = pfeil[9];
    rep = ermittleDiv("starteReplay");
    exit = ermittleDiv("exitReplay");
    sichtbar(vor, replay);
    sichtbar(rueck, replay);
    sichtbar(ende, replay);
    sichtbar(anfang, replay);
    sichtbar(exit, replay);
    sichtbar(rep, !replay);
    
    if (zugnr >= maxzug){
        sichtbar(vor, false);
        sichtbar(ende, false);
    }
    if (zugnr <= 0){
        sichtbar(rueck, false);
        sichtbar(anfang, false);
    }
}
