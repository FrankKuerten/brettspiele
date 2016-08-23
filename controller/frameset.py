#!/usr/bin/env python

class Frameset(object):

    def index(self):
        return """
<html>
    <head>
        <title>Abalone</title>
    </head>
    <frameset cols="100%,*" border=0 frameborder=0 framespacing=0>
        <frame src="/Anmeldung/" name="Haupt" noresize>
        <frame src="about:blank" name="Kommunikation">
    </frameset> 
    <body>
    </body>
</html>
        """
    index.exposed = True
