
function noop() {}

function pruefeEnde() {
    brett.pruefe();
    istBeendet = brett.beendet;
    if (istBeendet) {
        alert("Dieses Spiel ist beendet, der Gewinner ist " + amZug);
    }
}

function starteReplayModus(){
    clearTimeout(kiebitz);
    replay = true;
    zugnr = maxzug;
    initReplay();
}

function beendeReplayModus(){
    replay = false;
    initReplay();
    // brett.reset();
    spielstandAlt = '';
    holeSpielstand();
}

function replayZug(nr){
    brett.reset();
    if (nr % 4 == 0 || (nr + 1) % 4 == 0){
        amZug = "s";
    } else {
        amZug = "w";
    }
    brett.zeigeSpielstand(spielzuege, nr);
    initReplay();
}

function replayVorwaerts(){
    if (zugnr < maxzug){
        zugnr += zugnr % 2 == 0 ? 2 : 1;
        if (zugnr > maxzug){
            zugnr = maxzug;
        }
        replayZug(zugnr);
    }
}

function replayZurueck(){
    if (zugnr > 0){
        zugnr -= zugnr % 2 == 0 ? 2 : 1;
        replayZug(zugnr);
    }
}

function replayAnfang(){
    zugnr = 0;
    replayZug(zugnr);
}

function replayEnde(){
    zugnr = maxzug;
    replayZug(zugnr);
}

function initReplay(){
    vor = ermittleDiv("vorwaerts");
    rueck = ermittleDiv("zurueck");
    ende = ermittleDiv("ende");
    anfang = ermittleDiv("anfang");
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

function ermittleDiv(id) {
    return document.getElementById(id);
}

function sichtbar(div, istSichtbar) {
    div.style.visibility = (istSichtbar) ? "visible" : "hidden";
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
