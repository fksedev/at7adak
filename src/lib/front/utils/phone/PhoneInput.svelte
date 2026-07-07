<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
    import { page } from '$app/state'
	import { clickOutsideAction, isSelected, getCountries, type NormalizedTelNumber, type CountryCode, type E164Number } from './assets';
	import TelInput from './TelInput.svelte';
	import { cn } from "$lib/front"

	const preSelected = (page.data?.country?.toUpperCase() || 'AE').trim() as CountryCode

	const a2e = s => s.toString().replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).toString()

	let {
		onChange,
		value = $bindable(),
		valid = $bindable(undefined),
		selected = preSelected,
		favs = [],
		clickOutside = true,
		closeOnClick = true,
		disabled = false,
		parsedTelInput = null,
		className = '',
		...props
	}: HTMLInputAttributes & {
		onChange?: (v?) => void,
		value: E164Number | string | null,
		valid?: boolean | undefined,
		selected?: string,
		favs?: CountryCode[],
		clickOutside?: boolean,
		closeOnClick?: boolean,
		disabled?: boolean,
		parsedTelInput?: NormalizedTelNumber | null,
		className?: string,
	} = $props()

	let searchText = $state('');
	let isOpen = $state(false);
	let focus = $state(false)
	let searchEL = $state<HTMLElement>()
	
	let normalizedCountries = $derived.by(() => getCountries( [selected, ...favs] ))
	let selectedCountryDialCode = $derived(normalizedCountries.find((el) => el.iso2 === selected)?.dialCode || null)
	let selectedCountryFlag = $derived(normalizedCountries.find((el) => el.iso2 === selected)?.flag || null)

	$effect(() => {
		if (isOpen && searchEL){
			searchEL.focus()
		}
	})

	$effect(() => {
		searchText = a2e(searchText)
	})

	const toggleDropDown = (e: Event) => {
		e.preventDefault();
		isOpen = !isOpen;
	};

	const closeDropdown = (e?: Event) => {
		e?.preventDefault();
		isOpen = false;
		searchText = '';
	};

	const selectClick = () => {
		if (closeOnClick) closeDropdown();
		focus = true
	};

	const closeOnClickOutside = () => {
		if (clickOutside) {
			closeDropdown();
		}
	};

	let filteredItems = $derived(
		searchText && searchText.length > 0
			? normalizedCountries
					.filter((el) => el.label.toLowerCase().indexOf(searchText.toLowerCase()) >= 0)
					.sort((a, b) => (a.label < b.label ? -1 : 1))
			: normalizedCountries
	)

	const handleSelect = (val: CountryCode, e?: Event) => {
		if (disabled) return;
		e?.preventDefault();
		if (
			selected === undefined ||
			selected === null ||
			(typeof selected === typeof val && selected !== val)
		) {
			selected = val;
			onChange?.(val);
			selectClick();
		} else {
			selectClick();
		}
	};
</script>

<div
	class={cn(
		"flex relative w-full", 
		className,
		value && !valid ? 'ring-1 ring-red-500 focus-within:ring-2' : ''
	)}
	use:clickOutsideAction={closeOnClickOutside}
	style="direction: ltr;"
>
	<button
		id="states-button"
		data-dropdown-toggle="dropdown-states"
		class="shrink-0 overflow-hidden z-10 inline-flex items-center py-2.5 px-2 font-medium text-center focus:outline-none"
		type="button"
		tabindex="-1"
		onclick={toggleDropDown}
	>
		{#if selected && selected !== null}
			<div class="inline-flex items-center text-left">
				<span class="shrink-0 mr-3 text-2xl leading-none">{selectedCountryFlag}</span>
				<span>+{selectedCountryDialCode}</span>
			</div>
		{:else}
			...
		{/if}
		<svg class="ml-1 w-4 h-4" viewBox="0 0 20 20" fill={'currentColor'}>
			<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
		</svg>
	</button>
	{#if isOpen}
		<div
			id="dropdown-countries"
			class="z-10 rounded divide-y bg-white text-black divide-gray-100 shadow absolute overflow-hidden inset-x-0 top-full"
			tabindex="-1"
		>
			<ul class="text-sm max-h-48 md:max-h-[60vh] overflow-y-auto">

                <input
                    aria-autocomplete="list"
                    type="text"
                    placeholder="Search..."
                    class="px-4 py-3 focus:outline-none w-full sticky top-0 bg-white z-10"
                    bind:value={searchText}
					bind:this={searchEL}
                />
				{#each filteredItems as country (country.id)}
					{@const isActive = isSelected(country.iso2, selected)}
					<li>
						<button
							value={country.iso2}
							type="button"
							class="inline-flex py-2 px-4 w-full text-sm hover:bg-gray-100 overflow-hidden"
							onclick={(e) => handleSelect(country.iso2, e)}
							class:bg-blue-50={isActive}
						>
							<div class="inline-flex items-start text-left gap-3">
								<span class="text-3xl leading-none">{country.flag}</span>
								<div class="flex flex-1 flex-col">
									<span class="leading-none">
										{country.name}
									</span>
									<span class="opacity-50 leading-none font-mono">
										+{country.dialCode}
									</span>
								</div>
							</div>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<TelInput
		id="tel-input"
		bind:country={selected as CountryCode}
		bind:parsedTelInput
		bind:value
		bind:valid
		onValid={(v) => valid = v}
		bind:focus
		className="block w-full p-2.5 pl-0 focus:outline-none"
		{...props}
	/>
</div>
