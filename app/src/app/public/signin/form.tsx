import * as React from "react";
import {connect} from "react-redux";
import {reduxForm, FormProps} from "redux-form";

import {UserSignInFormDataShape as DataShape, AppState} from "../../shared/state/shape";
import {signin} from "../../shared/state/user_session/dispatchers";
import {FORM_NAMES} from "../../shared/constants";
import {OurField, render_form_field} from "../../shared/views/utils";

function validate(values: DataShape) {

    const errors: Partial<DataShape> = {};
    let value = values.email;
    if (!value) {
        errors.email = "Required";
    }

    if (!values.password) {
        errors.password = "Required";
    }
    return errors;
}

export interface SignInFormProps extends FormProps<DataShape, {}, {}> {
}

class SignInForm extends React.Component<SignInFormProps, {}> {

    render() {

        const {handleSubmit, pristine, reset, submitting} = this.props;
        const our_handle_submit = (values: DataShape) => {

            if (this.props.valid) {
                signin({
                    username_or_email: values.email!,
                    password: values.password!,
                });
            }
        };

        return (
        <form onSubmit={handleSubmit!(our_handle_submit)}>
            <OurField name="email" type="text" component={render_form_field} label="Email"/>
            <OurField name="password" type="password" component={render_form_field} label="Password"/>
            <div>
                <button type="submit" disabled={pristine || submitting}>Submit</button>
                <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
            </div>
        </form>);
    }
}

const DecoratedSignInForm = reduxForm<DataShape, {}, {}>({
    form: FORM_NAMES.user_signin,  // a unique identifier for this form
    validate,             // <--- validation function given to redux-form
})(SignInForm);

export const ConnectedDecoratedSignInForm = connect((state: AppState) => {

    return {
        initialValues: {
            // pull initial value from user state
            email: state.user.newly_registered_user_email,
        },
    } as {initialValues?: DataShape};
})(DecoratedSignInForm);
