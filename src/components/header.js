import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Link } from 'react-router-dom';

import AuthService from "../services/auth-service";

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flexGrow: 1,
    },
    marginLeft: {
        marginLeft: 48,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

const offsetLimit = 56;

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            offset: 0
        };

    }

    componentDidMount() {
        let lastScrollTop = window.scrollY;
        this.scrollListener = (e) => {
            const change = window.scrollY - lastScrollTop;
            lastScrollTop = window.scrollY;
            this.setState({ offset: Math.max(0, Math.min(offsetLimit, this.state.offset + change)) });
        }
        window.addEventListener('scroll', this.scrollListener);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollListener);
    }

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    logout = () => {
        AuthService.logout()
            .then(() => document.location.reload());
    }

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div className={classes.root}>
                <AppBar position="fixed" style={{ top: this.state.offset === offsetLimit ? -offsetLimit * 2 : -this.state.offset }}>
                    <Toolbar>

                        <Typography variant="title" color="inherit" className={classes.flex + (AuthService.currentUser ? ` ${classes.marginLeft}` : '')}>
                            Team Acheivement Tracker
                        </Typography>
                        {AuthService.currentUser && (
                            <div>
                                <IconButton
                                    aria-owns={open ? 'menu-appbar' : null}
                                    aria-haspopup="true"
                                    onClick={this.handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={open}
                                    onClose={this.handleClose}
                                >
                                    <MenuItem onClick={this.handleClose} component={Link} to="/settings">Settings</MenuItem>
                                    <MenuItem onClick={this.logout}>Sign Out</MenuItem>
                                </Menu>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);