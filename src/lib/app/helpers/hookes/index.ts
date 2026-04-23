import * as runed from './runed'

export * from './utils'

export { 
    useDebounce, 
    useEventListener, 
    useGeolocation, 
    useIntersectionObserver, 
    useMutationObserver, 
    useResizeObserver,
    resource as useResource,
    IsMounted,
    watch,
    activeElement,
} from './runed'

export const useAutosize = (node: HTMLTextAreaElement) => {
    new runed.TextareaAutosize(node)
}
export const useContext = <T>(name: string) => new runed.Context<T>(name)
export const useKeys = () => new runed.PressedKeys()
export const useRect = (node, options?: {initialRect?: DOMRect;}) => new runed.ElementRect(node, options)
export const useSize = (node, options?: {box?: "content-box" | "border-box"}) => new runed.ElementSize(node, options)
export const useScrollState = (options: runed.ScrollStateOptions) => new runed.ScrollState(options)

export const useStateHistory = <T>(
    getter: runed.MaybeGetter<T>,
    setter: runed.Setter<T>,
    options?: {capacity?: runed.MaybeGetter<number>;}
) => new runed.StateHistory(getter, setter, options)

export const useMounted = () => new runed.IsMounted()
export const useIsIdle = (options?: runed.IsIdleOptions) => new runed.IsIdle(options)
export const useInViewport = (node, options?: runed.IsInViewportOptions) => new runed.IsInViewport(node, options)
export const useIsFocusWithin = (node, options?: runed.IsFocusWithinOptions) => new runed.IsFocusWithin(node, options)
export const usePrevious = <T>(getter: runed.Getter<T>, initial?: T) => new runed.Previous(getter, initial)
