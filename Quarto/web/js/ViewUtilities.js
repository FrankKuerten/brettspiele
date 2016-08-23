
function noop() {}

function ziehen(richtung) {

    speichereZug();
}


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
    var formular = document.HoleStand;
    formular.letzterZug.value = "False";
    formular.submit();
}

function beendeReplayModus(){
    replay = false;
    initReplay();
    amZugAlt = "";
    var formular = document.HoleStand;
    formular.letzterZug.value = "True";
    formular.submit();
}

function replayZug(nr){
    self.focus();
    amZug = (nr % 2 == 0) ? "s" : "w";
    initReplay();
    zeigeSpielstand(spielzuege[nr]);
}

function replayVorwaerts(){
    if (zugnr < maxzug){
        zugnr += 1;
        replayZug(zugnr);
    }
}

function replayZurueck(){
    if (zugnr > 0){
        zugnr -= 1;
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
