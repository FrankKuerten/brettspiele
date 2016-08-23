function holeSpielstand() {

    // Die Daten werden vom Server im JSON Format geliefert

    clearTimeout(kiebitz);

    // Wird im Hauptframe noch das Spielbrett angezeigt?
    if (document.Standform) {
        var request = new XMLHttpRequest();
        request.onload = function() {
            callback(request.responseText);
        };
        request.open("POST", "holeStandJSON", true); // true for asynchronous
        var parms = [];
        parms.push("letzterZug=");
        if (replay){
            // letzterZug="False" bedeutet: Alle Züge der Partie liefern
            parms.push("False");
        } else {
            parms.push("True");
        }
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(parms.join(""));
    }
}

function callback(jsonText) {
    var resp = JSON.parse(jsonText);

    partienummer = resp.partienummer;
    zugnummer = resp.zugnummer;
    spielstand = resp.stand;
    spieler = resp.spielfarbe;
    amZug = resp.amZug;
    nameWeiss = resp.nameWeiss;
    nameSchwarz = resp.nameSchwarz;
    letzterZug = resp.letzterZug;
    spielstandVorher = resp.standVorher;

    // Spielstand anzeigen
    if (replay){
        // Replay Modus
        parseSpielzuege(spielstand);
    } else {
        if (amZug != amZugAlt) {
            amZugAlt = amZug;
            zeigeSpielstand(spielstand);
        }
        if (amZug != spieler && !istBeendet) {
            kiebitz = setTimeout(holeSpielstand, 10000);
        }
    }
}

function speichereZug() {

    // Speichern des Spielstands auf dem Server

    var standNeu = "";

    for (var i=0; i<maxKugel; i++) {
        standNeu += kugel[i].gibKoordinaten();
    }

    var request = new XMLHttpRequest();

    request.onload = function() {
        callback(request.responseText);
    };
    var parms = [];
    parms.push("partienummer=");
    parms.push(partienummer);
    parms.push("&zugnummer=");
    parms.push(zugnummer);
    parms.push("&stand=");
    parms.push(standNeu.toString());
    request.open("POST", "spielzug", true); // true for asynchronous
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(parms.join(""));
}
