import * as _ from "lodash";
import * as React from "react";
import {reduxForm, FormProps} from "redux-form";
import {valid_email_address} from "@ajp/utils-ts/email";

import CONFIG from "../../../shared/config";
import {OurField, render_form_field} from "../../shared/views/utils";
import {FORM_NAMES} from "../../shared/constants";
import {UserRegistrationFormDataShape as DataShape} from "../../shared/state/shape";
import {register_new_user} from "../../shared/state/user_registration/dispatchers";

const validate = (values: DataShape) => {
    const errors: Partial<DataShape> = {};
    if (!values.email) {
        errors.email = "Required";
    } else if (!valid_email_address(values.email)) {
        errors.email = "Does not appear to be an email address as we know it...";
    }

    if (!values.password) {
        errors.password = "Required";
    } else if (values.password.length < CONFIG.MIN_PASSWORD_LENGTH) {
        errors.password = `For your security you need ${CONFIG.MIN_PASSWORD_LENGTH} characters or more`;
    }
    return errors;
};

const warn = (values: DataShape) => {
    const warnings: Partial<DataShape> = {};
    const desired = values.password ? 12 - values.password.length : 0;
    if (desired > 0) {
        warnings.password = `${desired} more characters would be safer https://xkcd.com/936/`;
    }
    return warnings;
};

class SignUpForm extends React.Component<FormProps<DataShape, {}, {}>, {}> {

    // tslint:disable-next-line
    constructor(props?: any, context?: any) {
        super(props, context);
        const email = `a${ Math.round( Math.random() * 10000 ) }@b.c`;
        _.defer(() => this.props.initialize!({email, password: ""}));
    }

    render() {
        const {handleSubmit, pristine, reset, submitting} = this.props;
        const our_handle_submit = (values: DataShape) => {
            register_new_user({
                email: values.email!,
                password: values.password!,
            });
        };

        return (
        <form onSubmit={handleSubmit!(our_handle_submit)}>
            <OurField name="email" label="Email" component={render_form_field} type="email"/>
            <OurField name="password" label="Password" component={render_form_field} type="password"/>
            <div>
                <button type="submit" disabled={pristine || submitting}>Submit</button>
                <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
            </div>
        </form>);
    }
}

const DecoratedSignUpForm = reduxForm({
    form: FORM_NAMES.user_registration,  // a unique identifier for this form
    validate,             // <--- validation function given to redux-form
    warn,                 // <--- warning function given to redux-form
})(SignUpForm);

export default DecoratedSignUpForm;
