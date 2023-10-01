import "@/static/popup.css"

type PopupProps = {
    message : string | null | undefined,
    type: string | null | undefined,
    onFinish: Function
}

export default function Popup(props : PopupProps){
    setTimeout(()=>{
        props.onFinish()
    }, 2000)
    
    return (
        props.message ?
            <div key={Math.random()} className={`absolute top-3 right-3 rounded-lg z-50 ps-5 pe-5 pt-2 pb-2 border-4 ${props.type === "failure" ? "border-red-500": "border-green-500"}`} id="popup">
                <p className={props.type === "failure" ? "text-red-600" : "text-green-500"}>{props.message}</p>
            </div> :
            null
    );
}