import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        height: `calc(100% - ${theme.spacing.unit * 8}px)`,
        margin: theme.spacing.unit * 2
    },
});

class Section extends Component {
    render() {
        return (
            <Paper className={this.props.classes.root} elevation={1}>
                {this.props.children}
            </Paper>
        );
    }
}

export default withStyles(styles)(Section);