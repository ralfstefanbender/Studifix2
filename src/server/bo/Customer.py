from server.bo import BusinessObject as bo


class Customer (bo.BusinessObject):
    """Realisierung einer exemplarischen Kundenklasse.

    Aus Gründen der Vereinfachung besitzt der Kunden in diesem Demonstrator
    lediglich einen Vornamen und einen Nachnamen.
    """
    def __init__(self):
        super().__init__()
        self._first_name = ""  # Der Vorname des Kunden.
        self._last_name = ""  # Der Nachname des Kunden.

    def get_first_name(self):
        """Auslesen des Vornamens."""
        return self._first_name

    def set_first_name(self, value):
        """Setzen des Vornamens."""
        self._first_name = value

    def get_last_name(self):
        """Auslesen des Nachnamens."""
        return self._last_name

    def set_last_name(self, value):
        """Setzen des Nachnamens."""
        self._last_name = value

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz.
        
        Diese besteht aus der ID der Superklasse ergänzt durch den Vor- und Nachnamen
        des jeweiligen Kunden."""
        return "Customer: {}, {} {}".format(self.get_id(), self._first_name, self._last_name)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen Customer()."""
        obj = Customer()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_first_name(dictionary["first_name"])
        obj.set_last_name(dictionary["last_name"])
        return obj
