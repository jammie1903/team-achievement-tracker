import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import AuthService from '../services/auth-service';
import ViewAcheivementsPage from './viewAcheivementsPage';
import SubmitAcheievementPage from './submitAcheivementsPage';

export default class Home extends Component {
    render() {
        if (!AuthService.currentUser) {
            return <Redirect to="/login"/>
        } else if(AuthService.currentUser.isAdmin) {
            return <ViewAcheivementsPage/>
        } else {
            return <SubmitAcheievementPage/>
        }
    }
}
