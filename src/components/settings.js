import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import AuthService from '../services/auth-service';
import Form from './form';
import Section from './section';
import endpoints from '../services/endpoints';

export default class Settings extends Component {

    constructor(props) {
        super(props);
        this.updateUser = this.updateUser.bind(this);
    }

    updateUser(fields) {
        return AuthService.updateUser(fields).then(() => this.forceUpdate());
    }

    getTeamLeads() {
        return AuthService.makeAuthenticatedRequest(`${endpoints.achievementTrackerApi}/users/team-leads`)
            .then(teamLeads => [{ label: "None", value: null }, ...teamLeads.data.map(lead => ({ label: lead.name, value: lead.id }))]);
    }

    render() {
        if (!AuthService.currentUser) {
            return <Redirect to="/" />
        }
        const fields = [
            { name: 'firstName', required: true, label: 'First Name', value: AuthService.user.firstName },
            { name: 'lastName', required: true, label: 'Last Name', value: AuthService.user.lastName },
            { name: 'isTeamLead', type: 'boolean', label: 'Are you a team Lead?', value: AuthService.user.isTeamLead },

        ]
        if (!AuthService.user.isTeamLead) {
            fields.push({ name: 'teamLead', type: 'select', label: "Team Lead", options: () => this.getTeamLeads(), value: AuthService.user.teamLead && AuthService.user.teamLead.id});
        }

        return (
            <Section className="Settings">
                <Form title="Settings"
                    onSubmit={this.updateUser}
                    fields={fields}
                    submitText="Save" />
            </Section>
        )
    }
}
