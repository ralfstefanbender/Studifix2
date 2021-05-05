import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { BankAPI } from '../api';
import ContextErrorMessage from './dialogs/ContextErrorMessage';
import LoadingProgress from './dialogs/LoadingProgress';
import AccountDetail from './AccountDetail';

/**
 * Shows all accounts of the bank.
 * 
 * @author [Christoph Kunz](https://github.com/christophkunz)
 */
class AllAccountList extends Component {

  constructor(props) {
    super(props);

    // Init an empty state
    this.state = {
      accounts: [],
      loadingInProgress: false,
      loadingError: null,
    };
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    this.loadAccounts();
  }

  /** gets the account list for this account */
  loadAccounts = () => {
    BankAPI.getAPI().getAllAccounts().then(accounts =>
      this.setState({
        accounts: accounts,
        loadingInProgress: false, // loading indicator 
        loadingError: null
      })).catch(e =>
        this.setState({ // Reset state with error from catch 
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
    const { classes } = this.props;
    const { accounts, loadingInProgress, loadingError } = this.state;

    return (
      <div className={classes.root}>
          {
            accounts.map(account => <AccountDetail key={account.getID()} 
            customerID={account.getOwner().toString()} accountID={account.getID().toString()} />)
          }
          <LoadingProgress show={loadingInProgress} />
          <ContextErrorMessage error={loadingError} contextErrorMsg={`The list of all accounts of the bank could not be loaded.`} onReload={this.loadAccounts} />
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
AllAccountList.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(AllAccountList);
