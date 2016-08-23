# Brettspiele

Brettspiele als WebService auf CherryPy Server

Dieser WebService stellt Brettspiele bereit, derzeit Abalone und Quarto.
Die Spiele bieten eine Oberfläche, die mit JavaScript animiert ist. Quarto wird mit
Hilfe von http://threejs.org/ in 3D dargestellt.
Der Server ist in Python mit Hilfe von http://www.cherrypy.org/ implementiert. 
Templates werden mit Cheetah aufbereitet.
Benutzer und Partien werden in SQLite gespeichert.
