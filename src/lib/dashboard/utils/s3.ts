import { _AWS_URL } from  '$lib/dashboard'

export const _s3Path = url => {
    if(!url) return ''
    return url.replace(`${_AWS_URL}/`, '')
}

export const _s3Url = path => {
    if(!path) return ''
    const cleanURL = url => url.replace(/([^:]\/)\/+/g, "$1");
    path = _s3Path(path)
    return cleanURL(`${_AWS_URL}/${path}`)
}
