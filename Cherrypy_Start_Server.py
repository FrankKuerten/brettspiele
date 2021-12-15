#!/usr/bin/python
# -*- coding: utf-8 -*-
# Script zum Starten der Anwendung Abalone auf CherryPy-WebServer

import os
import sys
import requests
from subprocess import call
from vsgui.api import ask_passwd, ask_yesno
from ftplib import FTP
from Cheetah.Template import Template


def main():
    os.chdir(sys.path[0])
    internet = ask_yesno('Start im Internet?', n='Nur lokal', y='Ja')
 
    if internet:
        passwort = ask_passwd('FTP-Passwort für frank-kuerten.de')
        # Upload der IP-Adresse
        makeContent()
        transfer('content.html', passwort)

    # Start CherryPy
    try:
        call('./start.py')
    except Exception as ex:
        print(ex)
        pass

    if internet:
        # Upload des Hinweis 'Nicht verfügbar'
        transfer('sorry.html', passwort)

    sys.exit(0)


def transfer(filename, pwd):
    ftp = FTP('frank-kuerten.de')
    ftp.login('p7265746', pwd)
    ftp.cwd('Abalone')
    ftp.set_pasv(True)
    cont = open(filename, 'rb')
    ftp.storlines('STOR content.html', cont) 
    cont.close()
    ftp.quit()


def makeContent():
    ip = requests.get('http://frank-kuerten.de/hello')
    template = Template(file=os.path.join(sys.path[0], "content.tmpl"))
    template.ip = ip.text

    with open('content.html', 'w') as html:
        html.write(str(template))


if __name__ == '__main__':
    main()
