#!/usr/bin/env python
# -*- coding: UTF-8 -*-

from model.Partie import Partie
from Abalone.model.Partie import Partie as neu
                     
if __name__ == '__main__':

    liste = Partie.alleLesen()
    for b in liste:
        print(b.nummer, b.schwarz, b.weiss, b.punkteSchwarz, b.punkteWeiss, b.zeitGestartet, b.zuege)
        a = neu()
        a.nummer = b. nummer
        a.schwarz = b.schwarz
        a.weiss = b.weiss
        a.punkteSchwarz = b.punkteSchwarz
        a.punkteWeiss = b.punkteWeiss
        a.zeitGestartet = b.zeitGestartet
        a.zuege = b.zuege
        a.speichern()
