"use client";

import React from 'react';
import {useState, useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

import "@/static/fileUpload.css"

export default function FileUpload(props : any) {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  useEffect(()=>{
    setUploadedFiles(uploadedFiles.concat(acceptedFiles))
  }, [acceptedFiles])

  function formatFloat(f : number, i : number){
    return Math.floor(f * (10 ** i)) / (10 ** i)
  }

  function formattedSize(bytes : number){
    var order = ['b', 'kb', 'mb', 'gb', 'tb']
    var i = 0

    while (i < order.length - 1 && bytes > 1000) {
      bytes = bytes / 1000
      i += 1
    }
    
    return `${formatFloat(bytes, 2)}${order[i]}`
  }

  function getCard(file : File){
    var path = "/file.svg"
    if (file.type.includes("audio")) path = "/audio.svg"
    else if (file.type.includes("image")) path = "/image.svg"
    else if (file.type.includes("msword") || file.type.includes("officedocument.wordprocessingml")) path = "/doc.svg"
    else if (file.type.includes("ms-excel") || file.type.includes("officedocument.spreadsheetml")) path = "/excel.svg"
    else if (file.type.includes("pdf")) path = "/pdf.svg"
    else if (file.type.includes("ms-powerpoint") || file.type.includes("officedocument.presentationml")) path = "/powerpoint.svg"
    else if (file.type.includes("video")) path = "/video.svg"
    else if (file.type.includes("text")) path = "/txt.svg"
    else if (file.type.includes("zip")) path = "/zip.svg"

    return (
      <div className='fileCard rounded-3xl m-2'>
        <img src={path} className='w-20 inline'/>
        <p className='mt-2'>{file.name.length <= 12 ? file.name : `${file.name.substring(0, 10)}...`}</p>
        <p>{formattedSize(file.size)}</p>
      </div>
    )
  }
  
  const files = uploadedFiles.map(file => (getCard(file)));

  return (
    <section className="container w-fit rounded-lg">
      <div {...getRootProps({className: 'dropzone'})} className='p-10'>
        <input {...getInputProps()} />
        {uploadedFiles.length > 0 ?
        
        <div id='files' className='flex flex-wrap justify-center'>
          {files}
        </div>
        : 
        <div className='uploadMessage flex justify-center w-fit'>
          <FontAwesomeIcon icon={faUpload} size={"3x"} className="uploadIcon"/>
          <div className='flex flex-wrap align-start flex-col'>
            <h1 className='uploadTitle w-full'>Drop or upload files</h1>
            <h2 className='uploadSubtitle w-full'>Upload up to 10 files at a time</h2>
          </div>
        </div>}
        
        
        
      </div>
    </section>
  );
}