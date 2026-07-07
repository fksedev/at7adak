export const validArray = obj => !Array.isArray ? Object.prototype.toString.call(obj) === '[object Array]' : Array.isArray(obj)

export const cleanURL = url => {
    if(typeof url !== 'string') return url 
    return url.replace(/([^:]\/)\/+/g, "$1") // remove double slashes
}

export const validURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

export const validURLReg = (url) => {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return reg.test(url);
}

export const validEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export const validPhone = (num) => {
    if(!num) return false;
    num = num.toString().trim().replace('+', '')
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

export const isImageUrl = (url: string) => {
    if(!url) return false
    if(typeof url !== 'string') return false
    return /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url.trim().toLowerCase())
}

export const isVideoUrl = (url: string) => {
    if(!url) return false
    if(typeof url !== 'string') return false
    return /\.(webm|mpg|mpeg|mpe|mp4|m4p|m4v|avi|wmv|mov)$/.test(url.trim().toLowerCase())
}

export const getUrlExtension = (url: string) => {
    if(!url) return ""
    if(typeof url !== 'string') return ""
    return url.split(/[#?]/)[0].split('.').pop().trim()
}
