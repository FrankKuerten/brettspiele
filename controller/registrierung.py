#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import cherrypy
from controller.abstrakterController import AbstrakterController
from model.Benutzer import Benutzer

class Registrierung(AbstrakterController):

    @cherrypy.expose
    def index(self, name="", passwort="", passwortKopie="", mailAdresse="", fehler = ""):
        """
        Seite wird mit Cheetah aufbereitet und ausgegeben
        """
        template = self.getTemplate("registrierung.tmpl")
        template.name = name
        template.passwort = passwort
        template.passwortKopie = passwortKopie
        template.mailAdresse = mailAdresse
        template.fehler = fehler
        template.spiel = self.getSession().get("spiel")

        return str(template)

    @cherrypy.expose    
    def registriere(self, name, passwort, passwortKopie, mailAdresse, spiel, fehler = ""):
        """
        Prüft die Eingaben und navigiert wenn OK auf die Folgeseite
        """
        if name == "":
            fehler =  "Bitte geben Sie Ihren Benutzernamen ein!"
            return self.index(name, passwort, passwortKopie, mailAdresse, fehler)
        
        if name.lower() == "gast" \
        or name.lower() == "admin":
            fehler =  "Dieser Benutzername ist reserviert"
            return self.index(name, passwort, passwortKopie, mailAdresse, fehler)
            
        ben = Benutzer.suchen(name)
        if ben is not None:
            fehler =  "Der Benutzername ist bereits vergeben"
            return self.index(name, passwort, passwortKopie, mailAdresse, fehler)

        if passwort == "":
            fehler =  "Bitte geben Sie ein Passwort ein!"
            return self.index(name, passwort, passwortKopie, mailAdresse, fehler)
            
        if passwort != passwortKopie:
            fehler =  "Bitte geben Sie das Passwort ein zweites mal zur Kontrolle ein!"
            return self.index(name, passwort, passwortKopie, mailAdresse, fehler)
        
        # Prüfungen OK
        ben = Benutzer(name, passwort)
        ben.speichern()
        self.getSession()['benutzer'] = ben
        self.getSession()['spiel'] = spiel
        raise cherrypy.HTTPRedirect("/PartienAuswahl/")
