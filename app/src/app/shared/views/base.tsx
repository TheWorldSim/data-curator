import * as React from "react";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";

import {AppState} from "../state/shape";

export interface StateMappedToProps {
    state: AppState;
}
export interface RouteAndStateMappedToProps extends RouteComponentProps<{}>, StateMappedToProps {}

/**
 * This can only be used when performance / UX does not become a problem.
 * https://github.com/reactjs/react-redux/blob/7337f1a5de42c76b69e56f713ac933aed
 * cb12867/docs/api.md#inject-dispatch-and-every-field-in-the-global-state
 */
function map_state_to_props(state: AppState): StateMappedToProps {

    return {state: state};
}

/**
 * These classes can be subclassed for use inside the <Provider> which along with
 * connect_to_all_state_for_routes or connect_to_all_state will provide access
 * to all the state (but also comes with performance penalties:
 * https://github.com/reactjs/react-redux/blob/7337f1a5de42c76b69e56f713ac933aed
 * cb12867/docs/api.md#inject-dispatch-and-every-field-in-the-global-state
 * )
 */
export class Base extends React.Component<StateMappedToProps, {}> {
}
export class BaseForRoutes extends React.Component<RouteAndStateMappedToProps, {}> {
}

/**
 * This can only be used when performance / UX does not become a problem.
 * https://github.com/reactjs/react-redux/blob/7337f1a5de42c76b69e56f713ac933aed
 * cb12867/docs/api.md#inject-dispatch-and-every-field-in-the-global-state
 *
 * Use this to create react classes that are provided with all the application
 * state (made possible by nesting inside `<Provider store={app_store}>`)
 * The signature of the return `React.ComponentClass<{}>` allows it to be used
 * without type error when nested inside the `<Provider ...`
 *
 *      class ConnectedContainer extends RxBase<{}, {}> {
 *          render() { this.state.session }
 *      }
 *
 *      <Provider store={app_store}>
 *        <Router history={enhanced_history}>
 *          <Route path="/" component={connect_to_all_state(ConnectedContainer)}>
 *
 *
 * Alternatively you will need to do the following:
 *
 *      interface WrappedSessionState {
 *          session_state: SessionStateShape;
 *      }
 *      const map_state_to_props = (state: IAppState): WrappedSessionState => {
 *          return {session_state: state.session};
 *      }
 *      interface Props extends RouteComponentProps<{}>, WrappedSessionState {}
 *
 *      class AContainer extends ReactComponentBase<Props, {}> {
 *          render() { this.session_state }
 *      }
 *
 *      const ConnectedContainer = connect(map_state_to_props)(AContainer);
 */
export function connect_to_all_state(RxComponent:
    new(p: StateMappedToProps) => React.Component<StateMappedToProps, {}>) {
    return connect(map_state_to_props)<{}>(RxComponent);
}
export function connect_to_all_state_for_routes(RxComponent:
    new(p: RouteAndStateMappedToProps) => React.Component<RouteAndStateMappedToProps, {}>) {
    return connect(map_state_to_props)<RouteComponentProps<{}>>(RxComponent);
}
