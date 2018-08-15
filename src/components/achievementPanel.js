import React, { Component } from 'react';
import Section from './section';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

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
    }
});

class AchievementPanel extends Component {
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
                            <Button color="primary" style={{ marginTop: 8 }} variant="contained">
                                I {type.submitText}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Section>
        )
    }
}

export default withStyles(styles)(AchievementPanel);
