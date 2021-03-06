import CustomerBO from './CustomerBO';
import TransactionBO from './TransactionBO';
import AccountBO from './AccountBO';

/**
 * Abstracts the REST interface of the Python backend with convenient access methods.
 * The class is implemented as a singleton. 
 * 
 * @author [Christoph Kunz](https://github.com/christophkunz)
 */
export default class BankAPI {

  // Singelton instance
  static #api = null;


  // Local Python backend
  #bankServerBaseURL = '/bank';

  // Local http-fake-backend 
  //#bankServerBaseURL = '/api/bank';

  #currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  });

  #currency = '€';

  // Customer related
  #getCustomersURL = () => `${this.#bankServerBaseURL}/customers`;
  #addCustomerURL = () => `${this.#bankServerBaseURL}/customers`;
  #getCustomerURL = (id) => `${this.#bankServerBaseURL}/customers/${id}`;
  #updateCustomerURL = (id) => `${this.#bankServerBaseURL}/customers/${id}`;
  #deleteCustomerURL = (id) => `${this.#bankServerBaseURL}/customers/${id}`;
  #searchCustomerURL = (customerName) => `${this.#bankServerBaseURL}/customers-by-name/${customerName}`;


  // Account related
  #getAllAccountsURL = () => `${this.#bankServerBaseURL}/accounts`;
  #getAccountsForCustomerURL = (id) => `${this.#bankServerBaseURL}/customers/${id}/accounts`;
  #addAccountsForCustomerURL = (id) => `${this.#bankServerBaseURL}/customers/${id}/accounts`;
  #getBalanceForAccountURL = (id) => `${this.#bankServerBaseURL}/accounts/${id}/balance`;
  #deleteAccountIdURL = (id) => `${this.#bankServerBaseURL}/accounts/${id}`;

  // Transaction related
  #getCreditsForAccountIdURL = (id) => `${this.#bankServerBaseURL}/account/${id}/credits`;
  #getDebitsForAccountIdURL = (id) => `${this.#bankServerBaseURL}/account/${id}/debits`;
  #addTransactionURL = () => `${this.#bankServerBaseURL}/transactions`;

  /** 
   * Get the Singelton instance 
   * 
   * @public
   */
  static getAPI() {
    if (this.#api == null) {
      this.#api = new BankAPI();
    }
    return this.#api;
  }

