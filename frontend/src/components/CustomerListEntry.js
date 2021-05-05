import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from '@material-ui/core';
import { Button, ButtonGroup } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CustomerForm from './dialogs/CustomerForm';
import CustomerDeleteDialog from './dialogs/CustomerDeleteDialog';
import AccountList from './AccountList';


/**
 * Renders a CustomerBO object within a expandable/collapsible CustomerListEntry with the customer manipulation
 * functions. If expanded, it renders a AccountList.
 * 
 * @see See [AccountList](#accountlist)
 * 
 * @author [Christoph Kunz](https://github.com/christophkunz)
 */
class CustomerListEntry extends Component {

  constructor(props) {
    super(props);

    // Init the state
    this.state = {
      customer: props.customer,
      showCustomerForm: false,
      showCustomerDeleteDialog: false,
    };
  }

  /** Handles onChange events of the underlying ExpansionPanel */
  expansionPanelStateChanged = () => {
    this.props.onExpandedStateChange(this.props.customer);
  }

  /** Handles onAccountDelete events from an AccountListEntry  */
  deleteAccountHandler = (deletedAccount) => {
    // console.log(deletedAccount.getID());
    this.setState({
      accounts: this.state.accounts.filter(account => account.getID() !== deletedAccount.getID())
    })
  }

  /** Handles the onClick event of the edit customer button */
  editCustomerButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showCustomerForm: true
    });
  }

  /** Handles the onClose event of the CustomerForm */
  customerFormClosed = (customer) => {
    // customer is not null and therefor changed
    if (customer) {
      this.setState({
        customer: customer,
        showCustomerForm: false
      });
    } else {
      this.setState({
        showCustomerForm: false
      });
    }
  }

  /** Handles the onClick event of the delete customer button */
  deleteCustomerButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showCustomerDeleteDialog: true
    });
  }

  /** Handles the onClose event of the CustomerDeleteDialog */
  deleteCustomerDialogClosed = (customer) => {
    // if customer is not null, delete it
    if (customer) {
      this.props.onCustomerDeleted(customer);
    };

    // Don´t show the dialog
    this.setState({
      showCustomerDeleteDialog: false
    });
  }

  /** Renders the component */
  render() {
    const { classes, expandedState } = this.props;
    // Use the states customer
    const { customer, showCustomerForm, showCustomerDeleteDialog } = this.state;

    // console.log(this.state);
    return (
      <div>
        <Accordion defaultExpanded={false} expanded={expandedState} onChange={this.expansionPanelStateChanged}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id={`customer${customer.getID()}accountpanel-header`}
          >
            <Grid container spacing={1} justify='flex-start' alignItems='center'>
              <Grid item>
                <Typography variant='body1' className={classes.heading}>{customer.getLastName()}, {customer.getFirstName()}
                </Typography>
              </Grid>
              <Grid item>
                <ButtonGroup variant='text' size='small'>
                  <Button color='primary' onClick={this.editCustomerButtonClicked}>
                    edit
                  </Button>
                  <Button color='secondary' onClick={this.deleteCustomerButtonClicked}>
                    delete
                  </Button>
                </ButtonGroup>
              </Grid>
              <Grid item xs />
              <Grid item>
                <Typography variant='body2' color={'textSecondary'}>List of accounts</Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <AccountList show={expandedState} customer={customer} />
          </AccordionDetails>
        </Accordion>
        <CustomerForm show={showCustomerForm} customer={customer} onClose={this.customerFormClosed} />
        <CustomerDeleteDialog show={showCustomerDeleteDialog} customer={customer} onClose={this.deleteCustomerDialogClosed} />
      </div>
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
  }
});

/** PropTypes */
CustomerListEntry.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The CustomerBO to be rendered */
  customer: PropTypes.object.isRequired,
  /** The state of this CustomerListEntry. If true the customer is shown with its accounts */
  expandedState: PropTypes.bool.isRequired,
  /** The handler responsible for handle expanded state changes (exanding/collapsing) of this CustomerListEntry 
   * 
   * Signature: onExpandedStateChange(CustomerBO customer)
   */
  onExpandedStateChange: PropTypes.func.isRequired,
  /** 
   *  Event Handler function which is called after a sucessfull delete of this customer.
   * 
   * Signature: onCustomerDelete(CustomerBO customer)
   */
  onCustomerDeleted: PropTypes.func.isRequired
}

export default withStyles(styles)(CustomerListEntry);
