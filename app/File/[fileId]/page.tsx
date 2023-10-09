"use client";

import Nav from '@/components/nav'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faCircleXmark} from "@fortawesome/free-solid-svg-icons"
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { getFileType } from "@/lib/fileInfo";
import { formattedSize } from '@/lib/fileInfo';


export default function Page() {

    const [fileData, setFileData] = useState<any>(null)
    const [fileType, setFileType] = useState<null | string>(null)
    const [fileText, setFileText] = useState<null | string>(null)
    const {data : session, status} = useSession();
    const [openDelete, setOpenDelete] = useState(false)
    const [url, setUrl] = useState<null | string>(null)
    const params = useParams()
    const router = useRouter()

    useEffect(()=>{
        if (fileData != null) return
        
        if (!session?.user.id) return
        fetch('/api/file', {
            method: 'POST',
            body: JSON.stringify({fileId: params.fileId}),
            headers: { "Content-Type": "application/json" }
          }).then((res)=>{
            res.json().then((jsonData)=>{
                setFileData(jsonData.data)
                setUrl(jsonData.url)
                setFileType(getFileType(jsonData.data))
            })
          })
    })

    function download(){
        if (!url) return
        fetch(url, {
            method: 'GET',
        })
        .then((response) => response.blob())
        .then((blob) => {
            // Create blob link to download
            const url = window.URL.createObjectURL(
            new Blob([blob]),
            );
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
            'download',
            `FileName.pdf`,
            );

            // Append to html link element page
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            link.parentNode?.removeChild(link);
        });
    }

    function deleteFile(){
        if (!fileData) return

        const body =  {fileId: fileData.id}

        fetch('/api/delete', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" }
        }).then((res)=>{
            router.push("/Files")
        })
    }

    return (
        <main className="flex min-h-screen flex-col items-center">
            {openDelete ? <div className='absolute w-screen h-screen bg-gray-900/50 z-50 flex justify-center items-center'>
                <div className='p-5 bg-white rounded-lg flex flex-col items-center relative'>
                <FontAwesomeIcon icon={faCircleXmark} size={"lg"} className="absolute top-2 right-2 hover:text-red-500 cursor-pointer" onClick={()=>setOpenDelete(false)}/>
                    <p className='text-cente text-xl'> Are you sure?</p>
                    <p className='font-bold text-center text-red-500'>You can't undo this action</p>
                    <div className='p-2'/>
                    <button className='w-fit p-3 rounded-full border-red-600 border hover:bg-red-600 hover:text-white' onClick={deleteFile}>Permanently Delete File</button>
                </div>
            </div> : null}
            <Nav page={""}/>
            <div className='p-12'/>
            <div className='flex justify-center w-full' id='content'>
                <div className='w-2/5 p-3'>
                    <div className='rounded-lg flex flex-wrap w-full even-box-shadow overflow-y-auto p-3 flex justify-center' id="fileInfo">
                        <p className='w-full text-center font-bold text-2xl'> File Metadata</p>
                        <div className='flex justify-center p-3 overflow-x-auto w-full'>
                            {fileData ? 
                            <div className='flex flex-col w-full'>
                                <div className='flex w-full justify-center gap-5 items-center'>
                                    <div className='border-e border-black p-5 w-1/4'>
                                        <p className='font-bold line-clamp-1 w-full text-end'>File Name</p>
                                    </div>
                                    <p className='font-bold p-2 text-accent text-scroll w-4/6 text-center'>{fileData.fileName}</p>
                                </div>
                                <div className='flex w-full justify-center gap-5 items-center'>
                                    <div className='border-e border-black p-5 w-1/4'>
                                        <p className='font-bold line-clamp-1 w-full text-end'>Content Type</p>
                                    </div>
                                    <p className='font-bold p-2 text-accent text-scroll w-4/6 text-center'>{fileData.type}</p>
                                </div>
                                <div className='flex w-full justify-center gap-5 items-center'>
                                    <div className='border-e border-black p-5 w-1/4'>
                                        <p className='font-bold line-clamp-1 w-full text-end'>File Size</p>
                                    </div>
                                    <p className='font-bold p-2 text-accent text-scroll w-4/6 text-center'>{formattedSize(fileData.size)}</p>
                                </div>
                                <div className='flex w-full justify-center gap-5 items-center'>
                                    <div className='border-e border-black p-5 w-1/4'>
                                        <p className='font-bold line-clamp-1 w-full text-end'>File Id</p>
                                    </div>
                                    <p className='font-bold p-2 text-accent text-scroll w-4/6 text-center'>{fileData.id}</p>
                                </div>
                                <div className='flex w-full justify-center gap-5 items-center'>
                                    <div className='border-e border-black p-5 w-1/4'>
                                        <p className='font-bold line-clamp-1 w-full text-end'>Uploaded On</p>
                                    </div>
                                    <p className='font-bold p-2 text-accent text-scroll w-4/6 text-center'>{new Date(fileData.uploadedOn).toString()}</p>
                                </div>
                            </div> : null
                            }
                        </div>
                    </div>
                    <div className='p-2'/>
                    <div className='rounded-lg flex flex-wrap w-full even-box-shadow overflow-y-auto p-3 flex justify-center'>
                        <p className='w-full text-center font-bold text-2xl'> File Actions</p>
                        <div className='p-2'/>
                        <div className='w-full flex flex-col gap-2'>
                            <button className='w-full pt-2 pb-2 rounded-full border-accent border hover:bg-accent hover:text-white'>Edit with Code</button>
                            <button className='w-full pt-2 pb-2 rounded-full border-lime-500 border hover:bg-lime-500 hover:text-white'>Edit with Script</button>
                            <button className="w-full pt-2 pb-2 rounded-full border-emerald-400 border hover:bg-emerald-400 hover:text-white flex justify-center" onClick={download}>Download</button>
                            <button className='w-full pt-2 pb-2 rounded-full border-red-600 border hover:bg-red-600 hover:text-white' onClick={()=>setOpenDelete(true)}>Permanently Delete File</button>
                        </div>
                    </div>
                </div>
                <div className='w-3/5 p-3 '>
                    <div className='rounded-lg flex flex-col w-full h-full even-box-shadow overflow-y-auto'>
                        <p className='w-full text-center font-bold text-2xl p-2'> File Preview</p>
                        <div className='p-3 w-full h-full'>
                            <div className='w-full h-full flex justify-center items-center p-5 border-accent border-solid border-2 rounded-lg'>
                                {fileData && 
                                    fileType == "image" ? <img src={url ? url : ""} className='w-full'/> :
                                    fileType == "audio" ? <audio controls src={url ? url : ""} className='w-full'/>:
                                    fileType == "video" ? <video controls src={url ? url : ""} className='w-full'>
                                            <source src={url ? url : ""} type={fileData.type} />
                                        </video>:
                                    fileType == "text" ? <object data={url ? url : ""} className='w-full h-screen'> Not supported </object> :
                                    <p className='text-red-600'>Whoops! Couldn't render your file.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
