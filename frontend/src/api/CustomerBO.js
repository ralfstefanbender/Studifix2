import BusinessObject from './BusinessObject';

/**
 * Represents a customer of the bank.
 */
export default class CustomerBO extends BusinessObject {

  /**
   * Constructs a CustomerBO object with a given firstname and lastname.
   * 
   * @param {String} aFirstname - the firstname of this CustomerBO.
   * @param {String} aFirstname - the firstname of this CustomerBO.
   */
  constructor(aFirstname, aLastname) {
    super();
    this.first_name = aFirstname;
    this.last_name = aLastname;
  }

  /**
   * Sets a new firstname.
   * 
   * @param {String} aFirstname - the new firstname of this CustomerBO.
   */
  setFirstName(aFirstname) {
    this.first_name = aFirstname;
  }

  /**
   * Gets the firstname.
   */
  getFirstName() {
    return this.first_name;
  }

  /**
   * Sets a new lastname.
   * 
   * @param {*} aLastname - the new lastname of this CustomerBO.
   */
  setLastName(aLastname) {
    this.last_name = aLastname;
  }

  /**
   * Gets the lastname.
   */
  getLastName() {
    return this.last_name;
  }

  /** 
   * Returns an Array of CustomerBOs from a given JSON structure.
   */
  static fromJSON(customers) {
    let result = [];

    if (Array.isArray(customers)) {
      customers.forEach((c) => {
        Object.setPrototypeOf(c, CustomerBO.prototype);
        result.push(c);
      })
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let c = customers;
      Object.setPrototypeOf(c, CustomerBO.prototype);
      result.push(c);
    }

    return result;
  }
}