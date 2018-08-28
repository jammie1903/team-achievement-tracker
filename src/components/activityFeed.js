import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import AuthService from '../services/auth-service';
import endpoints from '../services/endpoints';
import Activity from './activity';
import TeamCache from '../services/team-cache';
import achievementTypes from '../services/achievement-types';

const styles = theme => ({
    root: {
        padding: `0 ${theme.spacing.unit * 2}px`
    }
})

class ActivityFeed extends Component {

    constructor(props) {
        super(props);
        this.state = { loaded: false, failed: false, activities: [] };

        if (AuthService.currentUser) {
            Promise.all([
                TeamCache.initialise(),
                AuthService.makeAuthenticatedRequest(`${endpoints.achievementTrackerApi}/users/team/events`)
            ])
                .then(([Cache, events]) => {
                    console.log(events);
                    events.data.forEach(event => {
                        event.user = Cache.getUser(event.user);
                        event.author = Cache.getUser(event.author);
                        event.approvedBy = Cache.getUser(event.approvedBy);
                        event.eventType = achievementTypes[event.eventType];
                    });
                    this.setState({ loaded: true, activities: events.data });
                }).catch(err => {
                    console.log(err);
                    this.setState({ failed: true });
                })
        }
    }

    render() {
        if (!AuthService.currentUser) {
            return <Redirect to="/login" />
        }
        if (this.state.failed) {
            return <div>Error</div>
        }
        if (!this.state.loaded) {
            return <div>Loading</div>
        }

        return (
            <div className={this.props.classes.root}>
                {this.state.activities.map(activity => (
                    <Activity key={activity.id} activity={activity} />
                ))}
            </div>
        );
    }
}

export default withStyles(styles)(ActivityFeed);