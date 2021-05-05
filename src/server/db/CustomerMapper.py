from server.bo.Customer import Customer
from server.db.Mapper import Mapper


class CustomerMapper (Mapper):
    """Mapper-Klasse, die Customer-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können. Das Mapping ist bidirektional. D.h., Objekte können
    in DB-Strukturen und DB-Strukturen in Objekte umgewandelt werden.
    """

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Kunde.

        :return Eine Sammlung mit Customer-Objekten, die sämtliche Kunden
                repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from customers")
        tuples = cursor.fetchall()

        for (id, firstName, lastName) in tuples:
            person = Customer()
            person.set_id(id)
            person.set_first_name(firstName)
            person.set_last_name(lastName)
            result.append(person)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_last_name(self, name):
        """Auslesen aller Kunden anhand des Nachnamen.

        :param name Nachname der zugehörigen Kunden.
        :return Eine Sammlung mit Customer-Objekten, die sämtliche Kunden
            mit dem gewünschten Nachnamen enthält.
        """
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, firstName, lastName FROM customers WHERE lastName LIKE '{}' ORDER BY lastName".format(name)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, firstName, lastName) in tuples:
            person = Customer()
            person.set_id(id)
            person.set_first_name(firstName)
            person.set_last_name(lastName)
            result.append(person)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Suchen eines Kunden mit vorgegebener Kundennummer. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param key Primärschlüsselattribut (->DB)
        :return Customer-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, firstName, lastName FROM customers WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, firstName, lastName) = tuples[0]
            person = Customer()
            person.set_id(id)
            person.set_first_name(firstName)
            person.set_last_name(lastName)
            result = person
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, person):
        """Einfügen eines Customer-Objekts in die Datenbank.

        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.

        :param person das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM customers ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            person.set_id(maxid[0]+1)

        """
        Eine Möglichkeit, ein INSERT zu erstellen, ist diese:
            cursor.execute("INSERT INTO persons (id, firstName, lastName) VALUES ('{}','{}','{}')"
                           .format(person.get_id(),person.get_first_name(),person.get_last_name()))
        Dabei wird auf String-Formatierung zurückgegriffen.
        """
        """
        Eine andere Möglichkeit, ist diese:
        """
        command = "INSERT INTO customers (id, firstName, lastName) VALUES (%s,%s,%s)"
        data = (person.get_id(), person.get_first_name(), person.get_last_name())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return person

    def update(self, person):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param person das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE customers " + "SET firstName=%s, lastName=%s WHERE id=%s"
        data = (person.get_first_name(), person.get_last_name(), person.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self,person):
        """Löschen der Daten eines Customer-Objekts aus der Datenbank.

        :param person das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM customers WHERE id={}".format(person.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


"""Zu Testzwecken können wir diese Datei bei Bedarf auch ausführen, 
um die grundsätzliche Funktion zu überprüfen.

Anmerkung: Nicht professionell aber hilfreich..."""
if (__name__ == "__main__"):
    with CustomerMapper() as mapper:
        result = mapper.find_all()
        for p in result:
            print(p)
