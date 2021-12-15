#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import datetime
import os.path
import sqlite3


class Partie:
    """
    Quarto Partie
    """
    
    # Objekte werden im selben Verzeichnis gespeichert, wie das .py File
    dbpfad = os.path.join(os.path.dirname(__file__), "Partie.db")
    
    def __init__(self, nummer=None, schwarz="", weiss="", zeitGestartet=None, beendet=0):
        self.nummer = nummer
        self.schwarz = schwarz
        self.weiss = weiss
        self.zeitGestartet = zeitGestartet
        self.beendet = beendet
        self.zuege = []

    @classmethod
    def neuePartie(cls, schwarz="", weiss=""):
        p = Partie(None, schwarz, weiss, datetime.datetime.now())
        return p
        
    def speichern(self):
        """
        Speichert das Objekt in db
        """
        conn = sqlite3.connect(Partie.dbpfad)  # @UndefinedVariable
        cur = conn.cursor()
        cur.execute("INSERT OR REPLACE "
                    "INTO partie "
                    "(nummer, schwarz, weiss, zeitGestartet, beendet) "
                    "VALUES (?,?,?,?,?)", 
                    (self.nummer, self.schwarz, self.weiss, self.zeitGestartet, self.beendet, ))
        if self.nummer is None:
            self.nummer = cur.lastrowid
        if len(self.zuege) > 0:
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
        query = "SELECT * FROM partie WHERE beendet = 0"
        krit = []
        if name is not None and name != "":
            query += " AND (schwarz = ? OR weiss = ?)"
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
        self.zuege.append(zug)
        self.speichern()

    def printMe(self):
        """
        Gibt die Attribute aus 
        """
        print("Partie-Nr.:", self.nummer, ",Schwarz:", self.schwarz, ", Weiss:", self.weiss)
        print(", beendet:", self.beendet, ", gestartet:", self.zeitGestartet)
        print(self.zuege)

    @classmethod
    def mapRow(cls, row):
        """
        Fuellt die Attribute aus einer Cursor-Row
        returns Partie
        """
        p = Partie(row["nummer"], row["schwarz"], row["weiss"], 
                   row["zeitGestartet"], row["beendet"])
        return p

    def mapZugRow(self, row):
        """
        Fuellt die Attribute aus einer Cursor-Row und fuegt einen Zug an die Partie an
        returns Partie
        """
        self.zuege.append(row["zug"])
        return self


if __name__ == '__main__':

    print("Pfad", Partie.dbpfad)
    """
    conn = sqlite3.connect(Partie.dbpfad)
    cur = conn.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS partie "
                "(nummer integer PRIMARY KEY ASC NOT NULL, "
                "schwarz text, "
                "weiss text, "
                "beendet integer, "
                "zeitGestartet timestamp)")
    cur.execute("CREATE TABLE IF NOT EXISTS zug "
                "(partieNummer integer, "
                "zugNummer integer, "
                "zug text, "
                "PRIMARY KEY (partieNummer ASC, zugNummer ASC))")
    conn.commit()
    conn.close()

    conn = sqlite3.connect(Partie.dbpfad)
    conn.text_factory = str
    cur = conn.cursor()
    cur.execute("DELETE FROM partie")
    cur.execute("DELETE FROM zug")
    conn.commit()
    conn.close()
    b = Partie.neuePartie("Frank", "F2")
    b.fuegeZugHinzu(12)
    b.fuegeZugHinzu(9)
    b.fuegeZugHinzu(5)
    b.fuegeZugHinzu(6)
    b.fuegeZugHinzu(13)
    """
    conn = sqlite3.connect(Partie.dbpfad)  # @UndefinedVariable
    conn.text_factory = str
    cur = conn.cursor()
    for row in cur.execute("SELECT * FROM partie"):
        print(row)
    for row in cur.execute("SELECT * FROM zug"):
        print(row)

    conn.commit()
    conn.close()

    liste1 = Partie.alleLesen()
    for b in liste1:
        b.printMe()
    
    """
    # cur.execute("DELETE FROM partie WHERE nummer = 3")
    # cur.execute("DELETE FROM zug WHERE partieNummer = 3")
    """