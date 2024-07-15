export type DeepPartial<T> =
    T extends number | string | boolean | null ? T :
    T extends unknown[] ? Array<DeepPartial<T[number]>> :
    T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } :
    T;

export type FilterKeysByValueType<ValueType, T> = {
    [K in keyof T]: T[K] extends ValueType ? K : never
}[keyof T];



export type EventMap = {
    // args need to be any because the parameters can be different for each event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (...args: any[]) => void
}

export class TypedEventEmitter<T extends EventMap> {
    private listeners: {
        [K in keyof T]?: T[K][]
    } = {}

    on<K extends keyof T>(event: K, listener: T[K]) {
        if (!this.listeners[event]) {
            this.listeners[event] = []
        }
        this.listeners[event]?.push(listener)
    }

    emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>) {
        this.listeners[event]?.forEach(listener => listener(...args))
    }
}

export type Override<T, NewProps> = Omit<T, keyof NewProps> & NewProps;

export type MaybePromise<T> = T | Promise<T>;