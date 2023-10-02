"use client";

import Nav from "@/components/nav"
import FileUpload from "@/components/fileUpload";
import { useState, useEffect } from "react";
import {useSession, signIn, signOut} from "next-auth/react";
import AuthenticationModal from "@/components/authenticationModal";
import Popup from "@/components/popup";
import useForceUpdate from "@/lib/useForceUpdate";
import { useSearchParams } from 'next/navigation'
import {getFileImage} from "@/lib/fileInfo";
import '@/static/files.css'
import Link from "next/link";

export default function Page(){
    const searchParams = useSearchParams()
    const [popupMessage, setPopupMessage] = useState<null | string>(null);
    const [selectedFile, setSelectedFile] = useState<null | number>(null);
    const [popupType, setPopupType] = useState<null | string>(null);
    const [fileInfos, setFileInfos] = useState<null | any[]>(null);
    const [openAuthentication, setOpenAuthenticaiton] = useState(false);
    const forceUpdate = useForceUpdate();
    const { data: session , status} = useSession();

    useEffect(()=>{
        if (status === "unauthenticated") setOpenAuthenticaiton(true);
    }, [status])

    useEffect(()=>{
        loadFiles()

    }, [session?.user.id])

    function loadFiles(){
        if (!session?.user.id) return

        fetch('/api/files', {
            method: 'GET',
          }).then((res)=>{
            res.json().then((jsonData)=>{
                setFileInfos(jsonData.data)
            })
          })
    }

    return(
        <main className="flex min-h-screen flex-col items-center justify-start">
            {}
            {openAuthentication ? <AuthenticationModal setPopupMessage={setPopupMessage} setPopupType={setPopupType} forceUpdate={forceUpdate} close={()=>{}}/> : null}
            <Popup message={popupMessage} type={popupType} onFinish={()=>setPopupMessage(null)}/>
            <Nav page={"Files"}/>
            <div className="p-12"></div>
            <div className="flex w-screen h-screen justify-center items-start gap-3">
                <div className="h-5/6 w-2/5 rounded-lg flex flex-col justify-start">
                    <div className="p-3 max-w-full max-h-full">
                        <FileUpload onUnauthenticated={()=>{
                            setOpenAuthenticaiton(true)
                            }} setPopupMessage={setPopupMessage} setPopupType={setPopupType}
                            onUploaded={loadFiles}/>  
                    </div>
                </div>
                <div className="h-5/6 w-3/5 p-3">
                    <div className="rounded-lg flex flex-col w-full h-full even-box-shadow overflow-y-auto" id="fileView">
                        <div className="flex p-3 justify-between border-b-2">
                            <div className="flex flex-col justify-center p-2">
                                <p className="font-bold	text-md w-fit">Your Files</p>
                            </div>
                            <input type="text" className="w-1/6 p-2 text-center" placeholder="Search files"></input>
                            <select className="p-2 text-right w-fit" placeholder="filter" name="filter">
                                <option>Name &darr;</option>
                                <option>Name &uarr;</option>
                                <option>Size &darr;</option>
                                <option>Size &uarr;</option>
                                <option>Extension &darr;</option>
                                <option>Extension &uarr;</option>
                            </select>
                        </div>
                        <div className="p-5 flex flex-wrap justify-center w-full h-fit gap-2">
                            {fileInfos?.map((fileInfo, index)=>
                                <Link href={`/File/${fileInfo.id}`}>
                                    <div className="w-40 h-40 p-10 rounded-lg even-box-shadow relative fileCard" data-fileName={fileInfo.fileName} onClick={()=>{console.log("selected file"); setSelectedFile(index)}}>
                                        <p className="absolute bottom-0 left-0 w-full text-center p-2 z-10 rounded-lg cardLabel max-w-full truncate">{fileInfo.fileName}</p>
                                        <img src={getFileImage(fileInfo)} className="entry absolute top-0 left-0 p-5"/>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}