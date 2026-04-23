import { writable, type Readable } from "svelte/store";

export const useMobile = (): Readable<boolean> => {
    let { set, subscribe } = writable<boolean>(false)
    if(typeof window === 'undefined') return { subscribe }

    const mql = window.matchMedia(`(max-width: 767px)`)
    const onChange = () => set(window.innerWidth < 768)
    mql.addEventListener("change", onChange)
    onChange()

    return { subscribe }
}

export const useMobileWithSet = (): [Readable<boolean>, (value: boolean) => void] => {
    let { set, subscribe } = writable<boolean>(false)
    if(typeof window === 'undefined') return [{ subscribe }, set]

    const mql = window.matchMedia(`(max-width: 767px)`)
    const onChange = () => set(window.innerWidth < 768)
    mql.addEventListener("change", onChange)
    onChange()

    return [{ subscribe }, set]
}
