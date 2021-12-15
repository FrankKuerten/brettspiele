#!/usr/bin/python

import crypt
import datetime
import os.path
import sqlite3


class Benutzer:
    """
    Registrierter Benutzer
    """
    
    # Objekte werden im selben Verzeichnis gespeichert, wie das .py File
    dbpfad = os.path.join(os.path.dirname(__file__), "Benutzer.db")
    
    def __init__(self, name="", passwort="", mailAdresse="", datumAngelegt=datetime.datetime.now()):
        self.name = name
        self.passwort = crypt.crypt(passwort)
        self.mailAdresse = mailAdresse
        self.datumAngelegt = datumAngelegt

    def speichern(self):
        """
        Speichert das Objekt in db
        """
        if self.name != "":
            conn = sqlite3.connect(Benutzer.dbpfad)
            cur = conn.cursor()
            cur.execute("INSERT OR REPLACE INTO benutzer VALUES (?,?,?,?)",
                        (self.name, self.passwort, self.mailAdresse, self.datumAngelegt, ))
            conn.commit()
            conn.close()

    @classmethod
    def alleLesen(cls):
        """
        Liest alle Benutzer
        """
        query = "SELECT * FROM benutzer"
        return Benutzer.sucheDB(query, [])

    @classmethod        
    def suchen(cls, name):
        """
        Sucht einen Benutzer mit Key
        
        returns Benutzer | None
        """
        query = "SELECT * FROM benutzer WHERE name = ?"
        liste = Benutzer.sucheDB(query, [name])
        if len(liste) > 0:
            return liste[0]
        return None
     
    def pruefePasswort(self, passwort):
        """
        Prueft das uebergebene Passwort
        Das Objekt muss vorher aus dbm ermittelt worden sein
        
        returns Boolean True = OK, False = Passwort falsch
        """
        pwc = crypt.crypt(passwort, self.passwort)
        if pwc == self.passwort:
            return True
        else:
            return False

    @classmethod
    def cryptPasswort(cls, passwort):
        """
        Verschluesselt das uebergebene Passwort
        
        returns encrypted PW
        """
        return crypt.crypt(passwort)
        
    def loeschen(self):
        """
        Loescht ein Objekt mit Key
        """
        conn = sqlite3.connect(Benutzer.dbpfad)
        cur = conn.cursor()
        cur.execute("DELETE FROM benutzer WHERE name = ?", (self.name,))
        conn.commit()
        conn.close()

    def printMe(self):
        """
        Gibt die Attribute aus 
        """
        print(self.name, self.passwort, self.mailAdresse, self.datumAngelegt)

    @classmethod        
    def sucheDB(cls, query, krit):
        """
        Sucht Benutzer
        
        returns set
        """
        liste = []
        with sqlite3.connect(Benutzer.dbpfad) as conn:
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            for row in cur.execute(query, krit):
                b = Benutzer.mapRow(row)
                liste.append(b)
        return liste

    @classmethod
    def mapRow(cls, row):
        """
        Fuellt die Attribute aus einer Cursor-Row
        returns Benutzer
        """
        b = Benutzer(row["name"], "", row["mailAdresse"], row["datumAngelegt"])
        b.passwort = row["passwort"]
        return b
             

if __name__ == '__main__':

    print("Pfad", Benutzer.dbpfad)
    conn = sqlite3.connect(Benutzer.dbpfad)
    cur = conn.cursor()
    """
    cur.execute("CREATE TABLE benutzer (name text unique, passwort text, mailAdresse text, datumAngelegt timestamp)")
    conn.commit()
    conn.close()
    
    """
    b = Benutzer.suchen("XYZ")
    b.passwort = crypt.crypt("hier neues PW")
    b.speichern()
    print("Update XYZ", b.printMe())
