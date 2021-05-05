import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, IconButton, Dialog, DialogContent, DialogTitle, TextField, Typography, InputAdornment, MenuItem, DialogActions, Grid } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { BankAPI, TransactionBO } from '../../api';
import ContextErrorMessage from './ContextErrorMessage';
import LoadingProgress from './LoadingProgress';


/**
 * Shows a modal form dialog for a CustomerBO in prop customer. If the customer is set, the dialog is configured 
 * as an edit dialog and the text fields of the form are filled from the given CustomerBO object. 
 * If the customer is null, the dialog is configured as a new customer dialog and the textfields are empty.
 * In dependency of the edit/new state, the respective backend calls are made to update or create a customer. 
 * After that, the function of the onClose prop is called with the created/update CustomerBO object as parameter.  
 * When the dialog is canceled, onClose is called with null.
 * 
 * @see See Material-UIs [Dialog](https://material-ui.com/components/dialogs)
 * @see See Material-UIs [TextField](https://material-ui.com/components/text-fields//)
 * 
 * @author [Christoph Kunz](https://github.com/christophkunz)
 */
class MoneyTransferDialog extends Component {

  initialState = {
    // TextField values
    customerName: '',
    transferAmount: '',
    // search state is null
    targetCustomers: [],
    // The selected CustomerBO
    selectedCustomer: null,
    // Selected accountBO in the accounts array
    selectedAccount: null,
    // TextField validation errors
    transferAmountValidationFailed: false,
    transferAmountFieldEdited: false,
    // Network states
    loadingInProgress: false,
    customerSearchError: null,
    transactionError: null
  };

  constructor(props) {
    super(props);

    // Init the state
    this.state = this.initialState;
  }

  /** Searches for customers with a customerName and loads the corresponding accounts */
  searchCustomer = async () => {
    const { customerName } = this.state;
    if (customerName.length > 0) {
      try {
        // set loading to true
        this.setState({
          targetCustomers: [],              // Set empty array
          selectedCustomer: null,               // the initial customer
          loadingInProgress: true,              // show loading indicator
          customerSearchError: null             // disable error message
        });

        // Load customers first
        const customers = await BankAPI.getAPI().searchCustomer(customerName);

        // load accounts of each customers step by step and inject the acounts into the CustomerBO
        for (const customer of customers) {
          // Load account for each found customer
          let accounts = await BankAPI.getAPI().getAccountsForCustomer(customer.getID());
          // Call sucessfull 
          customer.accounts = accounts;
        }

        // Init the selections 
        let selectedCustomer = null;
        let selectedAccount = null;

        if (customers.length > 0) {
          selectedCustomer = customers[0];
        }

        if (selectedCustomer.accounts.length > 0) {
          selectedAccount = selectedCustomer.accounts[0];
        }

        // Set the final state
        this.setState({
          targetCustomers: customers,
          selectedCustomer: selectedCustomer, // the initially selected customer
          selectedAccount: selectedAccount,   // the initially selected account
          loadingInProgress: false,           // disable loading indicator 
          customerSearchError: null           // no error message
        });
      } catch (e) {
        this.setState({
          targetCustomers: [],              // Set empty array
          selectedCustomer: null,
          loadingInProgress: false,           // disable loading indicator 
          customerSearchError: e              // show error message
        });
      }
    } else {
      this.setState({
        customerNotFound: true
      });
    }
  }

  /** Executes the requested transfer transaction */
  transferMoney = () => {
    const { account } = this.props;
    const { selectedAccount, transferAmount } = this.state;
    let amount = transferAmount.replace(/,/g, '.');

    const transaction = new TransactionBO(account.getID(), selectedAccount.getID(), amount);

    BankAPI.getAPI().addTransaction(transaction).then(transaction => {
      this.setState({
        loadingInProgress: false,        // disable loading indicator 
        transactionError: null             // show error message
      });
      this.handleClose(transaction);
    }).catch(e => {
      this.setState({
        loadingInProgress: false,        // disable loading indicator 
        transactionError: e              // show error message
      });
    });
    this.setState({
      loadingInProgress: true,        // disable loading indicator 
      transactionError: null          // show error message
    });
  }

  /** Handles the close / cancel button click event */
  handleClose = (transaction) => {
    // Reset the state
    this.setState(this.initialState);
    this.props.onClose(transaction);
  }

  /** Handles value changes of the forms textfields and validates the transferAmout field */
  textFieldValueChange = (event) => {
    const val = event.target.value;
    // Validate the amount field
    if (event.target.id === 'transferAmount') {
      let result = false;
      let amount = val.replace(/,/g, '.');
      if (amount.length === 0) {
        // length must not be 0
        result = true;
      }
      if (isNaN(amount)) {
        // Its not a numer in the text field
        result = true;
      }
      this.setState({
        transferAmountValidationFailed: result,
        transferAmountFieldEdited: true
      });
    }
    this.setState({
      [event.target.id]: val
    });
  }

