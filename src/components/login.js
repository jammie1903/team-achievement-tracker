import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import AuthService from '../services/auth-service';
import Button from '@material-ui/core/Button';
import Form from'./form';
import Typography from '@material-ui/core/Typography';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
    }

    login(fields) {
        return AuthService.login(fields.email, fields.password).then(()=> this.forceUpdate());
    }

    render() {
        if (AuthService.currentUser) {
            return <Redirect to="/" />
        }

        return (
            <div className="Login">

                <Form title="Login"
                    onSubmit={this.login}
                    fields={[
                        { name: 'email', type: 'email', required: true, label: 'Email Address' },
                        { name: 'password', type: 'password', required: true, label: 'Password' },
                    ]} />
                <Typography variant="subheading" style={{ marginTop: 20 }}>
                    Dont have an Account?
                </Typography>

                <Button component={Link} to="/signup" style={{ margin: 15 }} variant="contained" color="primary">
                    Sign Up
                </Button>
            </div>
        )
    }
}
