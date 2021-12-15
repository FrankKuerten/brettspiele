import os
import sys

import atexit
import cherrypy

from controller.anmeldung import Anmeldung
from controller.registrierung import Registrierung
from controller.profilAenderung import ProfilAenderung
from controller.partienAuswahl import PartienAuswahl
from Abalone.controller.partienAuswahl import PartienAuswahl as AbalonePartienAuswahl
from Abalone.controller.spielBrett import SpielBrett as AbaloneSpielBrett
from Quarto.controller.partienAuswahl import PartienAuswahl as QuartoPartienAuswahl
from Quarto.controller.spielBrett import SpielBrett as QuartoSpielBrett

sys.stdout = sys.stderr
APPDIR = os.getcwd()
INI_FILENAME = os.path.join(APPDIR, "start.conf")

cherrypy.config.update(INI_FILENAME)
cherrypy.config.update({'environment': 'embedded'})

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

# application = cherrypy.Application(root, script_name='', config=None)

application = cherrypy.tree.mount(root, "/", INI_FILENAME)

if cherrypy.__version__.startswith('3.0') and cherrypy.engine.state == 0:
    cherrypy.engine.start(blocking=False)
    atexit.register(cherrypy.engine.stop)
