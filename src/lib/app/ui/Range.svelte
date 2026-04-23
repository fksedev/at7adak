
<script lang="ts">

    type Formatter = (value: number, index?: number, percent?: number) => string | number;
    type RAction = (v: {
        activeHandle: any,  
        startValue?: unknown,
        previousValue?: unknown,
        value: unknown,
        values: number[],
    }) => void

    let {
        sm = false,
        handleVertical = false,
        withText = false,
        label = "",
        labelValue = "",
        help = "",

        slider = undefined,
        range = "min",
        pushy = false,
        min = 0,
        max = 100,
        step = 1,
        values = $bindable([(max + min) / 2]),
        vertical = false,
        reversed = false,
        hoverable = true,
        disabled = false,

        pips = false,

        id = undefined,
        prefix = "",
        suffix = "",

        formatter = (v, i, p) => v,
        handleFormatter = (v, i, p) => v,
        ariaLabels = [],

        precision = 2,
        onstart,
        onstop,
        onchange,
    }: {
        sm?: boolean,
        handleVertical?: boolean,
        withText?: boolean,
        label?: string,
        labelValue?: string,
        help?: string,
        slider?: any,
        range?: boolean | 'min' | 'max',
        pushy?: boolean,
        min?: number,
        max?: number,
        step?: number,
        values?: number[],
        vertical?: boolean,
        float?: boolean,
        reversed?: boolean,
        hoverable?: boolean,
        disabled?: boolean,
        pips?: boolean,
        id?: string | undefined,
        prefix?: string,
        suffix?: string,
        formatter?: Formatter,
        handleFormatter?: Formatter,
        ariaLabels?: string[],
        precision?: number,
        onstart?: RAction,
        onstop?: RAction,
        onchange?: RAction,
    } = $props()

    // state management
    let valueLength = $state(0)
    let focus = $state(false)
    let handleActivated = $state(false)
    let handlePressed = $state(false)
    let keyboardActive = $state(false)
    // svelte-ignore state_referenced_locally
    let activeHandle = $state(values.length - 1)
    let startValue = $state()
    let previousValue = $state()

    let springPositions = $state<number[]>([])

    const fixFloat = (v) => parseFloat((+v).toFixed(precision))

    $effect(() => {
        if (!Array.isArray(values)) {
            values = [(max + min) / 2]
            console.error("'values' prop should be an Array")
        }
        
        const trimmedAlignedValues = trimRange(
            values.map((v) => alignValueToStep(v))
        )
        if (
            !(values.length === trimmedAlignedValues.length) ||
            !values.every(
                (element, index) =>
                    fixFloat(element) === trimmedAlignedValues[index]
            )
        ) {
            values = trimmedAlignedValues
        }

        springPositions = values.map((v) => percentOf(v))

        
        valueLength = values.length

        if (values.length > 1 && !Array.isArray(ariaLabels)) {
            console.warn(`'ariaLabels' prop should be an Array`)
        }
    })

    let percentOf = $derived(function (val) {
        let perc = ((val - min) / (max - min)) * 100
        if (isNaN(perc) || perc <= 0) {
            return 0
        } else if (perc >= 100) {
            return 100
        } else {
            return fixFloat(perc)
        }
    })

    let clampValue = $derived(function (val) {
        // return the min/max if outside of that range
        return val <= min ? min : val >= max ? max : val
    })

    let alignValueToStep = $derived(function (val) {
        // sanity check for performance
        if (val <= min) {
            return fixFloat(min)
        } else if (val >= max) {
            return fixFloat(max)
        } else {
            val = fixFloat(val)
        }

        let remainder = (val - min) % step
        let aligned = val - remainder
        if (Math.abs(remainder) * 2 >= step) {
            aligned += remainder > 0 ? step : -step
        }
        
        aligned = clampValue(aligned)
        return fixFloat(aligned)
    })

    let orientationStart = $derived(vertical ? reversed ? "top" : "bottom" : reversed ? "right" : "left")
    let orientationEnd = $derived(vertical ? reversed ? "bottom" : "top" : reversed ? "left" : "right")

    function index(el) {
        if (!el) return -1
        var i = 0
        while ((el = el.previousElementSibling)) {
            i++
        }
        return i
    }

    function normalisedClient(e) {
        if (e.type.includes("touch")) {
            // @ts-ignore
            return e.touches[0] || e.changedTouches[0]
        } else {
            return e
        }
    }

    function targetIsHandle(el) {
        const handles = slider.querySelectorAll(".handle")
        const isHandle = Array.prototype.includes.call(handles, el)
        const isChild = Array.prototype.some.call(handles, (e) =>
            e.contains(el)
        )
        return isHandle || isChild
    }

    function trimRange(values) {
        // @ts-ignore
        if (range === "min" || range === "max") {
            return values.slice(0, 1)
        } else if (range) {
            return values.slice(0, 2)
        } else {
            return values
        }
    }

    function getSliderDimensions() {
        return slider.getBoundingClientRect()
    }

    function getClosestHandle(clientPos) {
        const dims = getSliderDimensions()
        // calculate the interaction position, percent and value
        let handlePos = 0
        let handlePercent = 0
        let handleVal = 0
        if (vertical) {
            handlePos = clientPos.clientY - dims.top
            handlePercent = (handlePos / dims.height) * 100
            handlePercent = reversed ? handlePercent : 100 - handlePercent
        } else {
            handlePos = clientPos.clientX - dims.left
            handlePercent = (handlePos / dims.width) * 100
            handlePercent = reversed ? 100 - handlePercent : handlePercent
        }
        handleVal = ((max - min) / 100) * handlePercent + min

        let closest

        if (range === true && values[0] === values[1]) {
            if (handleVal > values[1]) {
                return 1
            } else {
                return 0
            }
        } else {
            closest = values.indexOf(
                [...values].sort(
                    (a, b) => Math.abs(handleVal - a) - Math.abs(handleVal - b)
                )[0]
            )
        }
        return closest
    }

    function handleInteract(clientPos) {
        const dims = getSliderDimensions()
        // calculate the interaction position, percent and value
        let handlePos = 0
        let handlePercent = 0
        let handleVal = 0
        if (vertical) {
            handlePos = clientPos.clientY - dims.top
            handlePercent = (handlePos / dims.height) * 100
            handlePercent = reversed ? handlePercent : 100 - handlePercent
        } else {
            handlePos = clientPos.clientX - dims.left
            handlePercent = (handlePos / dims.width) * 100
            handlePercent = reversed ? 100 - handlePercent : handlePercent
        }
        handleVal = ((max - min) / 100) * handlePercent + min
        // move handle to the value
        moveHandle(activeHandle, handleVal)
    }

    function moveHandle(index, value) {
        value = alignValueToStep(value)
        if (typeof index === "undefined") {
            index = activeHandle
        }
        if (range) {
            if (index === 0 && value > values[1]) {
                if (pushy) {
                    values[1] = value
                } else {
                    value = values[1]
                }
            } else if (index === 1 && value < values[0]) {
                if (pushy) {
                    values[0] = value
                } else {
                    value = values[0]
                }
            }
        }

        if (values[index] !== value) {
            values[index] = value
        }

        if (previousValue !== value) {
            eChange()
            previousValue = value
        }
        return value
    }

    function rangeStart(values) {
        if (range === "min") {
            return 0
        } else {
            return values[0]
        }
    }

    function rangeEnd(values) {
        if (range === "max") {
            return 0
        } else if (range === "min") {
            return 100 - values[0]
        } else {
            return 100 - values[1]
        }
    }

    function pureText(possibleHtml) {
        return `${possibleHtml}`.replace(/<[^>]*>/g, "")
    }

    function sliderBlurHandle(e) {
        if (keyboardActive) {
            focus = false
            handleActivated = false
            handlePressed = false
        }
    }

    function sliderFocusHandle(e) {
        if (!disabled) {
            activeHandle = index(e.target)
            focus = true
        }
    }

    function sliderKeydown(e) {
        if (!disabled) {
            const handle = index(e.target)
            // @ts-ignore
            let jump = e.ctrlKey || e.metaKey || e.shiftKey ? step * 10 : step
            let prevent = false

            // @ts-ignore
            switch (e.key) {
                case "PageDown":
                    jump *= 10
                case "ArrowRight":
                case "ArrowUp":
                    moveHandle(handle, values[handle] + jump)
                    prevent = true
                    break
                case "PageUp":
                    jump *= 10
                case "ArrowLeft":
                case "ArrowDown":
                    moveHandle(handle, values[handle] - jump)
                    prevent = true
                    break
                case "Home":
                    moveHandle(handle, min)
                    prevent = true
                    break
                case "End":
                    moveHandle(handle, max)
                    prevent = true
                    break
            }
            if (prevent) {
                e.preventDefault()
                e.stopPropagation()
            }
        }
    }

    function sliderInteractStart(e) {
        if (!disabled) {
            const el = e.target
            const clientPos = normalisedClient(e)
            // set the closest handle as active
            focus = true
            handleActivated = true
            handlePressed = true
            activeHandle = getClosestHandle(clientPos)

            // fire the start event
            startValue = previousValue = alignValueToStep(values[activeHandle])
            eStart()

            if (e.type === "touchstart" && !el.matches(".pipVal")) {
                handleInteract(clientPos)
            }
        }
    }

    function sliderInteractEnd(e) {
        if (e.type === "touchend") {
            eStop()
        }
        handlePressed = false
    }

    function bodyInteractStart(e) {
        keyboardActive = false
        if (focus && e.target !== slider && !slider.contains(e.target)) {
            focus = false
        }
    }

    function bodyInteract(e) {
        if (!disabled) {
            if (handleActivated) {
                handleInteract(normalisedClient(e))
            }
        }
    }

    function bodyMouseUp(e) {
        if (!disabled) {
            const el = e.target
            if (handleActivated) {
                if (el === slider || slider.contains(el)) {
                    focus = true
                    if (!targetIsHandle(el) && !el.matches(".pipVal")) {
                        handleInteract(normalisedClient(e))
                    }
                }
                eStop()
            }
        }
        handleActivated = false
        handlePressed = false
    }

    function bodyTouchEnd(e) {
        handleActivated = false
        handlePressed = false
    }

    function bodyKeyDown(e) {
        if (!disabled) {
            if (e.target === slider || slider.contains(e.target)) {
                keyboardActive = true
            }
        }
    }

    function eStart() {
        !disabled && onstart?.({
            activeHandle,
            value: startValue,
            values: values.map((v) => alignValueToStep(v)),
        })
    }

    function eStop() {
        !disabled && onstop?.({
            activeHandle,
            value: startValue,
            values: values.map((v) => alignValueToStep(v)),
        })
    }

    function eChange() {
        !disabled && onchange?.({
            activeHandle,
            startValue: startValue,
            previousValue: typeof previousValue === "undefined" ? startValue : previousValue,
            value: values[activeHandle],
            values: values.map((v) => alignValueToStep(v)),
        })
    }
