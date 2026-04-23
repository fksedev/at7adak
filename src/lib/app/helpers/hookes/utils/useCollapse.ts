export function useCollapse (node, params?: { open?: boolean, duration?: number, easing?: string }) {
    params = {...{ open: true, duration: 0.2, easing: 'ease' }, ...params}

    let transitionEndResolve: any = () => {}
    let transitionEndReject: any = () => {}

    const listener = node.addEventListener('transitionend', () => {
        transitionEndResolve()
        transitionEndResolve = () => {}
        transitionEndReject = () => {}
    })

    const asyncTransitionEnd = async () => new Promise((resolve, reject) => {
        transitionEndResolve = resolve
        transitionEndReject = reject
    })
    const nextFrame = async () => new Promise(requestAnimationFrame)
    const transition = () => `height ${params!.duration}s ${params!.easing}`

    node.style.transition = transition()
    node.style.height = params.open ? 'auto' : '0px'
    node.style.overflow = params.open ? 'visible' : 'hidden'

    async function enter () {
        node.style.height = node.scrollHeight + 'px'
        try {
            await asyncTransitionEnd()
            node.style.height = 'auto'
            node.style.overflow = 'visible'
        } catch(err) {}

    }

    async function leave () {
        if (node.style.height === 'auto') {
            node.style.transition = 'none'
            await nextFrame()
            node.style.height = node.scrollHeight + 'px'
            node.style.transition = transition()
            await nextFrame()
            node.style.overflow = 'hidden'
            node.style.height = '0px'

        } else {
            transitionEndReject()
            node.style.overflow = 'hidden'
            node.style.height = '0px'
        }
    }

    return { 
        update: (newParams) => {
            params = Object.assign(params!, newParams)
            params!.open ? enter() : leave()
        }, 
        destroy: () => node.removeEventListener('transitionend', listener)
    }
}
