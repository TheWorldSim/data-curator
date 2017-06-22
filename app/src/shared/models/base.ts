import {parse_date} from "@ajp/utils-ts/stored";
import {str_enum} from "@ajp/utils-ts/utils";

/**
 * Any field that exists on the model and is persisted to the db.
 */
export interface BaseDbFields {
    uuid: string;
    created_at: Date;
    modified_at: Date | null;
    deleted_at: Date | null;
}

/**
 * Extra fields that may be exchanged between server and client
 * May be removed to only be on the client in the future.
 */
export interface BaseModel extends BaseDbFields {
    // Temporary fields
    old_temp_id?: string;
    sync_state?: SYNC_STATE;
    sync_errors?: string[];
}

export const SYNC_STATES = str_enum(["UNSAVED", "SYNCING", "SYNCED", "ERROR"]);
export type SYNC_STATE = keyof typeof SYNC_STATES;

/**
 * Turns the fields in a model in POJO form to instances of the desired types
 * Used by to convert from db entries and from frontend Redux store?
 */
export function from_pojo<U extends BaseModel>(instance: U): U {
    // instance.saved = parse_bool(instance.saved);
    // instance.saving = parse_bool(instance.saving);

    instance.created_at = parse_date(instance.created_at);
    instance.modified_at = parse_date(instance.modified_at);
    instance.deleted_at = parse_date(instance.deleted_at);

    return instance;
}
