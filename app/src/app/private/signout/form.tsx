import * as React from "react";

import {signout} from "../../shared/state/user_session/dispatchers";

interface Props {}

export class SignOutForm extends React.Component<Props, {submitting: boolean}> {
    // tslint:disable-next-line
    constructor(p: Props, c: any) {
        super(p, c);
        this.state = { submitting: false };
    }

    render() {

        const handle_submit = () => {
            this.setState({submitting: true});
            signout();
        };

        return (
        <form onSubmit={handle_submit}>
            <button type="submit" disabled={this.state.submitting}>Sign out</button>
        </form>);
    }
}
