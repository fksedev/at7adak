import isEqual from './isequal'
import cloneDeep from './clonedeep'

const depsAreEqual = (deps1, deps2) => {
    return isEqual(deps1, deps2)
}

const getDepNames = (deps) => {
    return Object.keys(deps || {})
}

const getUpdatedDeps = (depNames, currentData) => {
    const updatedDeps = {}
    depNames.forEach((depName) => {
        updatedDeps[depName] = currentData[depName]
    })
    return updatedDeps
}

interface Subscribers {
    [watcherName: string]: {
        deps: object,
        fn: Function,
    }
}

const createSubscription = () => {
    const subscribers: Subscribers = {}

    const memoDependency = (target, dep) => {
        const { watcherName, fn } = target
        const { prop, value } = dep

        if (!subscribers[watcherName]) {
            subscribers[watcherName] = {
                deps: {},
                fn,
            }
        }
        subscribers[watcherName].deps[prop] = value
    }

    return {
        subscribers,
        subscribe(target, dep) {
            if (target) {
                memoDependency(target, dep)
            }
        },
        notify(data, prop) {
            Object.entries(subscribers).forEach(([watchName, { deps, fn }]) => {
                const depNames = getDepNames(deps)

                if (depNames.includes(prop)) {
                    const updatedDeps = getUpdatedDeps(depNames, data)
                    if (!depsAreEqual(deps, updatedDeps)) {
                        subscribers[watchName].deps = updatedDeps
                        fn()
                    }
                }
            })
        },
    }
}

const createTargetWatcher = () => {
    let target: any = null

    return {
        targetWatcher(watcherName, fn) {
            target = {
                watcherName,
                fn,
            }
            target.fn()
            target = null
        },
        getTarget() {
            return target
        },
    }
}

const noop = () => { }

export function simplyReactive(entities, options) {
    const data = entities?.data || {}
    const watch: any = entities?.watch || {}
    const methods: any = entities?.methods || {};
    const onChange = options?.onChange || noop

    const { subscribe, notify, subscribers } = createSubscription()
    const { targetWatcher, getTarget } = createTargetWatcher()

    let _data
    const _methods: any = {}
    const getContext = () => ({
        data: _data,
        methods: _methods,
    })

    let callingMethod = false
    const methodWithFlags = (fn) => (...args) => {
        callingMethod = true
        const result = fn(...args)
        callingMethod = false
        return result
    }

    // init methods before data, as methods may be used in data
    Object.entries(methods).forEach(([methodName, methodItem]) => {
        // @ts-ignore
        _methods[methodName] = methodWithFlags((...args) => methodItem(getContext(), ...args))
        Object.defineProperty(_methods[methodName], 'name', { value: methodName })
    })

    _data = new Proxy(cloneDeep(data), {
        get(target, prop) {
            if (getTarget() && !callingMethod) {
                subscribe(getTarget(), { prop, value: target[prop] })
            }
            return Reflect.get.apply(null, arguments)
        },
        set(target, prop, value) {
            // if value is the same, do nothing
            if (target[prop] === value) {
                return true
            }

            Reflect.set.apply(null, arguments)

            if (!getTarget()) {
                onChange && onChange(prop, value)
                notify(_data, prop)
            }

            return true
        },
    })

    Object.entries(watch).forEach(([watchName, watchItem]) => {
        targetWatcher(watchName, () => {
            // @ts-ignore
            watchItem(getContext())
        })
    })

    const output: any = [_data, _methods]
    output._internal = {
        _getSubscribers() {
            return subscribers
        },
    }

    return output
}
