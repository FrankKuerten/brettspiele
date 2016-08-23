#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import datetime
import os.path
import sqlite3

class Partie():
    """
    Abalone Partie
    """
    
    # Objekte werden im selben Verzeichnis gespeichert, wie das .py File
    dbpfad = os.path.join(os.path.dirname(__file__), "Partie.db")
    
    def __init__(self, nummer=None, schwarz="", weiss="", 
                 punkteSchwarz=0, punkteWeiss=0, zeitGestartet=None ):
        self.nummer = nummer
        self.schwarz = schwarz
        self.weiss = weiss
        self.punkteSchwarz = punkteSchwarz
        self.punkteWeiss = punkteWeiss
        self.zeitGestartet = zeitGestartet
        self.zuege = []

    @classmethod
    def neuePartie(cls, schwarz="", weiss=""):
        p = Partie(None, schwarz, weiss, 0, 0, datetime.datetime.now())
        grundStellung = "400501602703804310411512613714815422523624264365466073174275376477578084185286387488"
        p.fuegeZugHinzu(grundStellung)
        return p
        
    def speichern(self):
        """
        Speichert das Objekt in db
        """
        conn = sqlite3.connect(Partie.dbpfad)  # @UndefinedVariable
        cur = conn.cursor()
        cur.execute("INSERT OR REPLACE "
                    "INTO partie "
                    "(nummer, schwarz, weiss, punkteSchwarz, punkteWeiss, zeitGestartet) "
                    "VALUES (?,?,?,?,?,?)", 
                    (self.nummer, self.schwarz, self.weiss, 
                    self.punkteSchwarz, self.punkteWeiss, self.zeitGestartet, ))
        if self.nummer == None:
            self.nummer = cur.lastrowid
        cur.execute("INSERT OR REPLACE "
                    "INTO zug "
                    "(partieNummer, zugNummer, zug) "
                    "VALUES (?,?,?)", 
                    (self.nummer, len(self.zuege), self.zuege[-1], ))
        conn.commit()
        conn.close()

    @classmethod
    def alleLesen(cls):
        """
        Liest alle Partien
        
        returns set
        """
        query = "SELECT * FROM partie"
        return Partie.sucheDB(query, [])

    @classmethod        
    def suchen(cls, nummer):
        """
        Sucht eine Partie mit Key
        
        returns Partie | None
        """
        query = "SELECT * FROM partie WHERE nummer = ?"
        liste = Partie.sucheDB(query, [nummer])
        if len(liste) > 0:
            return liste[0]
        return None
    
    @classmethod
    def sucheName(cls, name):
        """
        Sucht Partien mit Benutzername (schwarz oder weiss)
        
        returns set
        """
        query = "SELECT * FROM partie WHERE schwarz = ? OR weiss = ?"
        return Partie.sucheDB(query, [name, name])

    @classmethod
    def sucheAktive(cls, name):
        """
        Sucht aktive Partien ggf. mit Benutzername (schwarz oder weiss)
        
        returns set
        """
        query = "SELECT * FROM partie WHERE punkteSchwarz < 6 AND punkteWeiss < 6"
        krit = []
        if name != None and name != "":
            query+=" AND (schwarz = ? OR weiss = ?)"
            krit.append(name)
            krit.append(name)
        return Partie.sucheDB(query, krit)

    @classmethod
    def sucheDB(cls, query, krit):
        """
        Sucht eine oder mehrere Partien
        
        returns set
        """
        liste = []
        with sqlite3.connect(Partie.dbpfad) as conn:  # @UndefinedVariable
            conn.text_factory = str
            conn.row_factory = sqlite3.Row  # @UndefinedVariable
            cur1 = conn.cursor()
            cur2 = conn.cursor()
            zQuery = "SELECT * FROM zug WHERE partieNummer = ? ORDER BY zugNummer"
            for row in cur1.execute(query, krit):
                p = Partie.mapRow(row)
                for zrow in cur2.execute(zQuery, (p.nummer,)):
                    p.mapZugRow(zrow)
                liste.append(p)
        return liste
               
    def loeschen(self):
        """
        Loescht ein Objekt mit Key
        Das Objekt muss vorher aus dbm ermittelt worden sein
        """
        conn = sqlite3.connect(Partie.dbpfad)  # @UndefinedVariable
        cur = conn.cursor()
        cur.execute("DELETE FROM partie WHERE nummer = ?", (self.nummer,))
        cur.execute("DELETE FROM zug WHERE zugNummer = ?", (self.nummer,))
        conn.commit()
        conn.close()
        
    def fuegeZugHinzu(self, zug):
        """
        Fügt einer Partie einen neuen Spielzug hinzu.
        """
        self.punkteSchwarz = 0
        self.punkteWeiss = 0
        
        for i in range(1, len(zug), 3):
            if zug[i] == '9': # y-Koordinate ist 9 -> Kugel ist aus
                if i < 42:    # Magische Douglas-Adams-Konstante :D
                    self.punkteSchwarz += 1
                else:
                    self.punkteWeiss += 1

        self.zuege.append(zug)
        self.speichern()

    def printMe(self):
        """
        Gibt die Attribute aus 
        """
        print "Partie-Nr.:", self.nummer, ",Schwarz:", self.schwarz, ", Weiss:", self.weiss
        print "Spielstand:", self.punkteSchwarz, " zu ", self.punkteWeiss, ", gestartet:", self.zeitGestartet
        print self.zuege

    @classmethod
    def mapRow(cls, row):
        """
        Fuellt die Attribute aus einer Cursor-Row
        returns Partie
        """
        p = Partie(row["nummer"], row["schwarz"], row["weiss"], 
                   row["punkteSchwarz"], row["punkteWeiss"], row["zeitGestartet"])
        return p

    def mapZugRow(self, row):
        """
        Fuellt die Attribute aus einer Cursor-Row und fuegt einen Zug an die Partie an
        returns Partie
        """
        self.zuege.append(row["zug"])
        return self

