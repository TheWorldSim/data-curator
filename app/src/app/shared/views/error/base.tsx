import * as React from "react";

import CONFIG from "../../../../shared/config";
import NavLinkCustom from "../nav_link";

export abstract class BaseErrorPage extends React.Component<{errored_url: string, error_message?: string}, {}> {

    abstract get_error_code(): string;
    abstract get_title(): string;
    abstract get_sub_title(url: string): string;

    link_to_show(): React.ReactElement<{}> {
        return <NavLinkCustom to="/">Home</NavLinkCustom>;
    }

    render() {
        const url = this.props.errored_url;
        const error = this.props.error_message || `Please try again or email ${CONFIG.SUPPORT_EMAIL}`;

        return (
        <div>
            <div className="col-xs-1"/>
            <div className="col-xs-22">
                <h1>{this.get_title()}</h1>

                <br />

                <h5>{this.get_sub_title(url)} {url}</h5>
                <h5 className="h5_light">
                    {error}
                </h5>

                {this.link_to_show()}
            </div>
            <div className="col-xs-1"/>
        </div>
        );
    }
}
