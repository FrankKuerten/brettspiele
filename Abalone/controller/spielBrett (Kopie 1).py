#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import os
import cherrypy
from Cheetah.Template import Template
from Abalone.controller.partienAuswahl import PartienAuswahl
from controller.abstrakterController import AbstrakterController
from model.Benutzer import Benutzer
from Abalone.model.Partie import Partie

class SpielBrett(AbstrakterController):

    APPDIR = os.path.dirname(os.path.abspath(__file__))

    @cherrypy.expose
    def index(self):
        """
        Seite wird mit Cheetah aufbereitet und ausgegeben
        """
        ben = self.pruefeAngemeldet()        
        template = self.getTemplate("spielBrett.tmpl")
        template.letzterZug = "True"

        return str(template)

    @cherrypy.expose    
    def holeStand(self, letzterZug="True"):
        """
        Gibt den Stand im Kommunikationsframe aus
        """
        ben = self.pruefeAngemeldet()
        partie = cherrypy.session.get("partie")
        partie = Partie.suchen(partie.nummer)
        template = self.getTemplate("pollFrame.tmpl")

        template.partie = partie
        template.benutzer = ben
        template.letzterZug = letzterZug

        return str(template)

    @cherrypy.expose    
    def spielzug(self, partienummer, nameSchwarz, nameWeiss, zugnummer, stand, standVorher, spielfarbe, amZug, letzterZug="True"):
        """
        Führt einen Spielzug aus
        """
        ben = self.pruefeAngemeldet()
        partie = Partie.suchen(partienummer)
        # Passt die Nummer des Spielzugs zur gespeicherten Partie?
        if int(zugnummer) == len(partie.zuege):
            partie.fuegeZugHinzu(stand)
        else:
            # Nein: die Session ist ungültig
            raise cherrypy.HTTPRedirect("/Anmeldung/")
            
        cherrypy.session["partie"] = partie
        return self.holeStand()
