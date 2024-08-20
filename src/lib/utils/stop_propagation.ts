// Ensures that calls to this function are only made when the user is authenticated
export default function stop_propagation<T>(
    callback: (e: Event) => T
) {
    return (e: Event) => {
        e.stopPropagation()
        callback(e)
    }
}