const getAssetsFile = (url:String) =>{
    return new URL(`../assets/images/${url}`,import.meta.url).href;
}

export default {
    getAssetsFile
}
