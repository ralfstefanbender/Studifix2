import BusinessObject from './BusinessObject';

/**
 * Reresents a transaction.
 */ 
 export default class TransactionBO extends BusinessObject {

  /**
   * Constructs a new TransactionBO object.
   * 
   * @param {*} aSourceID - the ID of the source account.
   * @param {*} aTargetID - the ID of the target account.
   * @param {*} aAmount - the amount of money to transfer.
   */
  constructor(aSourceID, aTargetID, aAmount) {
    super();
    this.source_account = aSourceID;
    this.target_account = aTargetID;
    this.amount = aAmount;
  }

  /**
   * Sets the source account id.
   * 
   * @param {*} aSourceID - the new ID of the source account.
   */
  setSourceAccount(aSourceID) {
    this.source_account = aSourceID;
  }

  /**
   * Gets the source account id.
   */
  getSourceAccount() {
    return this.source_account;
  }

  /**
   * Sets the source target account id.
   * 
   * @param {*} aTargetID - the new ID of the target account.
   */
  setTargetAccount(aTargetID) {
    this.target_account = aTargetID;
  }

  /**
   * Gets the target account id.
   */
  getTargetAccount() {
    return this.target_account;
  }

  /**
   * Sets the amount of money to transfer.
   * 
   * @param {*} aAmount - the amount of money to transfer.
   */
  setAmount(aAmount) {
    this.amount = aAmount;
  }

  /**
   * Gets the amount of money of the transaction.
   */
  getAmount() {
    return this.amount;
  }

  /**
   * Returns an Array of TransactionBOs from a given JSON structure.
   */
  static fromJSON(transactions) {
    let result = [];

    if (Array.isArray(transactions)) {
      transactions.forEach((t) => {
        Object.setPrototypeOf(t, TransactionBO.prototype);
        result.push(t);
      })
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let t = transactions
      Object.setPrototypeOf(t, TransactionBO.prototype);
      result.push(t);
    }

    return result;
  }
}

