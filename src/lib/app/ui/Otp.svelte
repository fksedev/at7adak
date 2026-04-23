<script lang="ts">
    import { cn } from "$lib/app"
    import { onMount } from "svelte"

    let {
        value = $bindable(''),
        length = 6,
        numeric = true,
        className = '',
        containerClass = ' ',
        onChange,
        autofocus = false,

        separator = '',
        onlyShowMiddleSeparator = true,
        separatorClass = '',
    }: {
        value?: string,
        length?: number,
        numeric?: boolean,
        className?: string,
        containerClass?: string,
        onChange?: (otpValue: string) => void,
        autofocus?: boolean,

        separator?: string,
        onlyShowMiddleSeparator?: boolean,
        separatorClass?: string,
    } = $props()

    // svelte-ignore state_referenced_locally
        let otpValues = $state<string[]>(Array(length).fill(""))
    let inputRefs = $state<HTMLInputElement[]>([])

    onMount(() => {
        if (value && typeof value === "string") {
            const initialValues = value.slice(0, length).split("")
            otpValues = [
                ...initialValues,
                ...Array(length - initialValues.length).fill(""),
            ]
        }
        if(autofocus) inputRefs[0]?.focus()
        updateOtpValue()
    })

    function handleInput(event: Event, index: number) {
        const input = event.target as HTMLInputElement
        const inputValue = input.value

        if (inputValue) {
            otpValues[index] = inputValue.slice(-1)

            if (index < length - 1) {
                inputRefs[index + 1]?.focus()
            }
        } else {
            otpValues[index] = ""
        }

        updateOtpValue()
    }

    function handleKeyDown(event: KeyboardEvent, index: number) {
        if (
            numeric 
            && event.key !== "Backspace" 
            && !(/[0-9]/.test(event.key)) 
            && !((event.metaKey || event.ctrlKey) && (event.key === 'v' || event.key === 'V'))
        ) {
            event.preventDefault()
        }
        if (event.key === "Backspace" && otpValues[index] === "" && index > 0) {
            inputRefs[index - 1]?.focus()
        }
    }

    function handlePaste(event: ClipboardEvent) {
        event.preventDefault()
        const pastedData = event.clipboardData?.getData("text")

        if (pastedData) {
            if(numeric && !/^\d+$/.test(pastedData.trim())) return;
            const pastedChars = pastedData.slice(0, length).split("")
            otpValues = [
                ...pastedChars,
                ...Array(length - pastedChars.length).fill(""),
            ]
            if(pastedChars.length >= length) {
                inputRefs.forEach((_, index) => inputRefs[index]?.blur())
            } else {
                inputRefs[Math.min(pastedChars.length, length - 1)]?.focus()
            }
            updateOtpValue()
        }
    }

    function updateOtpValue() {
        const otpValue = otpValues.join("")
        value = otpValue
        onChange?.(otpValue)
    }
</script>

<div class={cn(
    "flex items-centerjustify-center gap-4 ltr", 
    containerClass
)}>
    {#each otpValues as _, index}
        <input
            inputmode={numeric ? "decimal" : "text"}
            bind:this={inputRefs[index]}
            bind:value={otpValues[index]}
            oninput={(e) => handleInput(e, index)}
            onkeydown={(e) => handleKeyDown(e, index)}
            onpaste={handlePaste}
            maxlength="1"
            autocomplete="one-time-code"
            autocapitalize="off"
            spellcheck="false"
            autocorrect="off"
            class={cn(
                "size-16 text-center rounded-lg bg-transparent outline outline-transparent text-2xl border  focus:outline-accent focus:outline-2 focus:shadow-2xl focus:shadow-accent/90", 
                className
            )}
            disabled={index > 0 && !otpValues[index-1]}
        />

        {#if separator && index !== otpValues.length - 1 && (!onlyShowMiddleSeparator || (onlyShowMiddleSeparator && index === otpValues.length / 2 - 1 && length % 2 === 0))}
			<div class={cn("whitespace-nowrap shrink-0", separatorClass)}>{separator}</div>
		{/if}
    {/each}
</div>
