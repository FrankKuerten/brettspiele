function Kugel(div, farbe) {

    // Konstruktor der Klasse Kugel

    this.div = div;
    this.farbe = farbe;
    this.aus = false;        // Kugel ist im Spiel
    this.feld = null;        // 0..1 Assoziaton zum Spielfeldobjekt

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
    this.ermittleFeld = ermittleFeld;
    this.angeklickt = angeklickt;
    this.schiebe = schiebe;
    this.waehleAus = waehleKugelAus;
    this.waehleAb = waehleKugelAb;
    this.gibNachbarn = gibNachbarn;
    this.istNachbar = istNachbar;
    this.istUebernaechsterNachbar = istUebernaechsterNachbar;
    return this;
}

function positioniere(x, y, z) {

    // Evtl. Kugel vom alten Platz l�schen
    if (this.feld != null && this.feld.kugel == this) {
        this.feld.kugel = null;
    }
    this.feld = null;

    this.x = x;
    this.y = y;
    this.z = z;

    if (istAusserhalb(x, y, z)) {    // Kugel ist raus
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
    } else {        // Aufbau der ungerichteten Assoziation zum Spielfeld
        this.aus = false;
        this.feld = Feld[x][y][z];
        this.feld.kugel = this;
    }
}

function zeigeAn() {

    if (this.aus) {
        sichtbar(this.div, false);
    } else {
        var sfeld = this.ermittleFeld();
        var links = sfeld.x - r;
        var oben  = sfeld.y - r;
        positioniereDiv(this.div, links, oben);
        sichtbar(this.div, true);
    }
}

function gibKoordinaten() {
    return "" + this.x + this.y + this.z;
}

function angeklickt() {

    self.focus();                // entfernt den Focus-Rahmen im IE

    if (amZug != spieler) return;
    if (spieler != this.farbe) return;
    if (this.aus) return;
    if (istBeendet) return;
    if (replay) return;

    var deselektieren = false;
    var selektieren = false;

    // Deselektieren (nur am Anfang und am Ende des Ausgewaehlt-Arrays)
    if (ausgewaehlt[0] == this) {
        deselektieren = true;
        ausgewaehlt.reverse();
    }
    if (ausgewaehlt[ausgewaehlt.length - 1] == this) {
        deselektieren = true;
    }

    if (deselektieren) {
        ausgewaehlt = ausgewaehlt.slice(0, - 1);
        this.waehleAb();
        plausiPfeile();
    } else {
        // Selektieren?
        switch (ausgewaehlt.length) {
        case 0:
            selektieren = true;
            break;
        case 1:
            selektieren = (this.istNachbar(ausgewaehlt[0]));
            break;
        case 2:
            if (this.istNachbar(ausgewaehlt[0]) &&
            this.istUebernaechsterNachbar(ausgewaehlt[1]) ) {
                ausgewaehlt.reverse();
                selektieren = true;
            }
            if (this.istNachbar(ausgewaehlt[1]) &&
            this.istUebernaechsterNachbar(ausgewaehlt[0]) ) {
                selektieren = true;
            }
            break;
        }

        if (selektieren) {
            ausgewaehlt[ausgewaehlt.length] = this;
            this.waehleAus();
            plausiPfeile();
        }
    }
}

function waehleKugelAus() {

    var sfeld = this.ermittleFeld();
    if (sfeld != null) sfeld.waehleAus();
}

function waehleKugelAb() {

    var sfeld = this.ermittleFeld();
    if (sfeld != null) sfeld.waehleAb();
}

function ermittleFeld() {

    var sfeld = this.feld;

    if (spieler == "w") {    // Für den weißen Spieler ist das Brett gedreht
        var sx = 8 - this.x;
        var sy = 8 - this.y;
        var sz = 8 - this.z;
        sfeld = Feld[sx][sy][sz];
    }
    return sfeld;
}

function schiebe(richtung) {

    // Verschiebe diese Kugel in eine der 6 Richtungen.
    // Die Richtungen von 0 bis 5 sind die möglichen Zugrichtungen:
    // 3 Uhr, 5 Uhr, 7 Uhr, 9 Uhr, 11 Uhr und 1 Uhr auf einem Zifferblatt. 
    // In Zugrichtung liegende Kugeln werden mit verschoben.
    // Vorher muss die Korrektheit des Zugs plausibilisiert sein.

    this.waehleAb();

    var xneu = this.x;
    var yneu = this.y;
    var zneu = this.z;
    var kugelImWeg = null;

    switch (richtung) {
        case 0:    xneu++; zneu++; break;
        case 1:    yneu++; zneu++; break;
        case 2:    yneu++; xneu--; break;
        case 3:    xneu--; zneu--; break;
        case 4:    yneu--; zneu--; break;
        case 5:    xneu++; yneu--; break;
    }

    // Im Weg liegende Kugel wird mit verschoben
    if (!istAusserhalb(xneu, yneu, zneu)) {
        kugelImWeg = Feld[xneu][yneu][zneu].kugel;
        if (kugelImWeg != null) {
            kugelImWeg.schiebe(richtung);
        }
    }
    this.positioniere(xneu, yneu, zneu);
}

function gibNachbarn(richtung, farbe) {

    var ergebnis = (this.farbe == farbe) ? "g" : "a";

    var xneu = this.x;
    var yneu = this.y;
    var zneu = this.z;
    var kugelImWeg = null;

    switch (richtung) {
        case 0:    xneu++; zneu++; break;
        case 1:    yneu++; zneu++; break;
        case 2:    yneu++; xneu--; break;
        case 3:    xneu--; zneu--; break;
        case 4:    yneu--; zneu--; break;
        case 5:    xneu++; yneu--; break;
    }

    // Im Weg liegende Kugel wird nach den Nachbarn gefragt
    if (!istAusserhalb(xneu, yneu, zneu)) {
        kugelImWeg = Feld[xneu][yneu][zneu].kugel;
        if (kugelImWeg != null) {
            ergebnis += kugelImWeg.gibNachbarn(richtung, farbe);
        } else {
            ergebnis += " ";    // Blank == leeres Feld
        }
    } else {
        ergebnis += "-";    // "-" == Aus
    }

    return ergebnis;
}

function istNachbar(kugel) {
    var ergebnis = 0;
    ergebnis += Math.abs(this.x - kugel.x);
    ergebnis += Math.abs(this.y - kugel.y);
    ergebnis += Math.abs(this.z - kugel.z);
    return (ergebnis == 2);
}

function istUebernaechsterNachbar(kugel) {
    var ergebnis = 0;
    ergebnis += Math.abs(this.x - kugel.x);
    ergebnis += Math.abs(this.y - kugel.y);
    ergebnis += Math.abs(this.z - kugel.z);
    return (ergebnis == 4 &&
        (this.x == kugel.x || this.y == kugel.y || this.z == kugel.z));
}
