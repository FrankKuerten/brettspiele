#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import os
import cherrypy
from controller.abstrakterController import AbstrakterController
from Quarto.model.Partie import Partie


class SpielBrett(AbstrakterController):

    APPDIR = os.path.dirname(os.path.abspath(__file__))

    @cherrypy.expose
    def index(self):
        """
        Seite wird mit Cheetah aufbereitet und ausgegeben
        """
        self.pruefeAngemeldet()        
        template = self.getTemplate("spielBrett.tmpl")

        return str(template)
    
    @cherrypy.expose    
    def holeStandJSON(self):
        """
        Gibt den Stand im JSON-Format aus
        """
        ben = self.pruefeAngemeldet()
        partie = self.getSession().get("partie")
        partie = Partie.suchen(partie.nummer)
        template = self.getTemplate("spielStandJSON.tmpl")

        template.partie = partie
        template.benutzer = ben
        template.zugnummer = len(partie.zuege)
        template.spielfarbe = ""
        if ben.name == partie.schwarz:
            template.spielfarbe = "s"
        if ben.name == partie.weiss:
            template.spielfarbe = "w"
        if template.zugnummer % 4 == 0 or (template.zugnummer + 1) % 4 == 0:
            template.amZug = "s"
        else:
            template.amZug = "w"

        return str(template)

    @cherrypy.expose    
    def spielzug(self, partienummer, zugnummer, stand, beendet):
        """
        Führt einen Spielzug aus
        """
        self.pruefeAngemeldet()
        partie = Partie.suchen(partienummer)
        partie.beendet = beendet
        # Passt die Nummer des Spielzugs zur gespeicherten Partie?
        if int(zugnummer) == len(partie.zuege):
            partie.fuegeZugHinzu(stand)
        else:
            # Nein: die Session ist ungültig
            raise cherrypy.HTTPRedirect("/Anmeldung/")
            
        self.getSession()["partie"] = partie
        return self.holeStandJSON()
