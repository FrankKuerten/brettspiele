#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import crypt
import cherrypy
from controller.abstrakterController import AbstrakterController

class ProfilAenderung(AbstrakterController):

    @cherrypy.expose
    def index(self, passwort="", passwortKopie="", mailAdresse="", fehler=""):
        """
        Seite wird mit Cheetah aufbereitet und ausgegeben
        """
        ben = self.pruefeAngemeldet()
        template = self.getTemplate("profilAenderung.tmpl")
        template.passwort = passwort
        template.passwortKopie = passwortKopie
        if mailAdresse == "":
            mailAdresse = ben.mailAdresse
        template.mailAdresse = mailAdresse
        template.fehler = fehler
        template.benutzer = ben
        template.spiel = self.getSession().get("spiel")

        return str(template)

    @cherrypy.expose    
    def aendereProfil(self, spiel, passwort="", passwortKopie="", mailAdresse=""):
        """
        Prüft die Eingaben und navigiert wenn OK auf die Folgeseite
        """
        ben = self.pruefeAngemeldet()

        if passwort != passwortKopie:
            fehler =  "Bitte geben Sie das Passwort ein zweites mal zur Kontrolle ein!"
            return self.index(passwort, passwortKopie, mailAdresse, fehler)
            
        if passwort != "":
            ben.passwort = crypt.crypt(passwort, "AL")
        
        ben.mailAdresse = mailAdresse
        
        # Prüfungen OK
        ben.speichern()
        self.getSession()['benutzer'] = ben
        self.getSession()['spiel'] = spiel
        raise cherrypy.HTTPRedirect("/Abalone/PartienAuswahl/")