  /**
   *  Returns a Promise which resolves to a json object. 
   *  The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500. 
   *  fetchAdvanced throws an Error also an server status errors
   */
  #fetchAdvanced = (url, init) => fetch(url, init)
    .then(res => {
      // The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500. 
      if (!res.ok) {
        throw Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    }
    )

  /**
   * Returns a formatter to format currencys of the transactions
   * 
   * @public
   */
  getCurrencyFormatter() {
    return this.#currencyFormatter;
  }

  /**
   * Returns the code for the currency
   * 
   * @public 
   */
  getCurrency() {
    return this.#currency;
  }

  /**
   * Returns a Promise, which resolves to an Array of CustomerBOs
   * 
   * @public
   */
  getCustomers() {
    return this.#fetchAdvanced(this.#getCustomersURL()).then((responseJSON) => {
      let customerBOs = CustomerBO.fromJSON(responseJSON);
      // console.info(customerBOs);
      return new Promise(function (resolve) {
        resolve(customerBOs);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to a CustomerBO
   * 
   * @param {Number} customerID to be retrieved
   * @public
   */
  getCustomer(customerID) {
    return this.#fetchAdvanced(this.#getCustomerURL(customerID)).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON, but only need one object
      let responseCustomerBO = CustomerBO.fromJSON(responseJSON)[0];
      // console.info(responseCustomerBO);
      return new Promise(function (resolve) {
        resolve(responseCustomerBO);
      })
    })
  }

  /**
   * Adds a customer and returns a Promise, which resolves to a new CustomerBO object with the 
   * firstName and lastName of the parameter customerBO object.
   * 
   * @param {CustomerBO} customerBO to be added. The ID of the new customer is set by the backend
   * @public
   */
  addCustomer(customerBO) {
    return this.#fetchAdvanced(this.#addCustomerURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(customerBO)
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON, but only need one object
      let responseCustomerBO = CustomerBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responseCustomerBO);
      })
    })
  }

  /**
   * Updates a customer and returns a Promise, which resolves to a CustomerBO.
   * 
   * @param {CustomerBO} customerBO to be updated
   * @public
   */
  updateCustomer(customerBO) {
    return this.#fetchAdvanced(this.#updateCustomerURL(customerBO.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(customerBO)
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON
      let responseCustomerBO = CustomerBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responseCustomerBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to an Array of AccountBOs
   * 
   * @param {Number} customerID to be deleted
   * @public
   */
  deleteCustomer(customerID) {
    return this.#fetchAdvanced(this.#deleteCustomerURL(customerID), {
      method: 'DELETE'
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON
      let responseCustomerBO = CustomerBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responseCustomerBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to an Array of AccountBOs
   * 
   * @param {Number} customerID to be deleted
   * @public
   */
  searchCustomer(customerName) {
    return this.#fetchAdvanced(this.#searchCustomerURL(customerName)).then((responseJSON) => {
      let customerBOs = CustomerBO.fromJSON(responseJSON);
      // console.info(customerBOs);
      return new Promise(function (resolve) {
        resolve(customerBOs);
      })
    })
  }


  /**
   * Returns a Promise, which resolves to an Array of AccountBOs
   * 
   * @param {Number} customerID for which the the accounts should be retrieved
   * @public
   */
  getAllAccounts() {
    return this.#fetchAdvanced(this.#getAllAccountsURL())
      .then((responseJSON) => {
        let accountBOs = AccountBO.fromJSON(responseJSON);
        // console.info(accountBOs);
        return new Promise(function (resolve) {
          resolve(accountBOs);
        })
      })
  }


  /**
   * Returns a Promise, which resolves to an Array of AccountBOs
   * 
   * @param {Number} customerID for which the the accounts should be retrieved
   * @public
   */
  getAccountsForCustomer(customerID) {
    return this.#fetchAdvanced(this.#getAccountsForCustomerURL(customerID))
      .then((responseJSON) => {
        let accountBOs = AccountBO.fromJSON(responseJSON);
        // console.info(accountBOs);
        return new Promise(function (resolve) {
          resolve(accountBOs);
        })
      })
  }

  /**
   * Deletes the given account and returns a Promise, which resolves to an AccountBO
   * 
   * @param accountID to be deleted
   * @public
   */
  deleteAccount(accountID) {
    return this.#fetchAdvanced(this.#deleteAccountIdURL(accountID), {
      method: 'DELETE'
    })
      .then((responseJSON) => {
        // We always get an array of AccountBO.fromJSON, but only need one object
        let accountBOs = AccountBO.fromJSON(responseJSON)[0];
        // console.info(accountBOs);
        return new Promise(function (resolve) {
          resolve(accountBOs);
        })
      })
  }

  /**
   * Returns a Promise, which resolves to an AccountBOs
   * 
   * @param {Number} customerID for which the the accounts should be added to
   * @public
   */
  addAccountForCustomer(customerID) {
    return this.#fetchAdvanced(this.#addAccountsForCustomerURL(customerID), {
      method: 'POST'
    })
      .then((responseJSON) => {
        // We always get an array of AccountBO.fromJSON, but only need one object
        let accountBO = AccountBO.fromJSON(responseJSON)[0];
        // console.info(accountBO);
        return new Promise(function (resolve) {
          // We expect only one new account
          resolve(accountBO);
        })
      })
  }

  /**
   * Returns a Promise, which resolves to a balance
   * 
   * @param {Number} accountID for which the balance should be retrieved
   * @public
   */
  getBalanceOfAccount(accountBO) {
    return this.#fetchAdvanced(this.#getBalanceForAccountURL(accountBO))
      .then(responseJSON => {
        // console.log(responseJSON)
        return new Promise(function (resolve) {
          resolve(responseJSON);
        })
      })
  }

  /**
   * Returns a Promise, which resolves to an Array of TransactionBOs
   * 
   * @param {Number} accountID for which the credit transactions should be retrieved
   * @public
   */
  getCreditsForAccount(accountID) {
    return this.#fetchAdvanced(this.#getCreditsForAccountIdURL(accountID))
      .then(responseJSON => {
        let transactionBOs = TransactionBO.fromJSON(responseJSON);
        // console.info(transactionBOs);
        return new Promise(function (resolve) {
          resolve(transactionBOs);
        })
      })
  }

  /**
   * Returns a Promise, which resolves to an Array of TransactionBOs
   * 
   * @param {Number} accountID for which the debit transactions should be retrieved
   * @public
   */
  getDebitsForAccount(accountID) {
    return this.#fetchAdvanced(this.#getDebitsForAccountIdURL(accountID))
      .then(responseJSON => {
        let transactionBOs = TransactionBO.fromJSON(responseJSON);
        // console.info(transactionBOs);
        return new Promise(function (resolve) {
          resolve(transactionBOs);
        })
      })
  }

  /**
   * Returns a Promise, which resolves to the new TransactionBO
   * 
   * @param {TransactionBO} transaction object 
   * @public
   */
  addTransaction(transaction) {
    return this.#fetchAdvanced(this.#addTransactionURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(transaction)
    }).then((responseJSON) => {
      // We always get an array of TransactionBO.fromJSON, but only need one object
      let tansactionBO = TransactionBO.fromJSON(responseJSON)[0];
      // console.info(accountBO);
      return new Promise(function (resolve) {
        // We expect only one new account
        resolve(tansactionBO);
      })
    })
  }
}
