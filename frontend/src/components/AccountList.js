import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, ListItem } from '@material-ui/core';
import { Button, List } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { BankAPI } from '../api';
import ContextErrorMessage from './dialogs/ContextErrorMessage';
import LoadingProgress from './dialogs/LoadingProgress';
import AccountListEntry from './AccountListEntry';

/**
 * Renders a list of AccountListEntry objects.
 * 
 * @see See [AccountListEntry](#accountlistentry)
 * 
 * @author [Christoph Kunz](https://github.com/christophkunz)
 */
class AccountList extends Component {

  constructor(props) {
    super(props);

    // Init the state
    this.state = {
      accounts: [],
      loadingInProgress: false,
      loadingAccountError: null,
      addingAccountError: null,
    };
  }

  /** Fetches AccountBOs for the current customer */
  getAccounts = () => {
    BankAPI.getAPI().getAccountsForCustomer(this.props.customer.getID()).then(accountBOs =>
      this.setState({  // Set new state when AccountBOs have been fetched
        accounts: accountBOs,
        loadingInProgress: false, // loading indicator 
        loadingAccountError: null
      })).catch(e =>
        this.setState({ // Reset state with error from catch 
          accounts: [],
          loadingInProgress: false,
          loadingAccountError: e
        })
      );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      loadingAccountError: null
    });
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    this.getAccounts();
  }

  /** Lifecycle method, which is called when the component was updated */
  componentDidUpdate(prevProps) {
    // reload accounts if shown state changed. Occures if the CustomerListEntrys ExpansionPanel was expanded
    // if ((this.props.show !== prevProps.show)) {
    //   this.getAccounts();
    // }
  }

  /** Adds an account for the current customer */
  addAccount = () => {
    BankAPI.getAPI().addAccountForCustomer(this.props.customer.getID()).then(accountBO => {
      // console.log(accountBO)
      this.setState({  // Set new state when AccountBOs have been fetched
        accounts: [...this.state.accounts, accountBO],
        loadingInProgress: false, // loading indicator 
        addingAccountError: null
      })
    }).catch(e =>
      this.setState({ // Reset state with error from catch 
        accounts: [],
        loadingInProgress: false,
        addingAccountError: e
      })
    );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      addingAccountError: null
    });
  }

  /** Handles onAccountDelete events from an AccountListEntry  */
  deleteAccountHandler = (deletedAccount) => {
    // console.log(deletedAccount.getID());
    this.setState({
      accounts: this.state.accounts.filter(account => account.getID() !== deletedAccount.getID())
    })
  }

  /** Renders the component */
  render() {
    const { classes, customer } = this.props;
    // Use the states customer
    const { accounts, loadingInProgress, loadingAccountError, addingAccountError } = this.state;

    // console.log(this.props);
    return (
      <div className={classes.root}>
        <List className={classes.accountList}>
          {
            accounts.map(account => <AccountListEntry key={account.getID()} customer={customer} account={account} onAccountDeleted={this.deleteAccountHandler}
              show={this.props.show} />)
          }
          <ListItem>
            <LoadingProgress show={loadingInProgress} />
            <ContextErrorMessage error={loadingAccountError} contextErrorMsg={`List of accounts for customer ${customer.getID()} could not be loaded.`} onReload={this.getAccounts} />
            <ContextErrorMessage error={addingAccountError} contextErrorMsg={`Account for customer ${customer.getID()} could not be added.`} onReload={this.addAccount} />
          </ListItem>
        </List>
        <Button className={classes.addAccountButton} variant='contained' color='primary' startIcon={<AddIcon />} onClick={this.addAccount}>
          Add Account
        </Button>
      </div>
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
  },
  accountList: {
    marginBottom: theme.spacing(2),
  },
  addAccountButton: {
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(1),
  }
});

/** PropTypes */
AccountList.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The CustomerBO of this AccountList */
  customer: PropTypes.object.isRequired,
  /** If true, accounts are (re)loaded */
  show: PropTypes.bool.isRequired
}

export default withStyles(styles)(AccountList);
