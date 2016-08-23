function validiere(formular) {

	if (formular.name.value == "") {
		alert("Bitte geben Sie Ihren Namen ein!");
		formular.name.focus();
		return false;
	}
	if (formular.passwort.value == "") {
		alert("Bitte geben Sie Ihr Kennwort ein!");
		formular.passwort.focus();
		return false;
	}
	return true;
}
