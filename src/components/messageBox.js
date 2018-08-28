import React, { Component } from 'react';
import { FormControl, TextField, Button, withStyles } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import AuthService from '../services/auth-service';
import endpoints from '../services/endpoints';

const styles = {
    main: {
        width: '100%',
        display: 'inline-flex',
        flexDirection: 'row',
    },
    messageBox: {
        width: '100%',
    },
    sendButton: {
        minHeight: 48,
        minWidth: 48,
        borderRadius: '50%',
        padding: 0,
        maxHeight: 48,
        margin: 'auto',
    },
    sendButtonIcon: {
        marginLeft: 2,
    }
}

class MessageBox extends Component {

    constructor(props) {
        super(props);
        this.state = { message: "", sending: false };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(event) {
        this.setState({ message: event.target.value });
    }

    async onSubmit(e) {
        e.preventDefault();
        this.setState({ sending: true });
        try {
            const message = await AuthService.makeAuthenticatedRequest(`${endpoints.achievementTrackerApi}/event/comment`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    eventId: this.props.eventId,
                    text: this.state.message
                })
            });
            this.props.onMessageSent(message.data);
            this.setState({ message: "", sending: false });
        } catch (e) {
            this.setState({ sending: false });
        }
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <FormControl className={this.props.classes.main}>
                    <TextField multiline label="Your Message" value={this.state.message} onChange={this.onChange} required className={this.props.classes.messageBox} disabled={this.state.sending}/>
                    <Button color="primary" disabled={!this.state.message || this.state.sending} className={this.props.classes.sendButton} type='submit'>
                        <SendIcon className={this.props.classes.sendButtonIcon} />
                    </Button>
                </FormControl>
            </form>
        )
    }
}

export default withStyles(styles)(MessageBox);