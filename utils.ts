export const blobUrlToArrayBuffer = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return blob.arrayBuffer();
}