if __name__ == '__main__':

    print "Pfad" , Partie.dbpfad
    """
    conn = sqlite3.connect(Partie.dbpfad)
    cur = conn.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS partie "
                "(nummer integer PRIMARY KEY ASC NOT NULL, "
                "schwarz text, "
                "weiss text, "
                "punkteSchwarz integer, "
                "punkteWeiss integer, "
                "zeitGestartet timestamp)")
    cur.execute("CREATE TABLE IF NOT EXISTS zug "
                "(partieNummer integer, "
                "zugNummer integer, "
                "zug text, "
                "PRIMARY KEY (partieNummer ASC, zugNummer ASC))")
    conn.commit()
    conn.close()

    b = Partie.neuePartie("Frank", "F-rank")
    b = Partie.neuePartie("F-rank", "Frank")
    b = Partie.neuePartie("Frank", "Hammanimi")
    """
    conn = sqlite3.connect(Partie.dbpfad)  # @UndefinedVariable
    conn.text_factory = str
    cur = conn.cursor()
    for row in cur.execute("SELECT * FROM partie"):
        print row
    for row in cur.execute("SELECT * FROM zug"):
        print row

    conn.commit()
    conn.close()

    liste1 = Partie.alleLesen()
    for b in liste1:
        b.printMe()
    
    """
    # cur.execute("DELETE FROM partie WHERE nummer = 3")
    # cur.execute("DELETE FROM zug WHERE partieNummer = 3")

    b = Partie.suchen(2)
    print "Suche Partie 1" , b
    b.printMe()
    b.fuegeZugHinzu("926436546607317427537647757808418528638748840050160270380431041151261371481542252362")
    b.printMe()
    
    b = Partie("x", "y")
    b.nummer = 42
    print "Nicht persistierte Partie 42" , b
    try:
        print "Loeschen von 42:" , b.loeschen()
    except sqlite3.DBNotFoundError:
        print "Objekt wurde nicht gefunden"

    liste2 = Partie.alleLesen()
    for b in liste2:
        b.loeschen()

    liste3 = Partie.alleLesen()
    for b in liste3:
        b.printMe()

    conn = sqlite3.connect(Partie.dbpfad)
    cur = conn.cursor()
    for row in cur.execute("SELECT * FROM partie"):
        print row
    for row in cur.execute("SELECT * FROM zug"):
        print row
    conn.close()
    """