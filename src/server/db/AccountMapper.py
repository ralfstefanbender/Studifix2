from server.bo.Account import Account
from server.db.Mapper import Mapper


class AccountMapper (Mapper):
    """Mapper-Klasse, die Account-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können. Das Mapping ist bidirektional. D.h., Objekte können
    in DB-Strukturen und DB-Strukturen in Objekte umgewandelt werden.
    """

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Konten.

        :return Eine Sammlung mit Account-Objekten, die sämtliche Konten
                repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT id, owner from accounts")
        tuples = cursor.fetchall()

        for (id, owner) in tuples:
            account = Account()
            account.set_id(id)
            account.set_owner(owner)
            result.append(account)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_owner_id(self, owner_id):
        """Auslesen aller Konten eines durch Fremdschlüssel (Kundennr.) gegebenen Kunden.

        :param owner_id Schlüssel des zugehörigen Kunden.
        :return Eine Sammlung mit Account-Objekten, die sämtliche Konten des
                betreffenden Kunden repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, owner FROM accounts WHERE owner={} ORDER BY id".format(owner_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, owner) in tuples:
            account = Account()
            account.set_id(id)
            account.set_owner(owner)
            result.append(account)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Suchen eines Kontos mit vorgegebener Kontonummer. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param id Primärschlüsselattribut (->DB)
        :return Konto-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, owner FROM accounts WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        if tuples[0] is not None:
            (id, owner) = tuples[0]
            account = Account()
            account.set_id(id)
            account.set_owner(owner)

        result = account

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, account):
        """Einfügen eines Account-Objekts in die Datenbank.
        
        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.

        :param account das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM accounts ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            account.set_id(maxid[0]+1)

        command = "INSERT INTO accounts (id, owner) VALUES (%s,%s)"
        data = (account.get_id(), account.get_owner())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return account

    def update(self, account):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param account das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE accounts " + "SET owner=%s WHERE id=%s"
        data = (account.get_owner(), account.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, account):
        """Löschen der Daten eines Account-Objekts aus der Datenbank.

        :param account das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM accounts WHERE id={}".format(account.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

"""Zu Testzwecken können wir diese Datei bei Bedarf auch ausführen, 
um die grundsätzliche Funktion zu überprüfen.

Anmerkung: Nicht professionell aber hilfreich..."""
if (__name__ == "__main__"):
    with AccountMapper() as mapper:
        result = mapper.find_all()
        for p in result:
            print(p)
