import Nav from "@/components/nav"
import FileUpload from "@/components/fileUpload";

import '@/static/home.css'

export default function Page() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
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
        <FileUpload/>
      </div>
    </main>
  )
}
