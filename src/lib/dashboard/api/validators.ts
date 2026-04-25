
export const validArray = obj => !Array.isArray ? Object.prototype.toString.call(obj) === '[object Array]' : Array.isArray(obj)

export const validURL = (url) => {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return reg.test(url);
}

export const validEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export const validPhone = (num) => {
    if(!num) return false;
    if(String(num).startsWith('+')) num = num.replaceAll('+', '')
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    if(re.test(num)){
        return true
    } else {
        return /^\d{8,16}$/.test(num)
    }
}

export const validBarcode = (num) => {
    if(!num) return false;
    return /^\d{8,13}$/.test(num)
}

// export const validPhone = (num, country:any = 'sa') => {
//     if(!num) return false;
//     if(typeof num === 'undefined') return false;
//     country = country.toUpperCase().trim()
//     const n = parsePhoneNumberFromString(num.toString(), country ); 
//     return n && n.isValid() ? true : false;
// }

export const validSaudiPhone = (num) => {
    const re = /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/
    return re.test(num)
}

export const toSaudiNumber = (num) => {
    num = num.toString().trim().replace(/[^\d]/g, "").replace('+', '')
    if(!num) return false

    const re = /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/
    const match = re.test(num)
    if(!match) return false

    if(num.startsWith('00966')) return num.replace('00966', '966')
    if(num.startsWith('966')) return num
    if(num.startsWith('0')) return '966'+num.substring(1)
    return '966'+num
}

export const validOmaniPhone = (num) => {
    const re = /^(?:(?:00)?968)?\d{8}$/
    return re.test(num)
}

export const validOmaniMobile = (num) => {
    const re = /^(?:(?:00)?968)?[279]\d{7}$/
    return re.test(num)
}

export const toOmaniNumber = (num) => {
    num = num.toString().trim().replace(/[^\d]/g, "").replace('+', '')
    if(!num) return false

    const re = /^(?:(?:00)?968)?[279]\d{7}$/ // mobile
    // const re = /^(?:(?:00)?968)?\d{8}$/ // all

    const match = re.test(num)
    if(!match) return false

    if(num.startsWith('00968')) return num.replace('00968', '968')
    if(num.startsWith('968')) return num
    if(num.startsWith('0')) return '968'+num.substring(1)
    return '968'+num
}
