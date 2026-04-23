import { writable, type Writable } from 'svelte/store'
export { writable, type Writable }

const stores: { [key: string]: Writable<any> } = {}

export function persisted<T>(key: string, initialValue: T): Writable<T> {
    const browser = typeof (window) !== 'undefined' && typeof (document) !== 'undefined'
    const storage = browser ? localStorage : null

    function updateStorage(key: string, value: T) {
        try {
            storage?.setItem(key, JSON.stringify(value))
        } catch (e) {
            console.error(e)
        }
    }

    function maybeLoadInitial(): T {
        const json = storage?.getItem(key)
        if (json == null) return initialValue
        return JSON.parse(json) || initialValue
    }

    if (!stores[key]) {
        const initial = maybeLoadInitial()
        const store = writable(initial, (set) => {
            if (browser) {
                const handleStorage = (event: StorageEvent) => {
                    if (event.key === key && event.newValue) {
                        let newVal: any
                        try {
                            newVal = JSON.parse(event.newValue)
                        } catch (e) {
                            console.error(event.newValue, e)
                            return
                        }
                        set(newVal)
                    }
                }
                window.addEventListener("storage", handleStorage)
                return () => window.removeEventListener("storage", handleStorage)
            }
        })

        const { subscribe, set } = store

        stores[key] = {
            set(value: T) {
                set(value)
                updateStorage(key, value)
            },
            update(callback: (value: T) => T) {
                return store.update((last) => {
                    const value = callback(last)

                    updateStorage(key, value)

                    return value
                })
            },
            subscribe
        }
    }
    return stores[key]
}
