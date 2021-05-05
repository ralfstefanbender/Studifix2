from server.bo.Transaction import Transaction
from server.db.Mapper import Mapper


class TransactionMapper (Mapper):
    """Mapper-Klasse, die Transaction-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können. Das Mapping ist bidirektional. D.h., Objekte können
    in DB-Strukturen und DB-Strukturen in Objekte umgewandelt werden.
    """

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Buchungen.

        :return Eine Sammlung mit Transaction-Objekten, die sämtliche Buchungen
                des Systems repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()

        cursor.execute("SELECT id, sourceAccount, targetAccount, amount from transactions")
        tuples = cursor.fetchall()

        for (id, sourceAccount, targetAccount, amount) in tuples:
            transaction = Transaction()
            transaction.set_id(id)
            transaction.set_source_account(sourceAccount)
            transaction.set_target_account(targetAccount)
            transaction.set_amount(amount)
            result.append(transaction)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_source_account_id(self, account_id):
        """Auslesen aller Buchungen eines durch Fremdschlüssel (Kontonr.) gegebenen Quell-Kontos.

        :param account_id Schlüssel des zugehörigen Kontos.
        :return Eine Sammlung mit Transaction-Objekten.
        """

        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, sourceAccount, targetAccount, amount FROM transactions WHERE sourceAccount={} ORDER BY id".format(account_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, sourceAccount, targetAccount, amount) in tuples:
            transaction = Transaction()
            transaction.set_id(id)
            transaction.set_source_account(sourceAccount)
            transaction.set_target_account(targetAccount)
            transaction.set_amount(amount)
            result.append(transaction)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_target_account_id(self, account_id):
        """Auslesen aller Buchungen eines durch Fremdschlüssel (Kontonr.) gegebenen Ziel-Kontos.

        :param account_id Schlüssel des zugehörigen Kontos.
        :return Eine Sammlung mit Transaction-Objekten.
        """
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, sourceAccount, targetAccount, amount FROM transactions WHERE targetAccount={} ORDER BY id".format(account_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, sourceAccount, targetAccount, amount) in tuples:
            transaction = Transaction()
            transaction.set_id(id)
            transaction.set_source_account(sourceAccount)
            transaction.set_target_account(targetAccount)
            transaction.set_amount(amount)
            result.append(transaction)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Suchen einer Buchung mit vorgegebener Nummer. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param key Primärschlüsselattribut (->DB)
        :return Transaction-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, sourceAccount, targetAccount, amount FROM transactions WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        if tuples is not None \
                and len(tuples) > 0 \
                and tuples[0] is not None:
            (id, sourceAccount, targetAccount, amount) = tuples[0]
            transaction = Transaction()
            transaction.set_id(id)
            transaction.set_source_account(sourceAccount)
            transaction.set_target_account(targetAccount)
            transaction.set_amount(amount)

            result = transaction
        else:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, transaction):
        """Einfügen eines Transaction-Objekts in die Datenbank.

        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.

        :param transaction das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM transactions ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            transaction.set_id(maxid[0] + 1)

        command = "INSERT INTO transactions (id, sourceAccount, targetAccount, amount) VALUES (%s,%s,%s,%s)"
        data = (transaction.get_id(),
                transaction.get_source_account(),
                transaction.get_target_account(),
                transaction.get_amount())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return transaction

    def update(self, transaction):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param transaction das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE transactions " + "SET sourceAccount=%s, targetAccount=%s, amount=%s WHERE id=%s"
        data = (transaction.get_source_account(),
                transaction.get_target_account(),
                transaction.get_amount(),
                transaction.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, transaction):
        """Löschen der Daten eines Transaction-Objekts aus der Datenbank.

        :param transaction das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM transactions WHERE id={}".format(transaction.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


"""Zu Testzwecken können wir diese Datei bei Bedarf auch ausführen, 
um die grundsätzliche Funktion zu überprüfen.

Anmerkung: Nicht professionell aber hilfreich..."""
if (__name__ == "__main__"):
    with TransactionMapper() as mapper:
        result = mapper.find_all()
        for t in result:
            print(t)
