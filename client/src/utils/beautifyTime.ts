export const beautifyTime = (time: number) => {
    if (!time) return "0:00"
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time - hours * 3600) / 60)
    const seconds = Math.floor(time - hours * 3600 - minutes * 60)
    return `${hours === 0 ? "" : hours + ":"}${minutes}:${seconds < 10 ? "0" + seconds : seconds}`
}