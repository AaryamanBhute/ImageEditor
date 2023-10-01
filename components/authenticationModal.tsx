"use client";

import "@/static/authentication.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faCircleXmark} from "@fortawesome/free-solid-svg-icons"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import {useState, useEffect, FormEvent} from "react";
import type {InferGetServerSidePropsType } from "next";
import getServerSideProps from "@/lib/serverSideProps";
import {signIn} from "next-auth/react"

type AuthenticationModalProps = {
    setPopupMessage : Function,
    setPopupType: Function,
    close: Function,
    forceUpdate: Function
}

export default function AuthenticationModal(props : AuthenticationModalProps, { csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>){

    const [state, setState] = useState("logIn")
    const [errorMessage, setErrorMessage] = useState<null | string>(null);

    function createUser(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
     
        const formData = new FormData(event.currentTarget)
        
        if (formData.get("password") !== formData.get("confirmPassword")){
            setErrorMessage("Passwords do not match")
            return
        }

        if (formData.get("email") !== formData.get("confirmEmail")){
            setErrorMessage("Emails do not match")
            return
        }

        const response = fetch('/api/createAccount', {
            method: 'POST',
            body: formData,
          }).then((res)=>{
            res.json().then((data)=>{
                props.setPopupMessage(data.message);
                props.setPopupType(data.type);
                props.forceUpdate();
                setState("logIn");
            })
          })
      }
    
    function logIn(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        const username = formData.get("username");
        const password = formData.get("password");

        const result = signIn("credentials", {
            redirect: false,
            username: username,
            password: password,
        }).then((res : any) =>{
            if (res.error === null){
                props.setPopupMessage("logged in");
                props.setPopupType("success");
                props.forceUpdate();
                props.close();
            }
            else{
                props.setPopupMessage("Invalid credentials");
                props.setPopupType("failure");
                props.forceUpdate();
            }
        });
    }
    
    return (
            <div id="authenticationModal" className="flex justify-center items-center w-screen h-screen bg-gray-900/50 absolute z-50">
                {state == "logIn" ?
                    <div id="modalBody" className="rounded flex flex-col justify-center items-center top-0 left-0 p-3 relative">
                        <FontAwesomeIcon icon={faCircleXmark} size={"lg"} className="absolute top-2 right-2 hover:text-red-500 cursor-pointer" onClick={()=>{props.close();props.setPopupMessage(null)}}/>
                        <h2 className="text-lg font-bold mb-1">Login With A Provider</h2>
                        <div id="providers flex flex-wrap">
                            <FontAwesomeIcon icon={faGoogle} size={"2x"} className="me-4" onClick={()=>{signIn("google")}}/>
                        </div>
                        <h2 className="text-lg font-bold ">Login With Credentials</h2>
                        <form onSubmit={logIn} className="flex flex-col p-3" id="logInForm">
                            <div>
                                <label htmlFor="username">Username: </label>
                                <input type="text" name="username" placeholder="Enter a username!" required/>
                            </div>
                            <div>
                                <label htmlFor="password">Password: </label>
                                <input type="password" name="password" placeholder="Password" required/>
                            </div>
                            <div className="flex w-full justify-center">
                                <button type="submit" id="submitButton" className="rounded-full p-1 ps-3 pe-3">Submit</button>
                            </div>
                        </form>
                        <p className="text-sm"> New Here? <span className="changeLabel" onClick={()=> setState("signUp")}> Sign Up</span></p>
                    </div>
                    :
                    <div id="modalBody" className="rounded flex flex-col justify-center items-center top-0 left-0 p-5 relative">
                        <FontAwesomeIcon icon={faCircleXmark} size={"lg"} className="absolute top-2 right-2 hover:text-red-500 cursor-pointer" onClick={()=>{props.close();props.setPopupMessage(null)}}/>
                        <h2 className="text-lg font-bold">Create Account</h2>
                        <form onSubmit={createUser} className="flex flex-col p-3" id="signUpForm">
                            <div>
                                <label htmlFor="username">Username: </label>
                                <input type="text" name="username" placeholder="RadSkydiver43" required/>
                            </div>
                            <div>
                                <label htmlFor="password">Password: </label>
                                <input type="password" name="password" placeholder="SecurePassword123" required/>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword">Confirm Password: </label>
                                <input type="password" name="confirmPassword" placeholder="SecurePassword123" required/>
                            </div>
                            <div>
                                <label htmlFor="email">Email: </label>
                                <input type="text" name="email" placeholder="NiftyUser@random.com" required/>
                            </div>
                            <div>
                                <label htmlFor="confirmEmail">Confirm Email: </label>
                                <input type="text" name="confirmEmail" placeholder="NiftyUser@random.com" required/>
                            </div>
                            <div className="flex content-center">
                                <label htmlFor="confirmEmail">Subscribe to Alerts: </label>
                                <input type="checkbox" name="subscribeToAlerts" className="ms-5" defaultChecked/>
                            </div>
                            {errorMessage == null ? null :<div>
                                <p className="text-center text-red-600 italic">{errorMessage}</p>
                            </div>}
                            <div className="flex w-full justify-center">
                                <button type="submit" id="submitButton" className="rounded-full p-1 ps-3 pe-3">Submit</button>
                            </div>
                        </form>
                        <p className="text-sm"> Already have an account? <span className="changeLabel" onClick={()=> setState("logIn")}> Login</span></p>
                    </div>
                }
            </div>
    );
}