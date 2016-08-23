
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
    ergebnis = ergebnis.replace(/�/g,"&auml;");
    ergebnis = ergebnis.replace(/�/g,"&ouml;");
    ergebnis = ergebnis.replace(/�/g,"&uuml;");
    ergebnis = ergebnis.replace(/�/g,"&Auml;");
    ergebnis = ergebnis.replace(/�/g,"&Ouml;");
    ergebnis = ergebnis.replace(/�/g,"&Uuml;");
    ergebnis = ergebnis.replace(/�/g,"&szlig;");
    return ergebnis;
}