</script>

<div>

    <div class="flex justify-between items-center tracking-normal text-base">
        <div class="font-medium text-sm">
            {label}
        </div>
        <div class="font-medium text-sm">
            {labelValue}
        </div>
    </div>

    <div
        {id}
        bind:this={slider}
        role="none"
        class="rangeSlider"
        class:range
        class:disabled
        class:hoverable
        class:vertical
        class:reversed
        class:focus
        class:min={range === "min"}
        class:max={range === "max"}
        class:my-4={!withText || (withText && sm)}
        class:my-7={withText && !sm}
        onmousedown={sliderInteractStart}
        onmouseup={sliderInteractEnd}
        ontouchstart={sliderInteractStart}
        ontouchend={sliderInteractEnd}
    >
        {#each values as value, index}
            <span
                role="slider"
                class="rangeHandle"
                class:active={focus && activeHandle === index}
                class:press={handlePressed && activeHandle === index}
                data-handle={index}
                onblur={sliderBlurHandle}
                onfocus={sliderFocusHandle}
                onkeydown={sliderKeydown}
                style="{orientationStart}: {springPositions[
                    index
                ]}%; z-index: {activeHandle === index ? 3 : 2};"
                aria-label={ariaLabels[index]}
                aria-valuemin={range === true && index === 1 ? values[0] : min}
                aria-valuemax={range === true && index === 0 ? values[1] : max}
                aria-valuenow={value}
                aria-valuetext="{prefix}{pureText(
                    handleFormatter(value, index, percentOf(value))
                )}{suffix}"
                aria-orientation={vertical ? "vertical" : "horizontal"}
                tabindex={0}
                class:size-6={!withText} 
                class:size-12={withText && !sm}
                class:size-8={withText && sm}
            >
                <div class="rangeNub">
                    {#if withText}
                    <div class="size-full flex-center font-medium text-sm">
                        <div class="text-center leading-3 flex-center flex-wrap" class:flex-col={handleVertical}>
                            <div class="text-[9px]">
                                {prefix}
                            </div>
                            <div>
                                {@html handleFormatter(value, index, percentOf(value))}
                            </div>
                            <div class="text-[9px]">
                                {suffix}
                            </div>
                        </div>
                    </div>
                    {/if}
                </div>
            </span>
        {/each}
        {#if range}
            <span
                class="rangeBar"
                style="{orientationStart}: {rangeStart(springPositions)}%; 
                        {orientationEnd}: {rangeEnd(springPositions)}%;"></span>
        {/if}
        <!-- pips -->
        {#if pips}
            <div class="absolute inset-x-0 -bottom-4 h-4">
                <div class="w-full flex justify-between text-xs opacity-50">
                    <div class="first">
                        <!-- {prefix}{@html formatter(fixFloat(min),0,0)}{suffix} -->
                        {@html formatter(fixFloat(min),0,0)}
                    </div>

                    <div class="last">
                        {prefix}{@html formatter(fixFloat(max),0,100)}{suffix}
                    </div>
                </div>
            </div>
        {/if}
    </div>
    {#if help}
        <div class="font-light text-sm opacity-85">{help}</div>
    {/if}
    
</div>

<svelte:window
    onmousedown={bodyInteractStart}
    ontouchstart={bodyInteractStart}
    onmousemove={bodyInteract}
    ontouchmove={bodyInteract}
    onmouseup={bodyMouseUp}
    ontouchend={bodyTouchEnd}
    onkeydown={bodyKeyDown}
/>

<style>
    .rangeSlider {
        --var-color: var(--color, #3cf2e6);
        --var-track: var(--track, #262933);
        --var-handle-bg: var(--handle-bg, #3cf2e6);
        --var-handle-fg: var(--handle-fg, #000);
    }
    .rangeSlider {
        position: relative;
        border-radius: 100px;
        height: 6px;
        transition: opacity 0.2s ease;
        user-select: none;
    }
    .rangeSlider * {
        user-select: none;
    }
    .rangeSlider .rangeHandle {
        position: absolute;
        display: block;
        top: 3px;
        bottom: auto;
        transform: translateY(-50%) translateX(-50%);
        z-index: 2;
        border: 4px solid var(--var-color);
        border-radius: 100%;
    }
    .rangeSlider.reversed .rangeHandle {
        transform: translateY(-50%) translateX(50%);
    }
    .rangeSlider.vertical.reversed .rangeHandle {
        transform: translateY(-50%) translateX(-50%);
    }
    .rangeSlider .rangeNub,
    .rangeSlider .rangeHandle:before {
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        border-radius: 10em;
        height: 100%;
        width: 100%;
        transition: box-shadow 0.2s ease;
    }
    .rangeSlider .rangeHandle:before {
        content: "";
        left: 1px;
        top: 1px;
        bottom: 1px;
        right: 1px;
        height: auto;
        width: auto;
        box-shadow: 0 0 0 0px var(--var-color);
        opacity: 0;
    }
    .rangeSlider.hoverable:not(.disabled) .rangeHandle:hover:before {
        box-shadow: 0 0 0 8px var(--var-color);
        opacity: 0.2;
    }
    .rangeSlider.hoverable:not(.disabled) .rangeHandle.press:before,
    .rangeSlider.hoverable:not(.disabled) .rangeHandle.press:hover:before{
        box-shadow: 0 0 0 12px var(--var-color);
        opacity: 0.4;
    }
    .rangeSlider.range:not(.min):not(.max) .rangeNub {
        border-radius: 10em 10em 10em 1.6em;
    }
    
    .rangeSlider .rangeBar {
        position: absolute;
        display: block;
        transition: background 0.2s ease;
        border-radius: 1em;
        height: 6px;
        top: 0;
        user-select: none;
        z-index: 1;
    }
    
    .rangeSlider {
        background-color: var(--var-track);
    }
    .rangeSlider .rangeBar {
        background-color: var(--var-color);
    }
    .rangeSlider .rangeNub {
        background-color: var(--var-handle-bg);
        color: var(--var-handle-fg);
    }
</style>
