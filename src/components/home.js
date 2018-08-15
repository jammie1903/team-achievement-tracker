import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import AuthService from '../services/auth-service';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import AchievementPanel from './achievementPanel';


const styles = theme => ({
    grid: {
        padding: theme.spacing.unit * 2,
        width: '100%',
        margin: 0,
    },
    item: {
        width: '100%',
    },
});

class Home extends Component {
    render() {
        if (!AuthService.currentUser) {
            return <Redirect to="/login" />
        }
        const { classes } = this.props;
        return (
            <Grid container className={classes.grid}>

                <Grid item className={classes.item} md={6}>
                    <AchievementPanel type={{ name: "Accounts", submitText: "got an account!" }}
                        stats={{ today: 1, currentWeek: 5, lastWeek: 12 }} />
                </Grid>

                <Grid item className={classes.item} md={6}>
                    <AchievementPanel type={{ name: "Good Customer Service", submitText: "served them good!" }}
                        stats={{ today: 2, currentWeek: 3, lastWeek: 9 }} />
                </Grid>

                <Grid item className={classes.item} md={6}>
                    <AchievementPanel type={{ name: "Teas Made", submitText: "made a Tea!" }}
                        stats={{ today: 7, currentWeek: 43, lastWeek: 154 }} />
                </Grid>

            </Grid>
        )
    }
}

export default withStyles(styles)(Home);
