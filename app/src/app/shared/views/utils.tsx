import * as React from "react";
import {Field, WrappedFieldProps, BaseFieldProps, ComponentConstructor} from "redux-form";

const loading_animation = require("./images/loading_animation.png");

interface OurFieldProps extends BaseFieldProps {
    label?: string;
    placeholder?: string;
    type: string;
    /**
     * Made required
     */
    name: string;
    /**
     * Disabled as not used
     */
    props?: undefined;
    /**
     * Made required
     */
    component: ComponentConstructor<ComponentProps> | "input" | "select" | "textarea";
}

interface ComponentProps extends WrappedFieldProps<{}>, OurFieldProps {
}

/**
 * Adds some type hints (Field accepts any props)
 * TODO: explore react typings for this as it seems under powered.
 * Will have to deal with FieldArray too.
 */
export function OurField (props: OurFieldProps, s: {}) {
    return <Field {...props} />;
}

export function render_form_field ({ input, label, placeholder, type, meta}: ComponentProps): JSX.Element {

    let { touched, error, warning } = meta;
    return (
    <div>
        {label && <label>{label}</label>}
        <div>
            <input {...input} placeholder={placeholder || label} type={type}/>
            {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </div>
    </div>);
}

export function make_spinner (text: string = "Loading...", width: number = 60) {

    return (
    <span>
        <span>{text}</span>
        <span className="spinner_container">
            <img src={loading_animation} alt="loading animation" style={{width}}/>
        </span>
    </span>);
}
