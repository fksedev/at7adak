export const toCsv = ( data: any[] = [] ) => {

    if(!data || !Array.isArray(data)) return ''
    if(!data.length) return ''

    const csvString = [
        Object.keys(data[0]),
        ...data.map(item => Object.values(item))
    ].map(e => e.join(",")).join("\n");

    return csvString
}

export const csvExporter = (name: string, data: any[]) => {
    const _data = toCsv(data)

    const BOM = "\uFEFF"; 

    return new Response(BOM + _data, {
        headers: {
            "Content-Encoding": "UTF-8",
            "Content-disposition" : `attachment; filename=${name}.csv`, 
            "Content-Type" : "text/csv; charset=UTF-8"
        }
    })
}
