import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import AuthService from '../services/auth-service';
import Button from '@material-ui/core/Button';
import Section from './section';
import Form from './form';
import Typography from '@material-ui/core/Typography';

export default class SignUp extends Component {

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
                <Section>
                    <Form title="Sign Up"
                        onSubmit={this.signUp}
                        fields={[
                            { name: 'firstName', required: true, label: 'First Name' },
                            { name: 'lastName', required: true, label: 'Last Name' },
                            { name: 'email', type: 'email', required: true, label: 'Email Address' },
                            { name: 'password', type: 'password', required: true, label: 'Password', confirm: true },
                            { name: 'isTeamLead', type: 'boolean', label: 'Are you a team Lead?' },
                        ]} />
                    <Typography variant="subheading" style={{ marginTop: 20 }}>
                        Already have an Account?
                    </Typography>
                    <Button component={Link} to="/login" style={{ margin: 15 }} variant="contained" color="primary">
                        Login
                    </Button>
                </Section>
            </div>
        )
    }
}
