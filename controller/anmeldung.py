#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import cherrypy
import smtplib
from smtplib import SMTPException
import string
from random import randint, choice

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
        
        if action == "Neues Passwort":
            return self.pwVergessen(name)

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
    def pwVergessen(self, name):
        """
        Setzt das passwort zurück und sendet eine Mail an den Benutzer
        """
        if name is None or name == "":
            fehler =  "Bitte geben Sie Ihren Benutzernamen ein!"
            return self.index(name, "", fehler)
        
        if name.lower() == "gast" \
        or name.lower() == "admin":
            fehler =  "Dieser Benutzername ist reserviert"
            return self.index(name, "", fehler)
        
        ben = Benutzer.suchen(name)
        if ben is None:
            fehler =  "Sie sind noch nicht registriert"
            return self.index(name, "", fehler)
        
        if ben.mailAdresse is None or ben.mailAdresse == "":
            fehler =  "Zu diesem Benutzer ist keine Adresse hinterlegt"
            return self.index(name, "", fehler)
        
        characters = string.ascii_letters + string.digits
        pw =  "".join(choice(characters) for x in range(randint(8, 16)))
        sender = "???" # TODO Sender Mailadresse
        template = self.getTemplate("pwVergessen.tmpl")
        template.name = ben.name
        template.passwort = pw
        template.mailAdresse = ben.mailAdresse
        template.sender = sender
        receivers =[ben.mailAdresse]
        
        try:
            smtpObj = smtplib.SMTP('???', 587) # TODO SMTP Server
            smtpObj.login(sender, "???") # TODO passwort
            smtpObj.sendmail(sender, receivers, str(template))
            fehler = "Eine Email mit dem neuen Passwort wurde an Sie gesendet"
            ben.passwort = ben.cryptPasswort(pw)
            ben.speichern()
            
        except SMTPException:
            fehler = "Versand der email schlug fehl"
        return self.index(name, "", fehler)
        
    @cherrypy.expose    
    def gastLogin(self, spiel):
        """
        Meldet anonym als Gast an und navigiert auf die Folgeseite
        """
        ben = Benutzer("Gast")
        self.getSession()['benutzer'] = ben
        self.getSession()['spiel'] = spiel
        raise cherrypy.HTTPRedirect("/PartienAuswahl/")
        