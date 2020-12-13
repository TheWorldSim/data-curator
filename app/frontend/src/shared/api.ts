import * as Boom from "boom"
import * as Joi from "joi"


export namespace RequestPayload {
    export interface DemoRequestPayload {
        some_data: string
    }
    export const validate_demo_request = Joi.object().keys({
        some_data: Joi.string().min(5),
    })
}

export namespace ResponsePayload {

    export type DemoResponsePayload = {
        some_data: string
    } | Boom.Payload
}
