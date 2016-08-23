#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import os
import cherrypy

from controller.anmeldung import Anmeldung
from controller.registrierung import Registrierung
from controller.profilAenderung import ProfilAenderung
from controller.partienAuswahl import PartienAuswahl
from Abalone.controller.partienAuswahl import PartienAuswahl as AbalonePartienAuswahl
from Abalone.controller.spielBrett import SpielBrett as AbaloneSpielBrett
from Quarto.controller.partienAuswahl import PartienAuswahl as QuartoPartienAuswahl
from Quarto.controller.spielBrett import SpielBrett as QuartoSpielBrett

APPDIR = os.path.dirname(os.path.abspath(__file__))
INI_FILENAME = os.path.join(APPDIR, "start.conf")
    
def main():
    cherrypy.config.update(INI_FILENAME)
    root = Anmeldung()
    root.Anmeldung = Anmeldung()
    root.Registrierung = Registrierung()
    root.ProfilAenderung = ProfilAenderung()
    root.PartienAuswahl = PartienAuswahl()
    root.Abalone = AbalonePartienAuswahl()
    root.Abalone.PartienAuswahl = AbalonePartienAuswahl()
    root.Abalone.SpielBrett = AbaloneSpielBrett()
    root.Quarto = QuartoPartienAuswahl()
    root.Quarto.PartienAuswahl = QuartoPartienAuswahl()
    root.Quarto.SpielBrett = QuartoSpielBrett()

    app = cherrypy.tree.mount(root, "/", INI_FILENAME)

    # cherrypy.server.quickstart(app)
    
    # cherrypy.server.start()
    cherrypy.engine.start()
    cherrypy.engine.block()

if __name__ == "__main__":
    main()
