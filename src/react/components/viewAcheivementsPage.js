import React, { Component } from 'react';
import AuthService from '../services/auth-service';

export default class ViewAcheivementsPage extends Component {

    constructor(props) {
        super(props);

        AuthService.makeAuthenticatedRequest("/.netlify/functions/test");
    }
    render() {
        return <div>Achievements</div>;
    }
}
