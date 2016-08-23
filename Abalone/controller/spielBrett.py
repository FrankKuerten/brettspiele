#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import os
import cherrypy
from controller.abstrakterController import AbstrakterController
from Abalone.model.Partie import Partie

class SpielBrett(AbstrakterController):

    APPDIR = os.path.dirname(os.path.abspath(__file__))

    @cherrypy.expose
    def index(self):
        """
        Seite wird mit Cheetah aufbereitet und ausgegeben
        """
        self.pruefeAngemeldet()        
        template = self.getTemplate("spielBrett.tmpl")
        template.letzterZug = "True"

        return str(template)

    @cherrypy.expose    
    def holeStandJSON(self, letzterZug="True"):
        """
        Gibt den Stand im JSON-Format aus
        """
        ben = self.pruefeAngemeldet()
        partie = self.getSession().get("partie")
        partie = Partie.suchen(partie.nummer)
        template = self.getTemplate("pollFrameJSON.tmpl")

        template.partie = partie
        template.benutzer = ben
        template.letzterZug = letzterZug
        template.zugnummer = len(partie.zuege)
        template.standVorher = ""
        if letzterZug == "True":
            template.stand = partie.zuege[-1]
            if len(partie.zuege) > 1:
                template.standVorher = partie.zuege[-2]
        else:
            template.stand = partie.zuege
        template.spielfarbe = ""
        if ben.name == partie.schwarz:
            template.spielfarbe = "s"
        if ben.name == partie.weiss:
            template.spielfarbe = "w"
        if template.zugnummer % 2 == 0:
            template.amZug = "w"
        else:
            template.amZug = "s"

        return str(template)

    @cherrypy.expose    
    def spielzug(self, partienummer, zugnummer, stand):
        """
        Führt einen Spielzug aus
        """
        self.pruefeAngemeldet()
        partie = Partie.suchen(partienummer)
        # Passt die Nummer des Spielzugs zur gespeicherten Partie?
        if int(zugnummer) == len(partie.zuege):
            partie.fuegeZugHinzu(stand)
        else:
            # Nein: die Session ist ungültig
            raise cherrypy.HTTPRedirect("/Anmeldung/")
            
        self.getSession()["partie"] = partie
        return self.holeStandJSON()
