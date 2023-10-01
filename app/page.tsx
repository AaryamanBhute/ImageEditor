"use client";

import Nav from "@/components/nav"
import FileUpload from "@/components/fileUpload";
import { useState, useEffect } from "react";
import { useSession} from "next-auth/react"
import AuthenticationModal from "@/components/authenticationModal";
import Popup from "@/components/popup";
import useForceUpdate from "@/lib/useForceUpdate";
import { useSearchParams } from 'next/navigation'
import '@/static/home.css'

type Dictionary = {
  [x: string]: string | Dictionary;
};

export default function Page(params: { [key: string]: string | string[] | any | undefined }) {
  const searchParams = useSearchParams()
  const [popupMessage, setPopupMessage] = useState<null | string>(null);
  const [popupType, setPopupType] = useState<null | string>(null);
  const [openAuthentication, setOpenAuthenticaiton] = useState(false);
  const forceUpdate = useForceUpdate();
  const { data: session } = useSession();

  useEffect(() => {
    if (searchParams.get("error") !== null){
      setPopupMessage(searchParams.get("error"))
      setPopupType("failure")
  }  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {openAuthentication ? <AuthenticationModal setPopupMessage={setPopupMessage} setPopupType={setPopupType} forceUpdate={forceUpdate} close={()=>setOpenAuthenticaiton(false)}/> : null}
      <Popup message={popupMessage} type={popupType} onFinish={()=>setPopupMessage(null)}/>
      <Nav page={"Home"}/>
      <div className="mainTitle flex flex-wrap sm:justify-center content-start w-full max-w-6xl text-center m-3 h-fit">
        <h1 className="w-full">Edit your files within the browser</h1>
        <h2 className="w-5/6">
          Upload your files to edit them in the <span className="accent">browser</span> with
          <span className="accent"> code</span>. Too much work? You can still perform common
          tasks with our <span className="accent">pre-built scripts</span>! Still not all you need?
          Checkout our community <span className="accent">marketplace</span> to see if someone else made what you need!
        </h2>
      </div>
      <div className="flex flex-wrap sm:justify-center content-start w-full max-w-6xl text-center m-3 h-fit" id="dropzoneWrapper">
        <FileUpload onUnauthenticated={()=>{
          setOpenAuthenticaiton(true)
        }} setPopupMessage={setPopupMessage} setPopupType={setPopupType}/>
      </div>
    </main>
  )
}
