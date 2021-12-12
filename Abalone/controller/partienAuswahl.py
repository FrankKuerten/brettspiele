#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import os
import cherrypy
from controller.abstrakterController import AbstrakterController
from model.Benutzer import Benutzer
from Abalone.model.Partie import Partie as Partie

class PartienAuswahl(AbstrakterController):
    
    APPDIR = os.path.dirname(os.path.abspath(__file__))

    @cherrypy.expose
    def index(self, name="", aktive=False, fehler="", partien=[]):
        """
        Seite wird mit Cheetah aufbereitet und ausgegeben
        """
        ben = self.pruefeAngemeldet()
        template = self.getTemplate("partienAuswahl.tmpl")
        
        if name == "" and ben.name != "Gast":
            name = ben.name

        template.ben = ben
        template.name = name
        template.fehler = fehler
        template.partien = partien
        template.aktive = aktive
        alleBenutzer = self.alleSessionAttribute("benutzer")
        template.alleBenutzer = [b.name for b in alleBenutzer if b is not None]
        # print(template.alleBenutzer)
        
        # Partie soll ausgewählt werden, evtl. alte entfernen
        try:
            del self.getSession()["partie"]
        except KeyError:
            pass
        
        return str(template)

    @cherrypy.expose    
    def suchePartie(self, name="", aktive=False, fehler=""):
        """
        Prüft die Eingaben und navigiert wenn OK auf die Folgeseite
        """
        self.pruefeAngemeldet()
        if aktive:
            liste = Partie.sucheAktive(name)
            return self.index(name, aktive, "", liste)
        
        if name == "":
            fehler =  "Bitte geben Sie einen Benutzernamen ein!"
            return self.index(name, aktive, fehler)

        ben = Benutzer.suchen(name)
        if ben is None:
            fehler =  "Dieser Benutzer ist nicht registriert"
            return self.index(name, aktive, fehler)
            
        liste = Partie.sucheName(name)
        return self.index(name, aktive, "", liste)

    @cherrypy.expose    
    def waehlePartie(self, name, partienummer, aktive=False):
        """
        Prüft die Eingaben und navigiert wenn OK auf die Folgeseite
        """
        ben = self.pruefeAngemeldet()
        
        if partienummer is None:
            fehler =  "Bitte eine Zeile ausw&auml;hlen!"
            return self.index(name, aktive, fehler)
            
        partie = Partie.suchen(partienummer)
        # Ist ein Gegner noch nicht festgelegt?
        if partie.schwarz != ben.name and partie.weiss == "" and ben.name != 'Gast':
            partie.weiss = ben.name
            partie.speichern()
            
        if partie.weiss != ben.name and partie.schwarz == "" and ben.name != 'Gast':
            partie.schwarz = ben.name
            partie.speichern()
            
        self.getSession()["partie"] = partie
        raise cherrypy.HTTPRedirect("/Abalone/SpielBrett/")

    @cherrypy.expose    
    def neuePartieSchwarz(self):
        """
        Legt eine neue Partie an und navigiert auf die Folgeseite
        """
        self.neuePartie()

    @cherrypy.expose    
    def neuePartieWeiss(self):
        """
        Legt eine neue Partie an und navigiert auf die Folgeseite
        """
        self.neuePartie(False)

    def neuePartie(self, schwarz=True):
        """
        Legt eine neue Partie an und navigiert auf die Folgeseite
        """
        self.pruefeAngemeldet()
        ben = self.getSession().get("benutzer")
        if schwarz:
            partie = Partie.neuePartie(ben.name, "")
        else:
            partie = Partie.neuePartie("", ben.name)
        self.getSession()["partie"] = partie
        raise cherrypy.HTTPRedirect("/Abalone/SpielBrett/")
