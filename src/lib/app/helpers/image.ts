import { proxy } from "$lib/app" 

const readFileAsync = (file) => new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onloadend = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
})

export const dataURLtoBlob = (dataurl) => {
    var arr = dataurl.split(','), 
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {type:mime});
}

export const imgURLtoBlob = async (url) => {
    const res = await fetch(proxy(url))
    const blob = await res.blob()
    return blob
}

export const imgURLtoBase64 = (url) => new Promise((resolve, reject) => {
    imgURLtoBlob(url).then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    })
})

export const imgToBlob = async (image: string) => {
    if(!image) return 
    const lower = image.toLocaleLowerCase()
    if(lower.startsWith('http')) return await imgURLtoBlob(image)
    if(lower.startsWith('data')) return dataURLtoBlob(image)
    return image
}

export const processImg = async (e) => {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0]
    const base64 = await readFileAsync(file)
    const blobData = dataURLtoBlob(base64)
    return {
        base64,
        blobData
    }
}
