import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BookmarkIcon from '@material-ui/icons/BookmarkBorder';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';

import { history } from '../services/history-service';

const styles = theme => ({
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    boxShadow: theme.shadows[8],
    // borderTop: `1px solid ${theme.palette.primary.main}`
  },
});

const hiddenRoutes = ['/login', '/signup'];

class Navbar extends React.Component {
  state = {
    value: null,
  };

  handleChange = (event, value) => {
    history.push(value);
  };

  render() {
    const { classes } = this.props;
    const value = history.location.pathname;

    if(hiddenRoutes.includes(value)) {
        return '';
    }

    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        className={classes.root}
      >
        <BottomNavigationAction label="Achievements" icon={<BookmarkIcon />} value="/" />
        <BottomNavigationAction label="Activity" icon={<FormatListBulleted />} value="/activity" />
      </BottomNavigation>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navbar);
