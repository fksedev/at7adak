<script lang="ts">
	import { onMount } from 'svelte';
    import type { HTMLInputAttributes } from 'svelte/elements'
	import { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js/max';
	import { normalizeTelInput, getCountryForPartialE164Number, telInputAction } from './assets';
	import type {
		NormalizedTelNumber,
		CountryCode,
		E164Number,
	} from './assets';

	let {
		onError,
		onValid,
		onParse,
		focus = $bindable(false),
		country = $bindable(null),
		value = $bindable(null),
		parsedTelInput = $bindable(null),
		valid = $bindable(undefined),
		disabled = false,
		className = '',
		...props
	}: HTMLInputAttributes & {
		onError?: (err?) => void,
		onValid?: (valid?) => void,
		onParse?: (parsedTelInput?) => void,
		focus?: boolean,
		country?: CountryCode | null,
		value?: E164Number | string | null,
		parsedTelInput?: Partial<NormalizedTelNumber> | null,
		valid?: boolean | undefined,
		disabled?: boolean,
		className?: string,
	} = $props()

	let el = $state<HTMLElement>()

	$effect(() => {
		if(el && focus) {
			el.focus()
			setTimeout(() => focus = false, 900)
		}
	})
	
	let inputValue = $state<E164Number | string | null>(value);
	let prevCountry = $state(country);

	const handleInputAction = (value: E164Number) => {
		if (disabled) return;
		handleParsePhoneNumber(value, country);
	};

	const updateCountry = (countryCode: CountryCode) => {
		country = countryCode;
		prevCountry = countryCode;
		return country;
	};

	const handleParsePhoneNumber = (
		input: E164Number | null,
		currCountry: CountryCode | null = null
	) => {
		if (input !== null) {
			const numberHasCountry = getCountryForPartialE164Number(input);

			if (numberHasCountry && numberHasCountry !== prevCountry) {
				updateCountry(numberHasCountry);
			}

			try {
				parsedTelInput = normalizeTelInput(
					parsePhoneNumberWithError(input, currCountry ?? numberHasCountry)
				);
			} catch (err) {
				if (err instanceof ParseError) {
					// Not a phone number, non-existent country, etc.
					parsedTelInput = {
						isValid: false,
						error: err.message
					};
					onError?.(err.message);
				} else {
					throw err;
				}
			}

			// It's keep the html input value on the first parsed format, or the user's format.
			if (parsedTelInput?.isValid && parsedTelInput?.formatOriginal) {
				// It's need for refreshing html input value, if it is the same as the previouly parsed.
				if (inputValue === parsedTelInput?.formatOriginal) {
					inputValue = null;
				}
				inputValue = parsedTelInput?.formatOriginal;
			}
			value = parsedTelInput?.e164 ?? null;
			valid = parsedTelInput?.isValid ?? false;
			onValid?.(valid)
			onParse?.(parsedTelInput)
		} else {
			if (currCountry !== prevCountry) {
				value = null;
				inputValue = '';
				valid = false;
				parsedTelInput = null;
			}
			prevCountry = currCountry;
			onValid?.(valid)
			onParse?.(parsedTelInput)
		}
	};

	let mounted = $state(false)
	const initialize = () => {
		if (value && country) {
			handleParsePhoneNumber(value, country);
		} else if (value) {
			const numberHasCountry = getCountryForPartialE164Number(value);
			if (numberHasCountry) {
				updateCountry(numberHasCountry);
				handleParsePhoneNumber(value, country);
			} else {
				handleParsePhoneNumber(value);
			}
		}
		mounted = true
	};

	onMount(() => {
		initialize();
	});

	$effect(() => {
		if(country && mounted) handleParsePhoneNumber(null, country);
	})
	
</script>

<input
	bind:this={el}
	{disabled}
	type="tel"
	value={inputValue}
	{...props}
	class={className}
	use:telInputAction={handleInputAction}
/>
