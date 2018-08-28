import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import AuthService from '../services/auth-service';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import AchievementPanel from './achievementPanel';
import achievementTypes from '../services/achievement-types';
import endpoints from '../services/endpoints';

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

    constructor(props) {
        super(props);
        this.state = { counts: null };
    }

    async componentDidMount() {
        if (!AuthService.currentUser) {
            return;
        }
        var oneDay = 1000 * 60 * 60 * 24;
        const todayStart = oneDay * Math.floor(Date.now() / oneDay);
        const currentWeekStart = todayStart - (oneDay * new Date().getDay());
        const lastWeekStart = currentWeekStart - (oneDay * 7);
        const counts = (await AuthService.makeAuthenticatedRequest(`${endpoints.achievementTrackerApi}/user/events/count?from=${lastWeekStart}`))
            .data.reduce((acc, eventCount) => {
                acc[eventCount.eventType] = this.groupDays(eventCount, todayStart, currentWeekStart);
                return acc
            }, {});
        this.setState({ counts });
    }

    groupDays(eventCount, todayStart, currentWeekStart) {
        return eventCount.days.reduce((acc, date) => {
            if (date.day < currentWeekStart) {
                acc.lastWeek.count += date.count;
                acc.lastWeek.approvedCount += date.approvedCount;
            } else {
                acc.currentWeek.count += date.count;
                acc.currentWeek.approvedCount += date.approvedCount;
                if (date.day === todayStart) {
                    acc.today.count = date.count;
                    acc.today.approvedCount = date.approvedCount;
                }
            }
            return acc;
        }, {
                lastWeek: { count: 0, approvedCount: 0 },
                currentWeek: { count: 0, approvedCount: 0 },
                today: { count: 0, approvedCount: 0 }
            });
    }


    render() {
        if (!AuthService.currentUser) {
            return <Redirect to="/login" />
        }
        const { classes } = this.props;
        return (
            <Grid container className={classes.grid}>
                {achievementTypes.all.map(type => (
                    <Grid key={type.id} item className={classes.item} md={6}>
                        <AchievementPanel type={type}
                            stats={this.state.counts && this.state.counts[type.id]} />
                    </Grid>
                ))}

            </Grid>
        )
    }
}

export default withStyles(styles)(Home);
