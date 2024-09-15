import { global_state } from "$lib/stores/global"
import type { MaybePromise } from "$lib/types/ts_utils"

export default <Args extends unknown[], T>(
    callback: (...args: Args) => MaybePromise<T>,
    subscriber: (value: boolean) => unknown = status => global_state.inner.loading = status
) => {
    return async (...args: Args) => {
        subscriber(true)
        try {
            await callback(...args)
            subscriber(false)
        } catch (err) {
            subscriber(false)
            throw err
        }
    }
}
