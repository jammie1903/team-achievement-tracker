import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import AuthService from '../services/auth-service';
import Section from './section';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { history } from '../services/history-service';


class FourOhFour extends Component {

    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this);
    }

    goBack() {
        history.goBack();
    }

    render() {
        if (!AuthService.currentUser) {
            return <Redirect to="/login" />
        }
        return (
            <div className="FourOhFour">
                <Section>
                    <Typography variant="display1" gutterBottom>I think you might be lost...</Typography>
                    <Typography variant="subheading" gutterBottom>The page you are looking for cant be found</Typography>
                    <Button color="primary"  onClick={this.goBack}>
                        Go Back
                    </Button>
                </Section>
            </div>
        );
    }
}

export default FourOhFour;