import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Paper } from '@material-ui/core';
import { BankAPI } from '../api';
import ContextErrorMessage from './dialogs/ContextErrorMessage';
import LoadingProgress from './dialogs/LoadingProgress';

/**
 * Renders a AccountBO object within a ListEntry and provides a delete button to delete it.
 * 
 * @see See Material-UIs [Lists](https://material-ui.com/components/lists/)
 * @see See Material-UIs [ListItem](https://material-ui.com/api/list-item/)
 * 
 * @author [Christoph Kunz](https://github.com/christophkunz)
 */
class AccountDetail extends Component {

  constructor(props) {
    super(props);

    // Init state
    this.state = {
      customer: null,
      loadingInProgress: false,
      loadingError: null,
    };
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    this.getCustomer();
  }

  /** gets the balance for this account */
  getCustomer = () => {
    BankAPI.getAPI().getCustomer(this.props.customerID).then(customer =>
      this.setState({
        customer: customer,
        loadingInProgress: false,
        loadingError: null
      })).catch(e =>
        this.setState({ // Reset state with error from catch 
          customer: null,
          loadingInProgress: false,
          loadingError: e
        })
      );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      loadingError: null
    });
  }

  /** Renders the component */
  render() {
    const { classes, customerID, accountID } = this.props;
    const { customer, loadingInProgress, loadingError } = this.state;

    return (
      <Paper variant='outlined' className={classes.root}>

        <Typography variant='h6'>
          Account
        </Typography>
        <Typography className={classes.accountEntry}>
          ID: {accountID}
        </Typography>
        {
          customer ?
            <Typography>
              Customer: {customer.getLastName()}, {customer.getFirstName()}
            </Typography>
            : null
        }
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage error={loadingError} contextErrorMsg={`The data of customer id ${customerID} could not be loaded.`} onReload={this.getCustomer} />
      </Paper>
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  accountEntry: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  }
});

/** PropTypes */
AccountDetail.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The customerID to be rendered */
  customerID: PropTypes.string.isRequired,
  /** The accountID to be rendered */
  accountID: PropTypes.string.isRequired,
}

export default withStyles(styles)(AccountDetail);
