function validiere(formular) {

	auswahl = false;
	opts = formular.partienummer;
	if (!opts.length) { // Es gibt nur eine Zeile!!
		if (opts.checked) auswahl = true;
	} else {
		for (i=0; i<opts.length; i++) {
			if (opts[i].checked) auswahl = true;
		}
	}

	if (!auswahl) {
		alert(unescape("Bitte w%u00E4hlen Sie eine Zeile aus!"));
	}
	return auswahl;
}
