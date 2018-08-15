import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import { FormControl, FormLabel } from '@material-ui/core';

const styles = theme => ({
    input: {
        display: 'flex',
        padding: 0,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        width: "100%",
        zIndex: 1
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});

function NoOptionsMessage(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
}

function Control(props) {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function SingleValue(props) {
    return (
        <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}


function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Option,
    Control,
    NoOptionsMessage,
    Placeholder,
    SingleValue,
    ValueContainer,
    Menu,
};

class IntegrationReactSelect extends React.Component {
    state = {
        single: null,
        multi: null,
    };

    constructor(props) {
        super(props);
        this.state = { options: [], value: this.props.value || null };
        this.props.options().then(options => this.setState({ options, value: options.find(option => option.value === this.props.value) }));
    }

    componentWillReceiveProps(newProps) {
        if (newProps.value && !this.state.value && this.state.options) {
            this.setState({
                value: this.state.options.find(option => option.value === newProps.value)
            });
        }
    }

    handleChange = item => {
        this.setState({ value: item });
        this.props.onChange && this.props.onChange(item.value);
    };

    render() {
        const { classes, theme } = this.props;

        const selectStyles = {
            input: base => ({
                ...base,
                color: theme.palette.text.primary,
            }),
        };
        const styles = { minWidth: 200 };

        return (
            <FormControl component="fieldset" margin="normal" style={styles}>
                <FormLabel component="legend" style={{ textAlign: 'left' }}>{this.props.label}</FormLabel>
                <Select
                    classes={classes}
                    styles={selectStyles}
                    options={this.state.options}
                    components={components}
                    value={this.state.value}
                    onChange={this.handleChange}
                    placeholder="None"
                />
            </FormControl>
        );
    }
}

IntegrationReactSelect.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    label: PropTypes.string,
    options: PropTypes.func,
    value: PropTypes.any,
    onChange: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(IntegrationReactSelect);

