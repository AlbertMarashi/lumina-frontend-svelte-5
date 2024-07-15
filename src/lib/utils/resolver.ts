
export function create_resolver<T>(): {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    } {
    let resolve: (value: T | PromiseLike<T>) => void

    const promise = new Promise<T>(r => resolve = r)

    return {
        promise,
        resolve: resolve!,
    }
}