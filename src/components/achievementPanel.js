import React, { Component } from 'react';
import Section from './section';
import AuthService from '../services/auth-service';
import endpoints from '../services/endpoints';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Form from './form';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from './snackbar';

const styles = theme => ({
    grid: {
        padding: theme.spacing.unit,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
    },
    wrap: {
        wordWrap: 'break-word',
        whiteSpace: 'normal',
    },
    modal: {
        position: 'relative',
        margin: `10% ${theme.spacing.unit * 4}px`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
    },
    modalContent: {
        padding: theme.spacing.unit * 4,
    },
    closeButton: {
        position: 'absolute',
        right: 5,
        top: 5
    }
});

const whenOptions = () => Promise.resolve([
    { label: "Just Now", value: 0 },
    { label: "5 Minutes Ago", value: 5 },
    { label: "15 Minutes Ago", value: 15 },
    { label: "30 Minutes Ago", value: 30 },
    { label: "1 Hour Ago", value: 60 },
    { label: "Custom", value: -1 }
]);

class AchievementPanel extends Component {

    constructor(props) {
        super(props);
        this.state = { modalOpen: false, snackbarOpen: false };

        this.openAchievementModal = this.openAchievementModal.bind(this);
        this.closeAchievementModal = this.closeAchievementModal.bind(this);
        this.onSnackbarClose = this.onSnackbarClose.bind(this);
        this.postAchievement = this.postAchievement.bind(this);
    }

    openAchievementModal() {
        this.setState({ modalOpen: true });
    }

    closeAchievementModal() {
        this.setState({ modalOpen: false });
    };

    onSnackbarClose() {
        this.setState({ snackbarOpen: false });
    };

    async postAchievement(formData) {
        const time = formData.when === -1 ? (new Date(formData.whenCustom).getTime()) : (Date.now() - formData.when * 1000 * 60);
        const data = await AuthService.makeAuthenticatedRequest(`${endpoints.achievementTrackerApi}/event`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                time,
                eventType: this.props.type.id,
                summary: formData.summary
            })
        })

        console.log(data);
        
        this.setState({ snackbarOpen: true, modalOpen: false });
    }

    render() {
        const { classes, type, stats } = this.props;
        return (
            <Section>
                <Typography variant="display1">{type.name}</Typography>
                <Grid container spacing={16} className={classes.grid}>
                    <Grid item xs={6}>
                        <Paper className={classes.paper}>
                            <Typography variant="subheading" className={classes.wrap}>{type.name} last week</Typography>
                            <Typography variant="title" color="primary">{stats.lastWeek}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.paper}>
                            <Typography variant="subheading" className={classes.wrap}>{type.name} this week</Typography>
                            <Typography variant="title" color="primary">{stats.currentWeek}</Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="title" className={classes.wrap}>{type.name} Today</Typography>
                            <Typography variant="display1" color="primary">{stats.today}</Typography>
                            <Button color="primary" style={{ marginTop: 8 }} variant="contained" onClick={this.openAchievementModal}>
                                I {type.actionText}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
                <Modal
                    open={this.state.modalOpen}
                    onClose={this.closeAchievementModal}
                    disableBackdropClick={true}>
                    <div className={classes.modal}>
                        <IconButton aria-label="Close" onClick={this.closeAchievementModal} className={classes.closeButton}>
                            <CloseIcon />
                        </IconButton>
                        <div className={classes.modalContent}>
                            <Form title="Great! Tell us more..."
                                submitText="Confirm"
                                onSubmit={this.postAchievement}
                                fields={[
                                    { name: 'when', type: 'select', required: true, value: 0, label: 'When did this happen?', options: whenOptions },
                                    { name: 'whenCustom', type: 'datetime-local', required: true, value: new Date().toISOString().slice(0, -8), label: '', condition: ({ when }) => when === -1 },
                                    { name: 'summary', type: 'longText', maxLength: 500, required: false, label: 'Any Details?' },
                                ]} />
                        </div>
                    </div>
                </Modal>
                <Snackbar message="Achievement Saved Successfully" open={this.state.snackbarOpen} onClose={this.onSnackbarClose}/>
            </Section>
        )
    }
}

export default withStyles(styles)(AchievementPanel);
