import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { BankAPI, CustomerBO } from '../../api';
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
class CustomerForm extends Component {

  constructor(props) {
    super(props);

    let fn = '', ln = '';
    if (props.customer) {
      fn = props.customer.getFirstName();
      ln = props.customer.getLastName();
    }

    // Init the state
    this.state = {
      firstName: fn,
      firstNameValidationFailed: false,
      firstNameEdited: false,
      lastName: ln,
      lastNameValidationFailed: false,
      lastNameEdited: false,
      addingInProgress: false,
      updatingInProgress: false,
      addingError: null,
      updatingError: null
    };
    // save this state for canceling
    this.baseState = this.state;
  }

  /** Adds the customer */
  addCustomer = () => {
    let newCustomer = new CustomerBO(this.state.firstName, this.state.lastName);
    BankAPI.getAPI().addCustomer(newCustomer).then(customer => {
      // Backend call sucessfull
      // reinit the dialogs state for a new empty customer
      this.setState(this.baseState);
      this.props.onClose(customer); // call the parent with the customer object from backend
    }).catch(e =>
      this.setState({
        updatingInProgress: false,    // disable loading indicator 
        updatingError: e              // show error message
      })
    );

    // set loading to true
    this.setState({
      updatingInProgress: true,       // show loading indicator
      updatingError: null             // disable error message
    });
  }

  /** Updates the customer */
  updateCustomer = () => {
    // clone the original cutomer, in case the backend call fails
    let updatedCustomer = Object.assign(new CustomerBO(), this.props.customer);
    // set the new attributes from our dialog
    updatedCustomer.setFirstName(this.state.firstName);
    updatedCustomer.setLastName(this.state.lastName);
    BankAPI.getAPI().updateCustomer(updatedCustomer).then(customer => {
      this.setState({
        updatingInProgress: false,              // disable loading indicator  
        updatingError: null                     // no error message
      });
      // keep the new state as base state
      this.baseState.firstName = this.state.firstName;
      this.baseState.lastName = this.state.lastName;
      this.props.onClose(updatedCustomer);      // call the parent with the new customer
    }).catch(e =>
      this.setState({
        updatingInProgress: false,              // disable loading indicator 
        updatingError: e                        // show error message
      })
    );

    // set loading to true
    this.setState({
      updatingInProgress: true,                 // show loading indicator
      updatingError: null                       // disable error message
    });
  }

  /** Handles value changes of the forms textfields and validates them */
  textFieldValueChange = (event) => {
    const value = event.target.value;

    let error = false;
    if (value.trim().length === 0) {
      error = true;
    }

    this.setState({
      [event.target.id]: event.target.value,
      [event.target.id + 'ValidationFailed']: error,
      [event.target.id + 'Edited']: true
    });
  }

  /** Handles the close / cancel button click event */
  handleClose = () => {
    // Reset the state
    this.setState(this.baseState);
    this.props.onClose(null);
  }

  /** Renders the component */
  render() {
    const { classes, customer, show } = this.props;
    const { firstName, firstNameValidationFailed, firstNameEdited, lastName, lastNameValidationFailed, lastNameEdited, addingInProgress,
      addingError, updatingInProgress, updatingError } = this.state;

    let title = '';
    let header = '';

    if (customer) {
      // customer defindet, so ist an edit dialog
      title = 'Update a customer';
      header = `Customer ID: ${customer.getID()}`;
    } else {
      title = 'Create a new customer';
      header = 'Enter customer data';
    }

    return (
      show ?
        <Dialog open={show} onClose={this.handleClose} maxWidth='xs'>
          <DialogTitle id='form-dialog-title'>{title}
            <IconButton className={classes.closeButton} onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {header}
            </DialogContentText>
            <form className={classes.root} noValidate autoComplete='off'>
              <TextField autoFocus type='text' required fullWidth margin='normal' id='firstName' label='First name:' value={firstName} 
                onChange={this.textFieldValueChange} error={firstNameValidationFailed} 
                helperText={firstNameValidationFailed ? 'The first name must contain at least one character' : ' '} />
              <TextField type='text' required fullWidth margin='normal' id='lastName' label='Last name:' value={lastName}
                onChange={this.textFieldValueChange} error={lastNameValidationFailed}
                helperText={lastNameValidationFailed ? 'The last name must contain at least one character' : ' '} />
            </form>
            <LoadingProgress show={addingInProgress || updatingInProgress} />
            {
              // Show error message in dependency of customer prop
              customer ?
                <ContextErrorMessage error={updatingError} contextErrorMsg={`The customer ${customer.getID()} could not be updated.`} onReload={this.updateCustomer} />
                :
                <ContextErrorMessage error={addingError} contextErrorMsg={`The customer could not be added.`} onReload={this.addCustomer} />
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color='secondary'>
              Cancel
            </Button>
            {
              // If a customer is given, show an update button, else an add button
              customer ?
                <Button disabled={firstNameValidationFailed || lastNameValidationFailed} variant='contained' onClick={this.updateCustomer} color='primary'>
                  Update
              </Button>
                : <Button disabled={firstNameValidationFailed || !firstNameEdited || lastNameValidationFailed || !lastNameEdited} variant='contained' onClick={this.addCustomer} color='primary'>
                  Add
             </Button>
            }
          </DialogActions>
        </Dialog>
        : null
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

/** PropTypes */
CustomerForm.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The CustomerBO to be edited */
  customer: PropTypes.object,
  /** If true, the form is rendered */
  show: PropTypes.bool.isRequired,
  /**  
   * Handler function which is called, when the dialog is closed.
   * Sends the edited or created CustomerBO as parameter or null, if cancel was pressed.
   *  
   * Signature: onClose(CustomerBO customer);
   */
  onClose: PropTypes.func.isRequired,
}

export default withStyles(styles)(CustomerForm);
