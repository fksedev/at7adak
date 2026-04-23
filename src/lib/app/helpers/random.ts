export const randomObj = items => items[Math.floor(Math.random()*items.length)]

export const randomRange = (min, max) => Math.random() * (max - min) + min

export const generateCode = (codeLength: number = 5) => {
    const rawCode = Math.floor(Math.random() * (10 ** codeLength));
    return rawCode.toString().padStart(codeLength, '0');
}

export const weightedRandom = (arr) => {
    
    const weights = arr.map(i => i?.weight || 0)

    // scan weights array and sum valid entries
    var sum = 0;
    var val;
    for (var weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
        val = weights[weightIndex];
        if (val > 0) sum += val;
    }

    // select a value within range
    var selected = Math.random() * sum;

    // find array entry corresponding to selected value
    var total = 0;
    var lastGoodIdx = -1;
    var chosenIdx;
    for (weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
        val = weights[weightIndex];
        total += val;
        if (val > 0) {
            if (selected <= total) {
                chosenIdx = weightIndex;
                break;
            }
            lastGoodIdx = weightIndex;
        }

        // handle any possible rounding error comparison to ensure something is picked
        if (weightIndex === (weights.length - 1)) {
            chosenIdx = lastGoodIdx;
        }
    }

    return arr[chosenIdx];
};

export const rand = (min = 0, max = 9999) => Math.floor(Math.random() * (max - min)) + min

export const random_string = (length) => {
    let text = '';
    const p = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i += 1) {
        text += p.charAt(Math.floor(Math.random() * p.length));
    }
    return text;
}

export const random_date = () => new Date(+(new Date()) - Math.floor(Math.random()*10000000000))

export const random_user_image = (gender = 'male') => {
    gender = gender || 'male'
    gender = gender.trim().toLowerCase()
    const type = gender === 'female' ? 'women' : 'men'
    return `https://randomuser.me/api/portraits/${type}/${rand(1, 99)}.jpg`
    // return `https://uinames.com/api/photos/${gender}/${rand(1, 20)}.jpg`
}

export const random_image = (w = 800, h = 600) => {
    const nocache = Date.now()
    return `https://picsum.photos/${w}/${h}?_=${nocache}`
}

export const random_color = () => `rgb(${[...new Array(3)].map(() => Math.random() * 256).join(',')})`

export const str_random = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
   return result;
}

export const slugify = (str) => {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-') // collapse dashes
        .replace(/^-+/, "") // trim - from start of text
        .replace(/-+$/, ""); // trim - from end of text

    return str;
}
