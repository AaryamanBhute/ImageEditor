"use client";

import Nav from '@/components/nav'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faCircleXmark} from "@fortawesome/free-solid-svg-icons"
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'


export default function Page() {

    const [fileData, setFileData] = useState<any>(null)
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
            })
          })
    })

    function sortData(){

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
                        <div className='flex justify-center p-3 gap-4 overflow-x-auto w-full'>
                            <div className='border-e border-black p-2'>
                                <p className='font-bold p-2 line-clamp-1'>File Name</p>
                                <p className='font-bold p-2 line-clamp-1'>Content Type</p>
                                <p className='font-bold p-2 line-clamp-1' >Size</p>
                                <p className='font-bold p-2 line-clamp-1'>File Id</p>
                                <p className='font-bold p-2 line-clamp-1'>Uploaded On</p>
                            </div>
                            <div className='p-2 w-3/5 overflow-x-auto'>
                                {fileData ?
                                <div>
                                <p className='font-bold p-2 text-accent text-scroll'>{fileData.fileName}</p>
                                <p className='font-bold p-2 text-accent text-scroll'>{fileData.type}</p>
                                <p className='font-bold p-2 text-accent text-scroll'>{fileData.size}</p>
                                <p className='font-bold p-2 text-accent text-scroll'>{fileData.id}</p>
                                <p className='font-bold p-2 text-accent text-scroll'>{new Date(fileData.uploadedOn).toString()}</p>
                                </div> : null
                                }
                                
                            </div>
                        </div>
                    </div>
                    <div className='p-2'/>
                    <div className='rounded-lg flex flex-wrap w-full even-box-shadow overflow-y-auto p-3 flex justify-center'>
                        <p className='w-full text-center font-bold text-2xl'> File Actions</p>
                        <div className='p-2'/>
                        <div className='w-full flex flex-col gap-2'>
                            <button className='w-full pt-2 pb-2 rounded-full border-accent border hover:bg-accent hover:text-white'>Edit with Code</button>
                            <button className='w-full pt-2 pb-2 rounded-full border-lime-500 border hover:bg-lime-500 hover:text-white'>Edit with Script</button>
                            <button className='w-full pt-2 pb-2 rounded-full border-red-600 border hover:bg-red-600 hover:text-white' onClick={()=>setOpenDelete(true)}>Permanently Delete File</button>
                        </div>
                    </div>
                </div>
                <div className='w-3/5 p-3'>
                    <div className='rounded-lg flex flex-col w-full h-full even-box-shadow overflow-y-auto'>
                        <p className='w-full text-center font-bold text-2xl p-2'> File Preview</p>
                        {url ?<img src={url} className='p-4'/> : null}
                    </div>
                </div>
            </div>
        </main>
    )
}
