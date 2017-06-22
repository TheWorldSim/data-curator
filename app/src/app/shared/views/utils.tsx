import * as React from "react";
import {Field, WrappedFieldProps} from "redux-form";

const loading_animation = require("./images/loading_animation.png");

interface OurFieldProps {
    label: string;
    type: string;
    name: string;
    component(p: ComponentProps): JSX.Element;
}

interface ComponentProps extends WrappedFieldProps<{}>, OurFieldProps {
}

/**
 * Adds some type hints (Field accepts any props)
 */
export function OurField (props: OurFieldProps, s: {}) {
    return <Field {...props} />;
}

export function render_form_field ({ input, label, type, meta}: ComponentProps): JSX.Element {

    let { touched, error, warning } = meta;
    return (
    <div>
        <label>{label}</label>
        <div>
            <input {...input} placeholder={label} type={type}/>
            {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </div>
    </div>);
}

export function make_spinner (text: string = "Loading...") {

    return (
    <div>
        <span>{text}</span>
        <div className="spinner_container">
            <img src={loading_animation} alt="loading animation" style={{width: 60}}/>
        </div>
    </div>);
}
