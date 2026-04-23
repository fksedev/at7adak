var MIN = 60e3;
var HOUR = MIN * 60;
var DAY = HOUR * 24;
var YEAR = DAY * 365;
var MONTH = DAY * 30;

type DateOkay = Date | string | number

interface Options {
    and?: boolean,
    suffix?: boolean,
    zero?: boolean,
    max?: number,
}

export function fromNow(date: DateOkay, opts: Options = {}): string {
	opts = opts || {};

	var del = new Date(date).getTime() - Date.now();
	var abs = Math.abs(del);

	if (abs < MIN) return 'just now';

	var periods = {
		year: abs / YEAR,
		month: (abs % YEAR) / MONTH,
		day: (abs % MONTH) / DAY,
		hour: (abs % DAY) / HOUR,
		minute: (abs % HOUR) / MIN,
	};

	var k, val, keep=[], max=opts.max || MIN; // large number

	for (k in periods) {
		if (keep.length < max) {
			val = Math.floor(periods[k]);
			if (val || opts.zero) {
				keep.push(val + ' ' + ((val == 1) ? k : (k + 's')));
			}
		}
	}

	k = keep.length; // reuse
	let delimeter = ', '; // reuse

	if (k > 1 && opts.and) {
		if (k == 2) delimeter = ' ';
		keep[--k] = 'and ' + keep[k];
	}

	val = keep.join(delimeter); // reuse

	if (opts.suffix) {
		val += (del < 0 ? ' ago' : ' from now');
	}

	return val;
}

export function fromNowTiny(date: DateOkay): string {

	var del = new Date(date).getTime() - Date.now();
	var abs = Math.abs(del);

	if (abs < 1000) return '0s';

	var periods = {
        s: abs / 1000,
		y: abs / YEAR,
		mo: (abs % YEAR) / MONTH,
		d: (abs % MONTH) / DAY,
		h: (abs % DAY) / HOUR,
		m: (abs % HOUR) / MIN,
	};

	var k, val, keep=[]; // large number

	for (k in periods) {
		if (keep.length < parseInt(MIN.toString())) {
			val = Math.floor(periods[k]);
			if (val) {
				keep.push(`${val}${k}`);
			}
		}
	}

	if(abs > MIN) keep.shift() // remove seconds

	val = keep.join(', '); 

	return val;
}
