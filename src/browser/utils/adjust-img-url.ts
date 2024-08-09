export const adjustImageLHURL = (url: string) => {
    return url.replace(/-h\d+/, '-h150').replace(/=w\d+/, '=w150')
}
