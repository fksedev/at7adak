import type { Country, CountryCode } from './types';
import { countries, flagsData } from './data'

const normalize = x => x.toString().trim().toUpperCase()

export const getCountries = (favIDs: string[]): Country[] => {
	favIDs = [...new Set( favIDs.map(x => normalize(x)) )]

	const filtered = countries.filter(x => !favIDs.includes( normalize(x[1]) ))
	const favs = favIDs.map(x => countries.find(y => normalize(y[1]) === normalize(x)) || ['', '', '', '', ''])
	const allCountries = [...favs, ...filtered]

	return allCountries.map((country): Country => {
		return {
			id: (country[1] as string).toUpperCase(),
			label: `${country[0] as string} +${country[2] as string}`,
			name: country[0] as string,
			iso2: (country[1] as string).toUpperCase() as CountryCode,
			dialCode: country[2] as string,
			priority: country[3] || 0,
			areaCodes: country[4] || null,
			flag: flagsData[country[1] as string] || '',
		};
	});
}
