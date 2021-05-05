from server.bo import BusinessObject as bo


class Transaction (bo.BusinessObject):
    """Realisierung einer exemplarischen Buchung.

    Eine Buchung zeichnet sich dadurch aus, dass sie ein Quellkonto und
    ein Zielkonto besitzt, zwischen denen ein Betrag, der als Geld
    interopretiert wird, umgebucht wird.
    """
    def __init__(self):
        super().__init__()
        self._source_account = None  # Fremdschlüsselbeziehung zum Quellkonto.
        self._target_account = None  # Fremdschlüsselbeziehung zum Zielkonto.
        """Der Betrag der Buchung. Dieser Betrag kann als Geldwert interpretiert
        werden. Da ein Buchungssystem stets mit einer einzigen Währung arbeitet, 
        ist deren Repräsentation in der Buchung nicht erforderlich."""
        self._amount = 0.0

    def get_source_account(self):
        """Auslesen des Fremdschlüssels des Quellkontos."""
        return self._source_account

    def set_source_account(self, account):
        """Setzen des Fremdschlüssels des Quellkontos."""
        self._source_account = account

    def get_target_account(self):
        """Auslesen des Fremdschlüssels des Zielkontos."""
        return self._target_account

    def set_target_account(self, account):
        """Setzen des Fremdschlüssels des Zielkontos."""
        self._target_account = account

    def get_amount(self):
        """Auslesen des Buchungswerts."""
        return self._amount

    def set_amount(self, amount):
        """Setzen des Buchungswerts."""
        self._amount = amount

    def __str__(self):
        """Erzeugen einer textuellen Darstellung der jeweiligen Buchung."""
        return "Transaction ({}): von {} nach {}, Wert: {}"\
            .format(self.get_id(), self.get_source_account(), self.get_target_account(), self.get_amount())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in eine Transaction()."""
        obj = Transaction()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_source_account(dictionary["source_account"])
        obj.set_target_account(dictionary["target_account"])
        obj.set_amount(dictionary["amount"])
        return obj
