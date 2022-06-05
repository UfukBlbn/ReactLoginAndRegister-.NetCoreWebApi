import React from 'react'
import {useRef,useState,useEffect} from "react";
import {faCheck,faTimes,faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import '../index.css'
import axios from "../api/axios";
import { Checkbox } from 'react-input-checkbox';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX =  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const REGISTER_URL ='/api/Authentication/register-user';


export const Register = () => {
    const userRef = useRef();
    const errRef = useRef();


    const[userFirstName,setUserFirstName] =useState('');
    const[userFirstNameFocus,setUseruserFirstNameFocus]=useState(false);

    const[userLastName,setUserLastName] =useState('');
    const[userLastNameFocus,setUseruserLastNameFocus]=useState(false);

    const[userRole,setUserRole] =useState('Student');

    const[userEmail,setUserEmail] =useState('');
    const[validEmail,setUserValidEmail]=useState(false);
    const[userEmailFocus,setUserEmailFocus]=useState(false);

    const[user,setUser] =useState('');
    const[validName,setValidName]=useState(false);
    const[userFocus,setUserFocus]=useState(false);

    const[pwd,setPwd] =useState('');
    const[validPwd,setValidPwd]=useState(false);
    const[pwdFocus,setPwdFocus]=useState(false);

    const[matchPwd,setMatchPwd] =useState('');
    const[validMatch,setValidMatch]=useState(false);
    const[matchFocus,setMatchFocus]=useState(false);

    const[errMsg,setErrMsg] =useState('');
    const[success,setSuccess] =useState(false);


    useEffect(()=> {
        userRef.current.focus();
    },[])

    useEffect(()=> {
        const result = USER_REGEX.test(user);
        setValidName(result);
    },[user])

    useEffect(()=> {
        const result = EMAIL_REGEX.test(userEmail);
        setUserValidEmail(result);
    },[userEmail])
    useEffect(()=> {
        const result = EMAIL_REGEX.test(userEmail);
        setUserValidEmail(result);
    },[userEmail])

    useEffect(()=> {
        const result = EMAIL_REGEX.test(userEmail);
        setUserValidEmail(result);
    },[userEmail])

    useEffect(()=> {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        const match = pwd===matchPwd;
        setValidMatch(match);
    },[pwd,matchPwd])


    useEffect(()=>
    {
        setErrMsg('');
    },[user,pwd,matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e.target.checked)
        //if button enabled with js hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
  
        if(!v1 || !v2)
        {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
           const response = await axios.post(
              REGISTER_URL,JSON.stringify({firstName:userFirstName,lastName:userLastName,emailAddress:userEmail,userName:user,password:pwd,role:userRole}) ,
              {
                  headers:{'Content-Type':'application/json'},
                  withCredentials:true
              } 
           );
           setSuccess(true);
           console.log(response.data)
        } catch (err) {
            if (!err?.response) {
                setErrMsg('');
            }
            else if(err.response?.status === 409) {
                setErrMsg('Username taken')
            }
            else {
                setErrMsg(err.response.message)
            }

            errRef.current.focus();
        }
    }

  return (
      <>
      {success ? (
          <section>
              <h1>Success ! </h1>
              <p>
                  <a href="#">Sign In</a>
              </p>
          </section>
      ) : (
        <section>
            <p ref={errRef} className={errMsg?"errmsg":"offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
            <label htmlFor="userFirstName">
                    First Name:
                </label>
                <input
                        type="text"
                        id="userFirstName"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e)=>setUserFirstName(e.target.value)}
                        required
                        aria-describedby="uidnote"
                        onFocus={() =>setUseruserFirstNameFocus(true)}
                        onBlur={()=> setUseruserFirstNameFocus(false)}
                />

                <label htmlFor="userLastName">
                    Last Name:
                </label>
                <input
                        type="text"
                        id="userLastName"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e)=>setUserLastName(e.target.value)}
                        required
                        aria-describedby="uidnote"
                        onFocus={() =>setUseruserLastNameFocus(true)}
                        onBlur={()=> setUseruserLastNameFocus(false)}
                />

                <label htmlFor="useremail">
                    Email Adress:
                    <span className={validEmail? "valid":"hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validEmail || !userEmail ? "hide":"invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input
                        type="text"
                        id="useremail"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e)=>setUserEmail(e.target.value)}
                        required
                        aria-invalid={validEmail?"false":"true"}
                        aria-describedby="uidnote"
                        onFocus={() =>setUserFocus(true)}
                        onBlur={()=> setUserFocus(false)}
                />

                <p id="uidnote" className={userFocus && userEmail && !validEmail ? "instructions":"offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    You have to enter a valid mail address
                </p>

                <label htmlFor="username">
                    UserName:
                    <span className={validName? "valid":"hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validName || !user ? "hide":"invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e)=>setUser(e.target.value)}
                        required
                        aria-invalid={validName?"false":"true"}
                        aria-describedby="uidnote"
                        onFocus={() =>setUserFocus(true)}
                        onBlur={()=> setUserFocus(false)}
                />

                <p id="uidnote" className={userFocus && user && !validName ? "instructions":"offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    4 to 24 characters.<br/>
                    Must begin wih a letter<br/>
                    Letters, numbers,underscores,hyphens allowed.
                </p>

                <label htmlFor="password">
                    Password :
                    <span className={validPwd? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validPwd || !pwd ? "hide":"invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>

                <input
                        type="password"
                        id="password"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e)=>setPwd(e.target.value)}
                        required
                        aria-invalid={validPwd?"false":"true"}
                        aria-describedby="pwdnote"
                        onFocus={() =>setPwdFocus(true)}
                        onBlur={()=> setPwdFocus(false)}
                />
                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters.<br />
                        Must include uppercase and lowercase letters, a number and a special character.<br />
                        Allowed special characters: 
                        <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> 
                        <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span>
                        <span aria-label="percent">%</span>
                </p>
                <label htmlFor="confirm_pwd">
                    Confirm Password :
                    <span className={validMatch && matchPwd ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validMatch || !matchPwd ? "hide":"invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input
                        type="password"
                        id="confirm_pwd"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e)=>setMatchPwd(e.target.value)}
                        required
                        aria-describedby="confirmnote"
                        onFocus={() =>setMatchFocus(true)}
                        onBlur={()=> setMatchFocus(false)}
                />
                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input field.
                </p>


                <button id="reg-btn" disabled={!validName || !validPwd || !validMatch ? true : false}>
                    Sign Up
                </button>
            </form>
            <p>
                Already registered?<br />
                <span className="line">
                    {/*put router link here*/}
                    <a href="#">Sign In</a>
                </span>
            </p>
        </section>
      )}
      </>
  )
}


export default Register;