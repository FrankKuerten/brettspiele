#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import os
import cherrypy
from Cheetah.Template import Template


class AbstrakterController:

    APPDIR = os.path.dirname(os.path.abspath(__file__))
    
    def getSession(self):
        """
        returns aktive session
        """
        return cherrypy.session

    def pruefeAngemeldet(self):
        """
        Es wird geprüft, ob der Benutzer in der Session angemeldet ist,
        andernfalls wird zur Anmeldeseite weitergeleitet
        
        returns Benutzer
        """
        ben = self.getSession().get("benutzer")
        if ben is None or ben.name is None or ben.name == "":
            raise cherrypy.HTTPRedirect("/Anmeldung/")
            
        return ben
        
    def alleSessionAttribute(self, key):
        """
        Ermittelt alle Attribute zu aktiven Sessions mit vorgegebenem key
        Je nach verwendeter Sessionart wird eine 
        Ram oder File spezifische Methode aufgerufen
        
        returns List
        """
        session = self.getSession()
            
        # if isinstance(session, cherrypy.lib.sessions.RamSession):
        if hasattr(session, "cache"):
            return self.alleSessionAttributeRam(session, key)
            
        # if isinstance(session, cherrypy.lib.sessions.FileSession):
        if hasattr(session, "storage_path"):
            return self.alleSessionAttributeFile(session, key)
            
        return []
    
    def alleSessionAttributeRam(self, session, key):
        """
        Ermittelt alle angemeldeten Benutzernamen.
        Hierbei wird eine RamSession vorausgesetzt
        
        returns List
        """
        alleAttribute = []
        # Der cache ist ein Dictionary,
        # Key ist die sessionId, Value ist ein Tupel
        for sid, (sess, verfallsdatum) in session.cache.items():
            # das Tupel besteht aus zwei Elementen, 
            # 0 ist die Session
            # 1 ist das Verfallsdatum (datetime)
            obj = sess.get(key)
            alleAttribute.append(obj)
        return alleAttribute
        
    def alleSessionAttributeFile(self, session, key):
        """
        Ermittelt alle angemeldeten Benutzernamen.
        Hierbei wird eine FileSession vorausgesetzt
        
        returns List
        """
        alleAttribute = []
        # Iteriert über alle Sessiondateien in self.storage_path
        for fname in os.listdir(session.storage_path):
            if fname.startswith(session.SESSION_PREFIX) and not fname.endswith(".lock"):
                # Datei wird mit _load entpickelt
                path = os.path.join(session.storage_path, fname)
                contents = session._load(path)
                # _load liefert None bei IOError
                if contents is not None:
                    sess, verfallsdatum = contents
                    obj = sess.get(key)
                    alleAttribute.append(obj)
        return alleAttribute
        
    def getTemplate(self, viewname):
        """
        Ermittelt das Cheetah-Template
        
        returns Template
        """
        filename = os.path.join(self.APPDIR, "../view/", viewname)
        return Template(file=filename)
