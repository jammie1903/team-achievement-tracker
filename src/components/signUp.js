import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import AuthService from '../services/auth-service';
import Form from './form';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.signUp = this.signUp.bind(this);
    }

    signUp(fields) {
        return AuthService.signUp(fields).then(()=> this.forceUpdate());
    }

    render() {
        if (AuthService.currentUser) {
            return <Redirect to="/" />
        }

        return (
            <div className="SignUp">
                <Form title="Sign Up"
                    onSubmit={this.signUp}
                    fields={[
                        { name: 'firstName', required: true, label: 'First Name' },
                        { name: 'lastName', required: true, label: 'Last Name' },
                        { name: 'email', type: 'email', required: true, label: 'Email Address' },
                        { name: 'password', type: 'password', required: true, label: 'Password', confirm: true },
                    ]} />
            </div>
        )
    }
}
