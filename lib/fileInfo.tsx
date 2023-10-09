export function getFileImage(fileData : any){
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

export function getFileType(fileData : any){
    var res = "unknown"
    if (fileData.type.includes("audio")) res = "audio"
    else if (fileData.type.includes("image")) res = "image"
    else if (fileData.type.includes("pdf")) res = "pdf"
    else if (fileData.type.includes("video")) res = "video"
    else if (fileData.type.includes("text")) res = "text"
    return res
}

function formatFloat(f : number, i : number){
    return Math.floor(f * (10 ** i)) / (10 ** i)
  }


export function formattedSize(bytes : number){
    var order = ['b', 'kb', 'mb', 'gb', 'tb']
    var i = 0

    while (i < order.length - 1 && bytes > 1000) {
      bytes = bytes / 1000
      i += 1
    }
    
    return `${formatFloat(bytes, 2)}${order[i]}`
  }