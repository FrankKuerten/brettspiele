function holeSpielstand() {

    // Die Daten werden vom Server geliefert (target = Kommunikation)

    clearTimeout(kiebitz);
    // Wird im Hauptframe noch das Spielbrett angezeigt?
    if (parent.Haupt.document.HoleStand) {
        document.HoleStand.submit();
    }
}

function spielstandGeladen(pSpielstand, pSpieler, pAmZug, sName, wName, pSpielstandVorher) {

    // Dies ist die Callback-Funktion des Frames 'Kommunikation'.

    spielstand = pSpielstand;
    spielstandVorher = pSpielstandVorher
    spieler = pSpieler;
    amZug = pAmZug;
    nameWeiss = wName;
    nameSchwarz = sName;

    if (amZug != amZugAlt) {
        amZugAlt = amZug;
        zeigeSpielstand(spielstand);
    }
    if (amZug != spieler && !istBeendet) {
        kiebitz = setTimeout(holeSpielstand, 3000);
    }
}

function speichereZug() {

    // Speichern des Spielstands auf dem Server

    var formular = parent.Kommunikation.document.AktuellerStand;

    var standNeu = "";

    for (var i=0; i<maxKugel; i++) {
        standNeu += kugel[i].gibKoordinaten();
    }

    formular.stand.value = standNeu;
    formular.submit();
}

function meldeSpielstand() {

    // Diese Funktion wird onLoad im Kommunikationsframe gestartet

    var formular = document.AktuellerStand;

    // Wird im Hauptframe noch das Spielbrett angezeigt?
    if (!parent.Haupt.document.HoleStand) {
        return;
    }

    spielstand = formular.stand.value;
    spieler = formular.spielfarbe.value;
    amZug = formular.amZug.value;
    nameWeiss = formular.nameWeiss.value;
    nameSchwarz = formular.nameSchwarz.value;
    letzterZug = formular.letzterZug.value;
    spielstandVorher = formular.standVorher.value;

    // Callback des Haupframes
    if (letzterZug == "True"){
        parent.Haupt.spielstandGeladen(spielstand, spieler, amZug, nameSchwarz, nameWeiss, spielstandVorher);
    } else {
        parent.Haupt.parseSpielzuege(spielstand);
    }
}
