export default function getFileImage(fileData : any){
    var path = "/file.svg"
    if (fileData.type.includes("audio")) path = "/audio.svg"
    else if (fileData.type.includes("image")) path = "/image.svg"
    else if (fileData.type.includes("msword") || fileData.type.includes("officedocument.wordprocessingml")) path = "/doc.svg"
    else if (fileData.type.includes("ms-excel") || fileData.type.includes("officedocument.spreadsheetml")) path = "/excel.svg"
    else if (fileData.type.includes("pdf")) path = "/pdf.svg"
    else if (fileData.type.includes("ms-powerpoint") || fileData.type.includes("officedocument.presentationml")) path = "/powerpoint.svg"
    else if (fileData.type.includes("video")) path = "/video.svg"
    else if (fileData.type.includes("text")) path = "/txt.svg"
    else if (fileData.type.includes("zip")) path = "/zip.svg"

    return path
}