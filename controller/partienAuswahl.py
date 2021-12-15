#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import os
import cherrypy
from controller.abstrakterController import AbstrakterController


class PartienAuswahl(AbstrakterController):
    
    APPDIR = os.path.dirname(os.path.abspath(__file__))

    @cherrypy.expose
    def index(self, name="", aktive=False, fehler="", partien=[]):
        """
        Seite wird mit Cheetah aufbereitet und ausgegeben
        """
        spiel = self.getSession().get("spiel")
        if spiel == "Abalone":
            raise cherrypy.HTTPRedirect("/Abalone/PartienAuswahl/")
        if spiel == "Quarto":
            raise cherrypy.HTTPRedirect("/Quarto/PartienAuswahl/")
