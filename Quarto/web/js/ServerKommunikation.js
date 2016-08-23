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
        request.send();
    }
}

function speichereZug(zug) {

    // Speichern des Spielstands auf dem Server

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
    parms.push(zug.toString());
    parms.push("&beendet=");
    parms.push((brett.beendet ? "1" : "0"));
    request.open("POST", "spielzug", true); // true for asynchronous
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(parms.join(""));
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

    // Aktuellen Stand auf dem Brett anzeigen
    // ...nur bei Änderung, sonst zuckt ein drehender Stein
    if (spielstandAlt != spielstand){
        brett.zeigeSpielstand(spielstand);
        spielstandAlt = spielstand;
    }

    if (amZug != spieler && !brett.beendet) {
        kiebitz = setTimeout(holeSpielstand, 10000);
    }
}
