"use client";

import React from 'react';
import {useState, useEffect} from 'react';
import {useSession, signIn, signOut} from "next-auth/react";
import {useDropzone} from 'react-dropzone';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import "@/static/fileUpload.css"
import {getFileImage} from '@/lib/fileInfo';
import { formattedSize } from '@/lib/fileInfo';

type FileUploadProps = {
  onUnauthenticated : Function,
  setPopupMessage: Function,
  setPopupType: Function,
  onUploaded?: Function,
};

export default function FileUpload(props : FileUploadProps) {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const {data : session, status} = useSession();

  useEffect(()=>{
    if (status !== 'unauthenticated') setUploadedFiles(uploadedFiles.concat(acceptedFiles))
    else if(acceptedFiles.length > 0) props.onUnauthenticated()
  }, [acceptedFiles])

  
  function getCard(file : File){
    var path = getFileImage(file)

    return (
      <div className='fileCard rounded-3xl m-2 flex flex-col items-center'>
        <img src={path} className='w-16 inline'/>
        <p className='mt-2'>{file.name.length <= 12 ? file.name : `${file.name.substring(0, 10)}...`}</p>
        <p>{formattedSize(file.size)}</p>
      </div>
    )
  }

  async function uploadFiles(){
    if (uploadedFiles.length <= 0) return

    try {
      const data = new FormData()

      uploadedFiles.map((file)=>{
        data.append('files', file)
      })
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      })

      props.setPopupMessage("Uploaded files successfully")
      props.setPopupType("success")
      setUploadedFiles([])
      
      if (props.onUploaded) props.onUploaded()

      // handle the error
    } catch (e: any) {
      // Handle errors here
      console.error(e)
    }
  }
  
  const files = uploadedFiles.map(file => (getCard(file)));

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <section className="container w-fit rounded-lg">
        <div {...getRootProps({className: 'dropzone'})} className='p-10'>
          {uploadedFiles.length > 0 ?
          <div id='files' className='flex flex-wrap justify-center'>
            {files}
          </div>
          : 
          <div className='uploadMessage flex justify-center w-fit'>
            <FontAwesomeIcon icon={faUpload} size={"3x"} className="uploadIcon"/>
            <div className='flex flex-wrap align-start flex-col'>
              <h1 className='uploadTitle w-full'>Drop or upload files</h1>
              <h2 className='uploadSubtitle w-full'>Upload 1 or more files at a time</h2>
            </div>
          </div>}
        </div>
      </section>
      {uploadedFiles.length > 0 ? <button className='submitButton rounded-full mt-4 w-fit' onClick={()=>{
        console.log("CLICKED");
        uploadFiles()}
        }>Submit Files</button> : null}
    </div>
  );
}