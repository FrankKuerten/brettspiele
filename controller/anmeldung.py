#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import cherrypy
from controller.abstrakterController import AbstrakterController
from model.Benutzer import Benutzer

class Anmeldung(AbstrakterController):

    @cherrypy.expose
    def index(self, name="", passwort="", fehler = ""):
        """
        Anmeldeseite wird mit Cheetah aufbereitet und ausgegeben
        """
        template = self.getTemplate("anmeldung.tmpl")
        template.name = name
        template.passwort = passwort
        template.fehler = fehler
        template.spiel = self.getSession().get("spiel")

        return str(template)
    
    @cherrypy.expose
    def login(self, spiel, name, passwort, action, fehler = ""):
        """
        Prüft die Eingaben und navigiert wenn OK auf die Folgeseite
        """
        if action == "Als Gast Anmelden":
            return self.gastLogin(spiel)

        if name == "":
            fehler =  "Bitte geben Sie Ihren Benutzernamen ein!"
            return self.index(name, passwort, fehler)

        if passwort == "":
            fehler =  "Bitte geben Sie ein Passwort ein!"
            return self.index(name, passwort, fehler)

        ben = Benutzer.suchen(name)
        if ben is None:
            fehler =  "Sie sind noch nicht registriert"
            return self.index(name, passwort, fehler)

        if not ben.pruefePasswort(passwort):
            fehler =  "Das Passwort ist nicht korrekt"
            return self.index(name, passwort, fehler)
        
        # Prüfungen OK
        self.getSession()['benutzer'] = ben
        self.getSession()['spiel'] = spiel
        raise cherrypy.HTTPRedirect("/PartienAuswahl/")

    @cherrypy.expose    
    def gastLogin(self, spiel):
        """
        Meldet anonym als Gast an und navigiert auf die Folgeseite
        """
        ben = Benutzer("Gast")
        self.getSession()['benutzer'] = ben
        self.getSession()['spiel'] = spiel
        raise cherrypy.HTTPRedirect("/PartienAuswahl/")
        