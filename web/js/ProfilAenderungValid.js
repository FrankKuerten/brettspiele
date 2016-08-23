function validiere(formular) {

	if (formular.passwortAlt.value == "") {
		alert("Altes Kennwort darf nicht leer sein!");
		formular.passwortAlt.focus();
		return false;
	}
	if (formular.passwortNeu.value == "") {
		alert("Neues Kennwort darf nicht leer sein!");
		formular.passwortNeu.focus();
		return false;
	}
	if (formular.passwortKopie.value == "") {
		alert("Wiederholen Sie bitte das Kennwort!");
		formular.passwortKopie.focus();
		return false;
	}
	if (formular.passwortNeu.value != formular.passwortKopie.value) {
		alert("Kennworte müssen gleich sein!");
		formular.passwortKopie.focus();
		formular.passwortKopie.select();
		return false;
	}
	if (formular.email.value == "") {
		alert("EMail-Adresse darf nicht leer sein!");
		formular.email.focus();
		return false;
	}
	return true;
}