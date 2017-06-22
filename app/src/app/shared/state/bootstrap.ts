import {ResponsePayload} from "../../../shared/api";

export function get_bootstrapped_data(): ResponsePayload.BootStrap | undefined {
    // tslint:disable-next-line
    const bootstrap: ResponsePayload.BootStrap = (window as any).bootstrap;
    return bootstrap;
}
