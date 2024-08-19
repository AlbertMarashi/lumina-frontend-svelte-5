import {RecordId as BaseRecordId, Surreal as BaseSurreal, type Prettify, type QueryParameters, type RecordIdValue} from "surrealdb.js"
import { z } from "zod"

export interface RecordId<Tb extends string = string> {
    tb: Tb
    id: string
}

export function new_record<Tb extends string>(tb: Tb, id: string): RecordId<Tb> {
    return {
        tb,
        id
    }
}

export function record_to_string(record: RecordId<string>): string {
    return `${record.tb}:${record.id}`
}

export class Surreal extends BaseSurreal {
    async query<T extends unknown[]>(...args: QueryParameters): Promise<Prettify<T>> {
        if (args[1] instanceof Array) return convert_to_record_id(await super.query(...args)) as unknown as Promise<Prettify<T>>
        if (args[1]) args[1] = convert_to_record_id_class(args[1]) as Record<string, unknown>
        return convert_to_record_id(await super.query(...args)) as unknown as Promise<Prettify<T>>
    }
}

export function zod_record_id<Tb extends string>(tb: Tb) {
    return z.object({
        tb: z.literal(tb),
        id: z.string(),
    })
}

function convert_to_record_id(value: unknown): unknown {
    if (value instanceof BaseRecordId) {
        return {
            tb: value.tb,
            id: value.id,
        }
    }

    if (Array.isArray(value)) return value.map(convert_to_record_id)
    if (typeof value === "object" && value !== null) {
        const converted: Record<string, unknown> = {}
        for (const [key, val] of Object.entries(value)) {
            converted[key] = convert_to_record_id(val)
        }
        return converted
    }
    return value
}

function convert_to_record_id_class(value: unknown): unknown {
    if (value instanceof BaseRecordId) return value
    if (Array.isArray(value)) return value.map(convert_to_record_id_class)
    if (typeof value === "object" && value !== null) {
        if (is_record_id(value)) return new BaseRecordId(value.tb, value.id)
        const converted: Record<string, unknown> = {}
        for (const [key, val] of Object.entries(value)) {
            converted[key] = convert_to_record_id_class(val)
        }
        return converted
    }
    return value
}

const typeofs_allowed: Record<string, true | undefined> = {
    string: true,
    number: true,
    boolean: true,
    bigint: true,
}

function is_record_id_value(id: unknown): id is RecordIdValue {
    if (typeofs_allowed[typeof id]) return true
    if (Array.isArray(id)) return true
    if (typeof id === "object" && id !== null) return true
    return false
}

export function is_record_id(value: unknown): value is RecordId<string> {
    if (
        typeof value === "object"
        && value !== null
        && "tb" in value
        && typeof value.tb === "string"
        && "id" in value
        && is_record_id_value(value.id)
    ) {
        return true
    }
    return false
}
