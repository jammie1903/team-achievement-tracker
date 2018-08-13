import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const br = <br />;

export default class Form extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = this.props.fields.reduce((acc, field) => { acc[field.name] = null; return acc; })
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    getTextField(field) {
        return [<TextField
            key={field.name}
            type={field.type || 'text'}
            margin="normal"
            helperText={field.helperText || field.label}
            label={field.label}
            name={field.name}
            required={field.required}
            onChange={this.handleInputChange}
        />, <br key={field.name + "__br"} />];
    }

    renderField(field) {
        switch (field.type) {
            case 'password':
                const passwordField = this.getTextField(field);
                if (field.confirm) {
                    const confirmPasswordField = this.getTextField({
                        type: field.type,
                        name: field.name + 'Confirm',
                        required: field.required,
                        label: "Confirm " + field.label,
                        helperText: field.confirmHelperText || "Confirm " + (field.helperText || field.label),
                    });
                    return [passwordField, confirmPasswordField];
                }
                return passwordField;
            default:
                return this.getTextField(field);
        }
    }

    render() {
        return (
            <div className="Form">
                <Typography variant="headline" style={{ marginTop: 20 }}>
                    {this.props.title}
                </Typography>
                <form onSubmit={this.onSubmit}>
                    {this.props.fields.map(field => this.renderField(field))}
                    <Button type="submit" style={{ margin: 15 }} variant="contained" color="primary">
                        {this.props.submitText || this.props.title}
                    </Button>
                </form>
            </div>
        )
    }
}
