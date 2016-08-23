function validiere(formular) {

	if (formular.benutzer.value == "") {
		alert(unescape("Bitte w%u00E4hlen Sie einen Namen!"));
		formular.benutzer.focus();
		return false;
	}
	if (formular.benutzer.value.toLowerCase() == "gast" ||
		formular.benutzer.value.toLowerCase() == "admin" ) {
		alert("Sorry, dies ist ein reservierter Benutzername.");
		formular.benutzer.focus();
		formular.benutzer.select();
		return false;
	}
	if (formular.passwort.value == "") {
		alert("Bitte geben Sie Ihr Kennwort ein!");
		formular.passwort.focus();
		return false;
	}
	if (formular.passwortKopie.value == "") {
		alert("Wiederholen Sie bitte das Kennwort!");
		formular.passwortKopie.focus();
		return false;
	}
	if (formular.passwort.value != formular.passwortKopie.value) {
		alert(unescape("Kennworte m%u00FCssen gleich sein!"));
		formular.passwortKopie.focus();
		formular.passwortKopie.select();
		return false;
	}
	return true;
}
