import { csrfToken } from './csrf'
import { page } from '$app/state'

class Fetcher {
    headers: OutgoingHttpHeaders | undefined = {}
    isFormData = false
    res: RespondBy = 'json'
    log = false
    fetch = fetch

    useLocal(value) {
        // use local fetch for relative urls
        this.fetch = value
        return this
    }

    withLog(){
        this.log = true 
        return this
    }

    withHeaders(headers: OutgoingHttpHeaders){
        this.headers = {
            ...this.headers,
            ...headers
        }
        return this
    }

    withBearer(token: string){
        return this.withHeaders({
            'authorization': `Bearer ${token}`
        })
    }

    withAuth(username: string | number, password: string | number){
        return this.withHeaders({
            'authorization': `Basic ${Buffer.from(username + ":" + password).toString('base64')}`,
        })
    }

    withBasicAuth(apikey: string | number){
        return this.withHeaders({
            'authorization': `Basic ${apikey}`,
        })
    }

    withLang(lang: string){
        return this.withHeaders({
            'accept-language': lang
        })
    }

    withCors(){
        return this.withHeaders({
            'access-control-allow-origin': '*'
        })
    }

    asJson(){
        return this.withHeaders({
            'accept': 'application/json',
            'content-type': 'application/json; charset=utf-8',
        })
    }

    asFormData(){
        this.headers = undefined
        this.isFormData = true
        return this
    }

    cacheFor = (hours = 1) => {
        return this.withHeaders({
            'cache-control': `max-age=${hours * 60 * 60}`
        })
    }

    makeFormData = (payload) => {
        const formData = new FormData();
        for ( var key in payload ) {
            formData.append(key, payload[key]);
        }
        return formData
    }

    as(res: RespondBy) {
        this.res = res || 'json'
        return this
    }

    getJson(){
        this.res = 'json'
        return this
    }

    getText(){
        this.res = 'text'
        return this
    }

    getBlob(){
        this.res = 'blob'
        return this
    }

    getArrayBuffer(){
        this.res = 'arrayBuffer'
        return this
    }

    getFormData(){
        this.res = 'formData'
        return this
    }

    send = async (method: Method, url: string, payload = {}) => {

        const headers: OutgoingHttpHeaders = {
            'accept': 'application/json',
            'content-type': 'application/json; charset=utf-8',
            ...this.headers,
            _csrf: csrfToken()
        }

        const options: any = {
            method,
            headers
        }

        if(method !== 'GET') {
            if(this.isFormData){
                options.body = this.makeFormData(payload)
            } else {
                options.body = JSON.stringify(payload)
            }
        } else {
            url = this.toQueryURL(url, payload)
        }

        try {
            const res = await this.fetch(url, options)
            let data
            if (this.res === 'json'){
                data = await res.json()
            } else if (this.res === 'text'){
                data = await res.text()
            } else if (this.res === 'blob'){
                data = await res.blob()
            } else if (this.res === 'arrayBuffer'){
                data = await res.arrayBuffer()
            } else if (this.res === 'formData'){
                data = await res.formData()
            } 

            // const headers = {}
            // res?.headers?.forEach((v, k) => headers[k] = v)

            const RET = {
                ok: res.ok,
                status: res.status,
                headers: res.headers as Headers,
                data,
            }

            if(this.log){
                console.log('----- FETCHER - REQUEST -----')
                console.log({url, ...options})
                console.log('----- FETCHER - RESPONSE -----')
                console.log(RET)
            }
            
            return RET
            
        } catch (error) {
            if(this.log){
                console.log('----- FETCHER - ERROR -----')
                console.warn({
                    message: error.message, 
                    url,
                    options,
                    stack: error.stack, 
                    ...error
                })
            }
            return {
                ok: false,
                status: 500,
                headers: null,
                result: 'error',
                message: error.message ?? '',
                stack: error.stack ?? '',
                error: {...error},
                data: []
            }
        }
    }

    async get(url, payload = {}){
        return await this.send('GET', url, payload)
    }

    async post(url, payload = {}){
        return await this.send('POST', url, payload)
    }

    async put(url, payload = {}){
        return await this.send('PUT', url, payload)
    }

    async patch(url, payload = {}){
        return await this.send('PATCH', url, payload)
    }

    async delete(url, payload = {}){
        return await this.send('DELETE', url, payload)
    }
    
    toQueryURL(baseURL: string, params = {}) {
        let url 
        try {
            url = new URL(baseURL)
        } catch (error) {
            url = new URL(page.url.origin + baseURL)
        }
        if(params) url.search = new URLSearchParams(params).toString()
        return url.toString()
    }
}

export const fetcher = (() => new Fetcher())() as Fetcher