  /** Handles value changes of the customer select textfield */
  customerSelectionChange = (event) => {
    let customer = event.target.value;
    let selectedAccount = null;

    if (customer.accounts.length > 0) {
      selectedAccount = customer.accounts[0]
    }

    this.setState({
      selectedCustomer: customer,
      selectedAccount: selectedAccount,
    });
  }

  /** Handles value changes of the customer select textfield */
  accountSelectionChange = (event) => {
    let selectedAccount = event.target.value;
    this.setState({
      selectedAccount: selectedAccount
    });
  }

  /** Renders the component */
  render() {
    const { classes, show, customer, account } = this.props;
    const { customerName, targetCustomers, selectedCustomer, customerNotFound, selectedAccount, loadingInProgress,
      transferAmountValidationFailed, transferAmountFieldEdited, customerSearchError, transactionError } = this.state;

    return (
      show ?
        <Dialog open={show} onClose={this.handleClose} maxWidth='md'>
          <DialogTitle id='form-dialog-title'>Transfer money
            <IconButton className={classes.closeButton} onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant='body1'>
                  From customer: {customer.getLastName()}, {customer.getFirstName()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant='body1'>
                  Account: {account.getID()}
                </Typography>
              </Grid>
            </Grid>
            <Typography variant='body1'>
              <br/>
              to customer:
            </Typography>

            <form noValidate autoComplete='off'>
              {
                // show a search text field if there are no searchedCustomer yet
                (targetCustomers.length === 0) ?
                  <TextField autoFocus fullWidth margin='normal' type='text' required id='customerName' label='Customer name:'
                    onChange={this.textFieldValueChange}
                    onBlur={this.searchCustomer}
                    error={customerNotFound}
                    helperText={customerNotFound ? 'No customers with the given name have been found' : ' '}
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>
                        <IconButton onClick={this.searchCustomer}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>,
                    }} />
                  :
                  // Show a selection of targetCustomers, if there are any. Provide no search button. 
                  <TextField select autoFocus fullWidth margin='normal' type='text' required id='customerName' label='Customer name:'
                    value={selectedCustomer}
                    onChange={this.customerSelectionChange}>
                    {
                      this.state.targetCustomers.map((customer) => (
                        <MenuItem key={customer.getID()} value={customer}>
                          {customer.getLastName()}, {customer.getFirstName()}
                        </MenuItem>
                      ))
                    }
                  </TextField>
              }
              {
                // Render the account select field
                selectedAccount ?
                  <TextField select fullWidth margin='normal' type='text' required id='account' label='Target account:'
                    value={selectedAccount}
                    onChange={this.accountSelectionChange}>
                    {
                      selectedCustomer.accounts.map((account) => (
                        <MenuItem key={account.getID()} value={account}>
                          {account.getID()}
                        </MenuItem>
                      ))
                    }
                  </TextField>
                  :
                  <TextField select fullWidth margin='normal' type='text' required id='account' label='Target account:'
                    value={0}
                    onChange={this.accountSelectionChange}>
                    <MenuItem value={0}>
                      No accounts found
                  </MenuItem>
                  </TextField>
              }

              <TextField fullWidth margin='normal' type='text' required id='transferAmount' label='Amount:'
                onChange={this.textFieldValueChange}
                error={transferAmountValidationFailed}
                helperText={transferAmountValidationFailed ? 'The amount must be a number' : ' '}
                InputProps={{
                  startAdornment: <InputAdornment position='start'>{BankAPI.getAPI().getCurrency()}
                  </InputAdornment>,
                }}
              />
            </form>
            <LoadingProgress show={loadingInProgress} />
            <ContextErrorMessage error={customerSearchError} contextErrorMsg={`Customer ${customerName} could not be searched.`} onReload={this.searchCustomer} />
            <ContextErrorMessage error={transactionError} contextErrorMsg={`Transaction could not be executed.`} onReload={this.transferMoney} />

          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color='secondary'>
              Cancel
            </Button>
            <Button disabled={!selectedCustomer || !selectedAccount || !transferAmountFieldEdited || transferAmountValidationFailed} variant='contained' color='primary' onClick={this.transferMoney}>
              Transfer
            </Button>
          </DialogActions>
        </Dialog>
        : null
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  }
});

/** PropTypes */
MoneyTransferDialog.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The CustomerBO for whom to transfer */
  customer: PropTypes.object.isRequired,
  /** The AccountBO from which to transfer */
  account: PropTypes.object.isRequired,
  /** If true, the form is rendered */
  show: PropTypes.bool.isRequired,
  /**  
   * Handler function which is called, when the dialog is closed.
   * Sends the performed TransactionBO as parameter or null, if cancel was pressed.
   *  
   * Signature: onClose(TransactionBO transaction);
   */
  onClose: PropTypes.func.isRequired,
}

export default withStyles(styles)(MoneyTransferDialog);

