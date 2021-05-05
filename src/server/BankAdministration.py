from .bo.User import User
from .bo.Customer import Customer
from .bo.Account import Account
from .bo.Transaction import Transaction

from .db.UserMapper import UserMapper
from .db.CustomerMapper import CustomerMapper
from .db.AccountMapper import AccountMapper
from .db.TransactionMapper import TransactionMapper


class BankAdministration (object):
    """Diese Klasse aggregiert nahezu sämtliche Applikationslogik (engl. Business Logic).

    Sie ist wie eine Spinne, die sämtliche Zusammenhänge in ihrem Netz (in unserem
    Fall die Daten der Applikation) überblickt und für einen geordneten Ablauf und
    dauerhafte Konsistenz der Daten und Abläufe sorgt.

    Die Applikationslogik findet sich in den Methoden dieser Klasse. Jede dieser
    Methoden kann als *Transaction Script* bezeichnet werden. Dieser Name
    lässt schon vermuten, dass hier analog zu Datenbanktransaktion pro
    Transaktion gleiche mehrere Teilaktionen durchgeführt werden, die das System
    von einem konsistenten Zustand in einen anderen, auch wieder konsistenten
    Zustand überführen. Wenn dies zwischenzeitig scheitern sollte, dann ist das
    jeweilige Transaction Script dafür verwantwortlich, eine Fehlerbehandlung
    durchzuführen.

    Diese Klasse steht mit einer Reihe weiterer Datentypen in Verbindung. Dies
    sind:
    - die Klassen BusinessObject und deren Subklassen,
    - die Mapper-Klassen für den DB-Zugriff.

    BankAdministration bilden nur die Server-seitige Sicht der
    Applikationslogik ab. Diese basiert vollständig auf synchronen
    Funktionsaufrufen.

    **Wichtiger Hinweis:** Diese Klasse bedient sich sogenannter
    Mapper-Klassen. Sie gehören der Datenbank-Schicht an und bilden die
    objektorientierte Sicht der Applikationslogik auf die relationale
    organisierte Datenbank ab. Zuweilen kommen "kreative" Zeitgenossen auf die
    Idee, in diesen Mappern auch Applikationslogik zu realisieren. Siehe dazu
    auch die Hinweise in der Methode zum Löschen von Customer-Objekten.
    Einzig nachvollziehbares Argument für einen solchen Ansatz ist die Steigerung
    der Performance umfangreicher Datenbankoperationen. Doch auch dieses Argument
    zieht nur dann, wenn wirklich große Datenmengen zu handhaben sind. In einem
    solchen Fall würde man jedoch eine entsprechend erweiterte Architektur realisieren,
    die wiederum sämtliche Applikationslogik in der Applikationsschicht isolieren
    würde. Also: keine Applikationslogik in die Mapper-Klassen "stecken" sondern
    dies auf die Applikationsschicht konzentrieren!

    Es gibt sicherlich noch viel mehr über diese Klasse zu schreiben. Weitere
    Infos erhalten Sie in der Lehrveranstaltung.
    """
    def __init__(self):
        pass

    """
    User-spezifische Methoden
    """
    def create_user(self, name, email, google_user_id):
        """Einen Benutzer anlegen"""
        user = User()
        user.set_name(name)
        user.set_email(email)
        user.set_user_id(google_user_id)
        user.set_id(1)

        with UserMapper() as mapper:
            return mapper.insert(user)

    def get_user_by_name(self, name):
        """Alle Benutzer mit Namen name auslesen."""
        with UserMapper() as mapper:
            return mapper.find_by_name(name)

    def get_user_by_id(self, number):
        """Den Benutzer mit der gegebenen ID auslesen."""
        with UserMapper() as mapper:
            return mapper.find_by_key(number)

    def get_user_by_email(self, email):
        """Alle Benutzer mit gegebener E-Mail-Adresse auslesen."""
        with UserMapper() as mapper:
            return mapper.find_by_email(email)

    def get_user_by_google_user_id(self, id):
        """Den Benutzer mit der gegebenen Google ID auslesen."""
        with UserMapper() as mapper:
            return mapper.find_by_google_user_id(id)

    def get_all_users(self):
        """Alle Benutzer auslesen."""
        with UserMapper() as mapper:
            return mapper.find_all()

    def save_user(self, user):
        """Den gegebenen Benutzer speichern."""
        with UserMapper() as mapper:
            mapper.update(user)

    def delete_user(self, user):
        """Den gegebenen Benutzer aus unserem System löschen."""
        with UserMapper() as mapper:
            mapper.delete(user)


    """
    Customer-spezifische Methoden
    """
    def create_customer(self, first_name, last_name):
        """Einen Kunden anlegen."""
        customer = Customer()
        customer.set_first_name(first_name)
        customer.set_last_name(last_name)
        customer.set_id(1)

        with CustomerMapper() as mapper:
            return mapper.insert(customer)

    def get_customer_by_name(self, last_name):
        """Alle Kunden mit übergebenem Nachnamen auslesen."""
        with CustomerMapper() as mapper:
            return mapper.find_by_last_name(last_name)

    def get_customer_by_id(self, number):
        """Den Kunden mit der gegebenen ID auslesen."""
        with CustomerMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_customers(self):
        """Alle Kunden auslesen."""
        with CustomerMapper() as mapper:
            return mapper.find_all()

    def save_customer(self, customer):
        """Den gegebenen Kunden speichern."""
        with CustomerMapper() as mapper:
            mapper.update(customer)

    def delete_customer(self, customer):
        """Den gegebenen Kunden löschen."""
        with CustomerMapper() as mapper:
            accounts = self.get_accounts_of_customer(customer)

            if not(accounts is None):
                for a in accounts:
                    self.delete_account(a)

            mapper.delete(customer)



    """
    Account-spezifische Methoden
    """
    def get_all_accounts(self):
        """Alle Konten auslesen."""
        with AccountMapper() as mapper:
            return mapper.find_all()

    def get_account_by_id(self, number):
        """Das Konto mit der gegebenen Kontonummer (id) auslesen."""
        with AccountMapper() as mapper:
            return mapper.find_by_key(number)

    def get_accounts_of_customer(self, customer):
        """Alle Konten des gegebenen Kunden auslesen."""
        with AccountMapper() as mapper:
            return mapper.find_by_owner_id(customer.get_id()) # Vorsicht: nicht geprüft!

    def delete_account(self, account):
        """Das gegebene Konto löschen.

        **Hinweise:** Beachten Sie die durch die Verkettung mit anderen Methoden entstehende
        Applikationslogik. Hier werden Abhängigkeiten berücksichtigt, um die refrentielle
        Integrität des Gesamtsystems zu gewährleisten. Ob eine solche *Löschweitergabe* im
        Sinn von Regeln zur ordnungsgemäßen Buchhaltung entsprechen oder nicht, wurde hier
        nicht berücksichtigt."""
        with AccountMapper() as mapper:
            debits = self.get_debits_of_account(account)
            credits = self.get_credits_of_account(account)

            if not(debits is None):
                for transaction in debits:
                    self.delete(transaction)

            if not (credits is None):
                for transaction in credits:
                    self.delete(transaction)

            mapper.delete(account)

    def create_account_for_customer(self, customer):
        """Für einen gegebenen Kunden ein neues Konto anlegen."""
        with AccountMapper() as mapper:
            if customer is not None:
                account = Account()
                account.set_owner(customer.get_id())
                account.set_id(1)

                return mapper.insert(account)
            else:
                return None

    def get_balance_of_account(self, account):
        """Den Kontostand (Saldo) für ein gegebenes Konto bestimmen.

        **Hinweise:** Beachten Sie auch hier die Verkettung mit anderen Methoden
        dieser Klasse und die sich daraus ergebende Apllikationslogik. Beachten Sie
        ebenso, dass nicht alle Eigenschaften von Betrachtungsgegenständen z.B. in
        Attributen abgelegt werden müssen, sondern ggf. wie hier berechnet werden können.
        """
        credit_amount = 0
        debit_amount = 0

        debits = self.get_debits_of_account(account)
        credits = self.get_credits_of_account(account)

        if not(debits is None):
            for transaction in debits:
                debit_amount += transaction.get_amount()

        if not(credits is None):
            for transaction in credits:
                credit_amount += transaction.get_amount()

        return credit_amount - debit_amount

    def get_debits_of_account(self, account):
        """Alle Kontobelastungen (Sollbuchungen) eines gegebenen Kontos auslesen."""
        with TransactionMapper() as mapper:
            result = []

            if not (account is None):
                transactions = mapper.find_by_source_account_id(account.get_id())
                if not (transactions is None):
                    result.extend(transactions)

            return result

    def get_credits_of_account(self, account):
        """Alle Guthabenbuchungen (Habenbuchungen) eines gegebenen Kontos auslesen."""
        with TransactionMapper() as mapper:
            result = []

            if not (account is None):
                transactions = mapper.find_by_target_account_id(account.get_id())
                if not (transactions is None):
                    result.extend(transactions)

            return result

    def save_account(self, account):
        """Eine Konto-Instanz speichern."""
        with AccountMapper() as mapper:
            mapper.update(account)

    """
    Pflege der Konstante für das Bar-Konto der Bank
    """
    def __get_default_cash_account_id(self):
        """Auslesen der Nummer/ID des Bar-Kontos der Bank."""
        return 10000

    def get_cash_account(self):
        """Auslesen des Bar-Kontos der Bank."""
        with AccountMapper() as mapper:
            return mapper.find_by_key(self.__get_default_cash_account_id())

    """
    Transaction-spezifische Methoden
    """
    def create_transaction_for(self,source_account, target_account, value):
        """Eine Buchung erstellen."""
        t = Transaction()
        t.set_id(1)
        t.set_source_account(source_account)
        t.set_target_account(target_account)
        t.set_amount(value)

        with TransactionMapper() as mapper:
            return mapper.insert(t)

    def save_transaction(self, trans):
        """Eine Buchung speichern."""
        with TransactionMapper() as mapper:
            mapper.update(trans)

    def delete_transaction(self, transaction):
        """Eine Buchung löschen.

        **Hinweise:** In Buchhaltungssystemen ist es üblicherweise nicht zulässig,
        Buchungen zu löschen. Normalerweise würden hier kompensierende Buchungen
        zu Stornozwecken erzeugt. Derartige Randbeindungen werden hier jedoch
        aus Gründen der Vereinfachung nicht berücksichtigt.
        """
        with TransactionMapper() as mapper:
            mapper.delete(transaction)

    def get_transaction_by_id(self, number):
        """Die Buchung mit der gegebenen Buchungs-ID auslesen."""
        with TransactionMapper() as mapper:
            return mapper.find_by_key(number)

    def create_withdrawal(self, customer_account, amount):
        """Eine Bar-Auszahlung (Abhebung) von einem gegebenen Konto erstellen.

        Fall: (ugs.) Kunde holt Bar-Geld von der Bank.
        """
        cash_account = self.get_cash_account()

        if not (cash_account is None):
            with TransactionMapper() as mapper:
                transaction = self.create_transaction_for(customer_account, cash_account, amount)
                return transaction
        else:
            return None

    def create_deposit(self, customer_account, amount):
        """Eine Bar-Einzahlung auf ein gegebenes Konto erstellen.

        Fall: (ugs.) Kunde bringt Bar-Geld zur Bank."""
        cash_account = self.get_cash_account()

        if not (cash_account is None):
            with TransactionMapper() as mapper:
                transaction = self.create_transaction_for(cash_account, customer_account, amount)
                return transaction
        else:
            return None