// TYPES
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type RespondBy = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'
interface Dict<T> { [key: string]: T | undefined; }
interface IncomingHttpHeaders extends Dict<string | string[]> {
    accept?: string | undefined;
    "accept-encoding"?: string | undefined;
    "accept-language"?: string | undefined;
    "accept-patch"?: string | undefined;
    "accept-ranges"?: string | undefined;
    "access-control-allow-credentials"?: string | undefined;
    "access-control-allow-headers"?: string | undefined;
    "access-control-allow-methods"?: string | undefined;
    "access-control-allow-origin"?: string | undefined;
    "access-control-expose-headers"?: string | undefined;
    "access-control-max-age"?: string | undefined;
    "access-control-request-headers"?: string | undefined;
    "access-control-request-method"?: string | undefined;
    age?: string | undefined;
    allow?: string | undefined;
    "alt-svc"?: string | undefined;
    authorization?: string | undefined;
    "cache-control"?: string | undefined;
    connection?: string | undefined;
    "content-disposition"?: string | undefined;
    "content-encoding"?: string | undefined;
    "content-language"?: string | undefined;
    "content-length"?: string | undefined;
    "content-location"?: string | undefined;
    "content-range"?: string | undefined;
    "content-type"?: string | undefined;
    cookie?: string | undefined;
    date?: string | undefined;
    etag?: string | undefined;
    expect?: string | undefined;
    expires?: string | undefined;
    forwarded?: string | undefined;
    from?: string | undefined;
    host?: string | undefined;
    "if-match"?: string | undefined;
    "if-modified-since"?: string | undefined;
    "if-none-match"?: string | undefined;
    "if-unmodified-since"?: string | undefined;
    "last-modified"?: string | undefined;
    location?: string | undefined;
    origin?: string | undefined;
    pragma?: string | undefined;
    "proxy-authenticate"?: string | undefined;
    "proxy-authorization"?: string | undefined;
    "public-key-pins"?: string | undefined;
    range?: string | undefined;
    referer?: string | undefined;
    "retry-after"?: string | undefined;
    "sec-fetch-site"?: string | undefined;
    "sec-fetch-mode"?: string | undefined;
    "sec-fetch-user"?: string | undefined;
    "sec-fetch-dest"?: string | undefined;
    "sec-websocket-accept"?: string | undefined;
    "sec-websocket-extensions"?: string | undefined;
    "sec-websocket-key"?: string | undefined;
    "sec-websocket-protocol"?: string | undefined;
    "sec-websocket-version"?: string | undefined;
    "set-cookie"?: string[] | undefined;
    "strict-transport-security"?: string | undefined;
    tk?: string | undefined;
    trailer?: string | undefined;
    "transfer-encoding"?: string | undefined;
    upgrade?: string | undefined;
    "user-agent"?: string | undefined;
    vary?: string | undefined;
    via?: string | undefined;
    warning?: string | undefined;
    "www-authenticate"?: string | undefined;
}

interface OutgoingHttpHeaders extends Dict<number | string | string[]> {
    accept?: string | string[] | undefined;
    "accept-charset"?: string | string[] | undefined;
    "accept-encoding"?: string | string[] | undefined;
    "accept-language"?: string | string[] | undefined;
    "accept-ranges"?: string | undefined;
    "access-control-allow-credentials"?: string | undefined;
    "access-control-allow-headers"?: string | undefined;
    "access-control-allow-methods"?: string | undefined;
    "access-control-allow-origin"?: string | undefined;
    "access-control-expose-headers"?: string | undefined;
    "access-control-max-age"?: string | undefined;
    "access-control-request-headers"?: string | undefined;
    "access-control-request-method"?: string | undefined;
    age?: string | undefined;
    allow?: string | undefined;
    authorization?: string | undefined;
    "cache-control"?: string | undefined;
    "cdn-cache-control"?: string | undefined;
    connection?: string | string[] | undefined;
    "content-disposition"?: string | undefined;
    "content-encoding"?: string | undefined;
    "content-language"?: string | undefined;
    "content-length"?: string | number | undefined;
    "content-location"?: string | undefined;
    "content-range"?: string | undefined;
    "content-security-policy"?: string | undefined;
    "content-security-policy-report-only"?: string | undefined;
    "content-type"?: string | undefined;
    cookie?: string | string[] | undefined;
    dav?: string | string[] | undefined;
    dnt?: string | undefined;
    date?: string | undefined;
    etag?: string | undefined;
    expect?: string | undefined;
    expires?: string | undefined;
    forwarded?: string | undefined;
    from?: string | undefined;
    host?: string | undefined;
    "if-match"?: string | undefined;
    "if-modified-since"?: string | undefined;
    "if-none-match"?: string | undefined;
    "if-range"?: string | undefined;
    "if-unmodified-since"?: string | undefined;
    "last-modified"?: string | undefined;
    link?: string | string[] | undefined;
    location?: string | undefined;
    "max-forwards"?: string | undefined;
    origin?: string | undefined;
    pragma?: string | string[] | undefined;
    "proxy-authenticate"?: string | string[] | undefined;
    "proxy-authorization"?: string | undefined;
    "public-key-pins"?: string | undefined;
    "public-key-pins-report-only"?: string | undefined;
    range?: string | undefined;
    referer?: string | undefined;
    "referrer-policy"?: string | undefined;
    refresh?: string | undefined;
    "retry-after"?: string | undefined;
    "sec-websocket-accept"?: string | undefined;
    "sec-websocket-extensions"?: string | string[] | undefined;
    "sec-websocket-key"?: string | undefined;
    "sec-websocket-protocol"?: string | string[] | undefined;
    "sec-websocket-version"?: string | undefined;
    server?: string | undefined;
    "set-cookie"?: string | string[] | undefined;
    "strict-transport-security"?: string | undefined;
    te?: string | undefined;
    trailer?: string | undefined;
    "transfer-encoding"?: string | undefined;
    "user-agent"?: string | undefined;
    upgrade?: string | undefined;
    "upgrade-insecure-requests"?: string | undefined;
    vary?: string | undefined;
    via?: string | string[] | undefined;
    warning?: string | undefined;
    "www-authenticate"?: string | string[] | undefined;
    "x-content-type-options"?: string | undefined;
    "x-dns-prefetch-control"?: string | undefined;
    "x-frame-options"?: string | undefined;
    "x-xss-protection"?: string | undefined;
}
