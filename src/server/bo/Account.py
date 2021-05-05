from server.bo import BusinessObject as bo


class Account (bo.BusinessObject):
    """Realisierung eines exemplarischen Bankkontos.

    Ein Konto besitzt einen Inhaber sowie eine Reihe von Buchungen (vgl. Klasse Transaction),
    mit deren Hilfe auch der Kontostand berechnet werden kann.
    """
    def __init__(self):
        super().__init__()
        self._owner = None  # Fremdschlüsselbeziehung zum Inhaber des Kontos.

    def get_owner(self):
        """Auslesen des Fremdschlüssels zum Kontoinhaber."""
        return self._owner

    def set_owner(self, person):
        """Setzen des Fremdschlüssels zum Kontoinhaber."""
        self._owner = person

    def __str__(self):
        """Erzeugen einer einfachen textuellen Repräsentation der jeweiligen Kontoinstanz."""
        return "Account: {}, owned by {}".format(self.get_id(), self._owner)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Account()."""
        obj = Account()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_owner(dictionary["owner"])
        return obj
