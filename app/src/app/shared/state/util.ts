import {str_enum} from "@ajp/utils-ts/utils";

import {BaseModel} from "../../../shared/models/base";

export const FETCH_STATES = str_enum(["IDLE", "FETCHING", "FETCH_SUCCESS", "FETCH_FAILED"]);
export type FETCH_STATE = keyof typeof FETCH_STATES;

let TEMP_ID = Math.round(Math.random() * -2047483647);

export function temp_id () {
    return `${--TEMP_ID}`;
}

export const OFFSET_SECONDS = 10;

/**
 * Make a date in the future to simulate what might be created on the server.
 * This should help avoid elements in a list thrashing about when they're created
 * though will have the effect of things being created in the future.
 */
export function new_date() {
    return new Date(new Date().getTime() + (OFFSET_SECONDS * 1000));
}

/**
 * If model is not save yet, return date to non offset date
 */
export function correct_date(date: Date): Date {
    const offset = OFFSET_SECONDS * 1000;
    return new Date(date.getTime() - offset);
}

export function make_find_by_id_predicate (id?: string) {

    return function find_by_id_predicate<T extends BaseModel>(element: T): boolean {

        return element.uuid === id || element.old_temp_id === id;
    };
}
