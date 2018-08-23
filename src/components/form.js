import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Select from './select';
import { RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from '@material-ui/core';

export default class Form extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            formData: this.props.fields.reduce((acc, field) => {
                acc[field.name] = field.value !== undefined ? (field.type === 'boolean' ? String(!!field.value) : field.value) : (field.type === 'boolean' ? 'false' : null);
                return acc;
            }, {}),
            touchedFields: []
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            formData: newProps.fields.reduce((acc, field) => {
                if (this.state.touchedFields.includes(field.name)) {
                    acc[field.name] = this.state.formData[field.name]
                } else {
                    acc[field.name] = field.value ? (field.type === 'boolean' ? String(!!field.value) : field.value) : this.state.formData[field.name];
                }
                return acc;
            }, {})
        });
    }

    onSubmit(e) {
        e.preventDefault();
        const output = {};
        this.props.fields.forEach(field => {
            if (typeof field.condition === 'function' && !field.condition(this.state.formData)) {
                output[field.name] = null;
            } else if (field.type === 'boolean') {
                output[field.name] = this.state.formData[field.name] === 'true';
            } else {
                output[field.name] = this.state.formData[field.name];
            }
        });

        this.props.onSubmit(output);
    }

    handleInputChange(event) {
        const target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        const maxLength = this.props.fields.find(field => field.name === name).maxLength;
        if(maxLength > 0 && maxLength < value.length) {
            value = value.slice(0, maxLength);
        }

        this.setState({
            formData: Object.assign({}, this.state.formData, { [name]: value }),
            touchedFields: Array.from(new Set([...this.state.touchedFields, name]))
        });
    }

    handleSelectInputChange(fieldName, value) {
        this.setState({
            formData: Object.assign({}, this.state.formData, { [fieldName]: value }),
            touchedFields: Array.from(new Set([...this.state.touchedFields, fieldName]))
        });
    }

    getSelectField(field) {
        return [<Select label={field.label}
            key={field.name}
            options={field.options}
            value={this.state.formData[field.name]}
            required={field.required}
            onChange={(value) => this.handleSelectInputChange(field.name, value)}
        />, <br key={field.name + "__br"} />];
    }

    getTextField(field) {
        const type = field.type === 'longText' ? 'text' : (field.type || 'text');

        let remainingText = '';
        if(field.type === 'longText' && field.maxLength > 0) {
            const currentValue = this.state.formData[field.name];
            remainingText = ` (${field.maxLength - (currentValue ? currentValue.length : 0)} characters remaining)`;
        }

        return [<TextField
            style={{ width: '100%', maxWidth: 600 }}
            key={field.name}
            type={type}
            multiline={field.type === 'longText'}
            rowsMax={8}
            margin="normal"
            helperText={(field.helperText || field.label) + remainingText}
            label={field.label}
            name={field.name}
            required={field.required}
            onChange={this.handleInputChange}
            value={this.state.formData[field.name] || ""}
        />, <br key={field.name + "__br"} />];
    }

    renderField(field, index) {
        switch (field.type) {

            case 'select':
                return this.getSelectField(field);
            case 'boolean':
                const styles = index < this.props.fields.length - 1 ? { minWidth: 200, marginBottom: -8, marginTop: 40 } : { minWidth: 200, marginTop: 40 }
                return [(
                    <FormControl key={field.name} component="fieldset" margin="normal" style={styles}>
                        <FormLabel component="legend" style={{ textAlign: 'left' }}>{field.label}</FormLabel>
                        <RadioGroup
                            style={{ flexDirection: 'row' }}
                            aria-label={field.label}
                            name={field.name}
                            value={this.state.formData[field.name]}
                            onChange={this.handleInputChange}>
                            <FormControlLabel value="true" control={<Radio color="primary" />} label="Yes" />
                            <FormControlLabel value="false" control={<Radio color="primary" />} label="No" />
                        </RadioGroup>
                    </FormControl>
                ), <br key={field.name + "__br"} />]
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
                <Typography variant="display1">
                    {this.props.title}
                </Typography>
                <form onSubmit={this.onSubmit}>
                    {this.props.fields
                        .filter(field => typeof field.condition !== 'function' || field.condition(this.state.formData))
                        .map((field, index) => this.renderField(field, index))}
                    <Button type="submit" style={{ marginTop: 15 }} variant="contained" color="primary">
                        {this.props.submitText || this.props.title}
                    </Button>
                </form>
            </div>
        )
    }
}
