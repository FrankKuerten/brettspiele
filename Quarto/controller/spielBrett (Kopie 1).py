#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import os
import cherrypy
from Cheetah.Template import Template
from Quarto.controller.partienAuswahl import PartienAuswahl
from controller.abstrakterController import AbstrakterController
from model.Benutzer import Benutzer
from Quarto.model.Partie import Partie

class SpielBrett(AbstrakterController):

    APPDIR = os.path.dirname(os.path.abspath(__file__))

    @cherrypy.expose
    def index(self):
        """
        Seite wird mit Cheetah aufbereitet und ausgegeben
        """
        ben = self.pruefeAngemeldet()        
        template = self.getTemplate("spielBrett.tmpl")

        return str(template)

    @cherrypy.expose    
    def holeStand(self):
        """
        Gibt den Stand im Kommunikationsframe aus
        """
        ben = self.pruefeAngemeldet()
        partie = cherrypy.session.get("partie")
        partie = Partie.suchen(partie.nummer)
        template = self.getTemplate("pollFrame.tmpl")

        template.partie = partie
        template.benutzer = ben

        return str(template)

    @cherrypy.expose    
    def spielzug(self, partienummer, nameSchwarz, nameWeiss, zugnummer, stand, spielfarbe, amZug, beendet):
        """
        Führt einen Spielzug aus
        """
        ben = self.pruefeAngemeldet()
        partie = Partie.suchen(partienummer)
	partie.beendet = beendet
        # Passt die Nummer des Spielzugs zur gespeicherten Partie?
        if int(zugnummer) == len(partie.zuege):
            partie.fuegeZugHinzu(stand)
        else:
            # Nein: die Session ist ungültig
            raise cherrypy.HTTPRedirect("/Anmeldung/")
            
        cherrypy.session["partie"] = partie
        return self.holeStand()
