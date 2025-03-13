/*

1. get the whole container which has the video and add a motion_observer on it
2. for all newly added videos get the video id from it
3. from the video id get the thumbnail 

*/

const handleError=(error)=>{
    throw new Error(`program exitted with the error ${error.message} \n`);
};

const Videos=document.querySelector(`#contents`).childNodes

const getID=(url)=>{
    const match = url.match(/v=([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

async function getBase64(image) {
    try{
        //convert into blob and return the encoded image in a promise
        const blob=await image.blob();
        const reader=new FileReader();
        reader.readAsDataURL(blob)
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                const imgFile = reader.result;
                const encodedImage = imgFile.split(",")[1];
                resolve(encodedImage);
            };
            reader.onerror = (error) => {
                handleError(error);
                reject(error);
            };

            reader.readAsDataURL(blob);
        });
    }catch(err){
        handleError(err)
    }
    
}

const getImageFromID=(ID)=>{
    //default url to get thumbnail using a video id
    const img=`https://img.youtube.com/vi/${ID}/hqdefault.jpg`
    return getBase64(img)
}

for(video of Videos){
    //get the anchor tags which contains the link
    const tag=video.querySelector(`a#video-title-link`)
    if(tag&&tag.href){
        const ID=getID(tag.href)
        base64Image=getImageFromID(ID);
        // console.log(ID)
    }
}