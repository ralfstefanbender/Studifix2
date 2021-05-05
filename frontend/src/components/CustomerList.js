import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear'
import { withRouter } from 'react-router-dom';
import { BankAPI } from '../api';
import ContextErrorMessage from './dialogs/ContextErrorMessage';
import LoadingProgress from './dialogs/LoadingProgress';
import CustomerForm from './dialogs/CustomerForm';
import CustomerListEntry from './CustomerListEntry';

/**
 * Controlls a list of CustomerListEntrys to create a accordion for each customer.  
 * 
 * @see See [CustomerListEntry](#customerlistentry)
 * 
 * @author [Christoph Kunz](https://github.com/christophkunz)
 */
class CustomerList extends Component {

  constructor(props) {
    super(props);

    // console.log(props);
    let expandedID = null;

    if (this.props.location.expandCustomer) {
      expandedID = this.props.location.expandCustomer.getID();
    }

    // Init an empty state
    this.state = {
      customers: [],
      filteredCustomers: [],
      customerFilter: '',
      error: null,
      loadingInProgress: false,
      expandedCustomerID: expandedID,
      showCustomerForm: false
    };
  }

  /** Fetches all CustomerBOs from the backend */
  getCustomers = () => {
    BankAPI.getAPI().getCustomers()
      .then(customerBOs =>
        this.setState({               // Set new state when CustomerBOs have been fetched
          customers: customerBOs,
          filteredCustomers: [...customerBOs], // store a copy
          loadingInProgress: false,   // disable loading indicator 
          error: null
        })).catch(e =>
          this.setState({             // Reset state with error from catch 
            customers: [],
            loadingInProgress: false, // disable loading indicator 
            error: e
          })
        );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      error: null
    });
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    this.getCustomers();
  }

  /** 
   * Handles onExpandedStateChange events from the CustomerListEntry component. Toggels the expanded state of 
   * the CustomerListEntry of the given CustomerBO.
   * 
   * @param {customer} CustomerBO of the CustomerListEntry to be toggeled
   */
  onExpandedStateChange = customer => {
    // console.log(customerID);
    // Set expandend customer entry to null by default
    let newID = null;

    // If same customer entry is clicked, collapse it else expand a new one
    if (customer.getID() !== this.state.expandedCustomerID) {
      // Expand the customer entry with customerID
      newID = customer.getID();
    }
    // console.log(newID);
    this.setState({
      expandedCustomerID: newID,
    });
  }

  /** 
   * Handles onCustomerDeleted events from the CustomerListEntry component
   * 
   * @param {customer} CustomerBO of the CustomerListEntry to be deleted
   */
  customerDeleted = customer => {
    const newCustomrList = this.state.customers.filter(customerFromState => customerFromState.getID() !== customer.getID());
    this.setState({
      customers: newCustomrList,
      filteredCustomers: [...newCustomrList],
      showCustomerForm: false
    });
  }

  /** Handles the onClick event of the add customer button */
  addCustomerButtonClicked = event => {
    // Do not toggle the expanded state
    event.stopPropagation();
    //Show the CustmerForm
    this.setState({
      showCustomerForm: true
    });
  }

  /** Handles the onClose event of the CustomerForm */
  customerFormClosed = customer => {
    // customer is not null and therefore created
    if (customer) {
      const newCustomrList = [...this.state.customers, customer];
      this.setState({
        customers: newCustomrList,
        filteredCustomers: [...newCustomrList],
        showCustomerForm: false
      });
    } else {
      this.setState({
        showCustomerForm: false
      });
    }
  }

  /** Handels onChange events of the customer filter text field */
  filterFieldValueChange = event => {
    const value = event.target.value.toLowerCase();
    this.setState({
      filteredCustomers: this.state.customers.filter(customer => {
        let firstNameContainsValue = customer.getFirstName().toLowerCase().includes(value);
        let lastNameContainsValue = customer.getLastName().toLowerCase().includes(value);
        return firstNameContainsValue || lastNameContainsValue;
      }),
      customerFilter: value
    });
  }

  /** Handles the onClose event of the clear filter button */
  clearFilterFieldButtonClicked = () => {
    // Reset the filter
    this.setState({
      filteredCustomers: [...this.state.customers],
      customerFilter: ''
    });
  }

  /** Renders the component */
  render() {
    const { classes } = this.props;
    const { filteredCustomers, customerFilter, expandedCustomerID, loadingInProgress, error, showCustomerForm } = this.state;

    return (
      <div className={classes.root}>
        <Grid className={classes.customerFilter} container spacing={1} justify='flex-start' alignItems='center'>
          <Grid item>
            <Typography>
              Filter customer list by name:
              </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              autoFocus
              fullWidth
              id='customerFilter'
              type='text'
              value={customerFilter}
              onChange={this.filterFieldValueChange}
              InputProps={{
                endAdornment: <InputAdornment position='end'>
                  <IconButton onClick={this.clearFilterFieldButtonClicked}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs />
          <Grid item>
            <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={this.addCustomerButtonClicked}>
              Add Customer
          </Button>
          </Grid>
        </Grid>
        { 
          // Show the list of CustomerListEntry components
          // Do not use strict comparison, since expandedCustomerID maybe a string if given from the URL parameters
          filteredCustomers.map(customer =>
            <CustomerListEntry key={customer.getID()} customer={customer} expandedState={expandedCustomerID === customer.getID()}
              onExpandedStateChange={this.onExpandedStateChange}
              onCustomerDeleted={this.customerDeleted}
            />)
        }
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage error={error} contextErrorMsg={`The list of customers could not be loaded.`} onReload={this.getCustomers} />
        <CustomerForm show={showCustomerForm} onClose={this.customerFormClosed} />
      </div>
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
  },
  customerFilter: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  }
});

/** PropTypes */
CustomerList.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** @ignore */
  location: PropTypes.object.isRequired,
}

export default withRouter(withStyles(styles)(CustomerList));