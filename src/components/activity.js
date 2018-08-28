import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MessageIcon from '@material-ui/icons/Message';
import AuthService from '../services/auth-service';
import endpoints from '../services/endpoints';
import teamCache from '../services/team-cache';
import MessageBox from './messageBox';
import colourPicker from '../services/colour-picker';

const styles = theme => (console.log(theme) || {
    card: {
        maxWidth: 600,
        margin: '20px auto',
        textAlign: 'left'
    },
    actions: {
        display: 'flex',
    },
    commentSender: {
        display: 'flex',
        marginBottom: theme.spacing.unit
    },
    commentSenderName: {
        flex: '1 1 auto'
    },
    commentTime: {
        color: theme.palette.text.secondary
    },
    commentText: {
        marginLeft: 32
    },
    expandButton: {
        marginLeft: 'auto',
    },
    avatarSmall: {
        width: theme.spacing.unit * 3,
        height: theme.spacing.unit * 3,
        fontSize: 14,
        marginRight: theme.spacing.unit,
    },
    expandSection: {
        borderTop: `1px solid ${theme.palette.divider}`,
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px 0`,
        '&:last-child': {
            paddingBottom: theme.spacing.unit * 2
        }
    },
});

class Activity extends React.Component {
    state = { expanded: false, comments: null, likeClicked: false };
    loadingComments = false;

    handleExpandClick = () => {
        this.getComments();
        this.setState(state => ({ expanded: !state.expanded }));
    };

    getComments = (refresh) => {
        if (this.loadingComments || (this.state.comments && !refresh)) {
            return;
        }
        this.loadingComments = true;
        AuthService.makeAuthenticatedRequest(`${endpoints.achievementTrackerApi}/event/comments?id=${this.props.activity.id}`)
            .then(comments => {
                comments.data.forEach(comment => {
                    comment.user = teamCache.getUser(comment.user);
                });
                this.props.activity.comments = comments.data.length;
                this.setState({ comments: comments.data });
                this.loadingComments = false;
            });
    }

    onMessageSent = (comment) => {
        comment.user = teamCache.getUser(comment.user);
        this.props.activity.commentByUser = true;
        this.setState({ comments: this.state.comments.concat([comment]) });
    }

    onLike = async () => {
        this.setState({ likeClicked: true });
        const action = this.props.activity.likedByUser ? 'unlike' : 'like';
        try {
            await AuthService.makeAuthenticatedRequest(`${endpoints.achievementTrackerApi}/event/${action}?id=${this.props.activity.id}`, {method: 'POST'});
            this.props.activity.likedByUser = !this.props.activity.likedByUser;
            this.props.activity.likes += (this.props.activity.likedByUser ? 1 : -1);
        } finally {
            this.setState({ likeClicked: false });
        }
    }

    render() {
        const { classes, activity } = this.props;

        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label={activity.user.name[0]} style={colourPicker(activity.user.id)}>
                            {activity.user.name[0]}
                        </Avatar>
                    }
                    title={activity.user.name + ' ' + activity.eventType.actionText}
                    subheader={new Date(activity.time).toLocaleString()}
                />
                <CardContent>
                    {activity.summary ? <Typography component="p">
                        {activity.summary}
                    </Typography> : ''}
                </CardContent>
                <CardActions className={classes.actions} disableActionSpacing>
                    <IconButton aria-label="Like this" disabled={this.state.likeClicked} color={activity.likedByUser !== this.state.likeClicked ? 'primary' : 'default'} onClick={this.onLike}>
                        <FavoriteIcon />
                        {activity.likes}
                    </IconButton>
                    <IconButton
                        className={classes.expandButton}
                        onClick={this.handleExpandClick}
                        aria-expanded={this.state.expanded}
                        aria-label="Show comments"
                        color={activity.commentByUser? 'primary' : 'default'}
                    >
                        <MessageIcon/>
                        {activity.comments}
                    </IconButton>
                </CardActions>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                    <CardContent className={classes.expandSection}>
                        {this.state.comments && this.state.comments.length ? this.state.comments.map(comment => (
                            <div key={comment.id}>
                                <div className={classes.commentSender}>
                                    <Avatar aria-label={comment.user.name[0]} className={classes.avatarSmall} style={colourPicker(comment.user.id)}>
                                        {comment.user.name[0]}
                                    </Avatar>
                                    <Typography variant="body2" className={classes.commentSenderName}>
                                        {comment.user.name}
                                    </Typography>
                                    <Typography variant="body2" className={classes.commentTime}>
                                        {new Date(comment.time).toLocaleString()}
                                    </Typography>
                                </div>
                                <Typography paragraph className={classes.commentText}>
                                    {comment.text}
                                </Typography>
                            </div>
                        )) : <Typography paragraph>{this.state.comments ? 'No comments have been posted yet' : 'Loading...'}</Typography>}
                    </CardContent>
                    <CardContent className={classes.expandSection}>
                        <MessageBox eventId={activity.id} onMessageSent={this.onMessageSent} />
                    </CardContent>

                </Collapse>
            </Card>
        );
    }
}

Activity.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Activity);
