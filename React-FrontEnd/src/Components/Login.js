import React from 'react'
import { useRef,useState,useEffect,useContext } from 'react'
import useAuth from "../hooks/useAuth"
import axios from '../api/axios';
import { Link,useNavigate,useLocation } from 'react-router-dom';
const LOGIN_URL ='/api/Authentication/login';


const Login = () => {

    const {setAuth} = useAuth();
    
    const navigate = useNavigate();
    const location =useLocation();
  
    const from = location.state?.from?.pathname || "/";


    const userRef=useRef();
    const errRef=useRef();
    

    const [user,setUser] = useState('');
    const [pwd,setPwd] = useState('');
    const [errMsg,setErrMsg] = useState('');
 


    useEffect(()=>{
        userRef.current.focus();
    },[])

    useEffect(()=> {
        setErrMsg('');
    },[user,pwd])

    const handleSubmit= async (e) => 
    {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({emailAddress:user,password:pwd}),
                {
                    headers:{'Content-Type':'application/json'},
                    withCredentials:true
                } 
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response.data.authResult.token;
            const userRole = response.data.userRoles;
            setAuth({ user, pwd, userRole, accessToken });
            setUser('');
            setPwd('');
            //navigate
            navigate(from, {replace : true});
        } catch (err) {
            if (!err?.response) {
                setErrMsg('');
            }
            else if(err.response?.status === 400) {
                setErrMsg('Missing username or password')
            }
            else {
                setErrMsg(err.response.message)
            }
            errRef.current.focus();
        }

      
    }

  return (
      <>
      
            <section>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="useremail">Email Address:</label>
                    <input
                        type="text"
                        id="useremail"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                    />
                    <button id="reg-btn">Sign In</button>
                </form>
                <p>
                    Need an Account?<br />
                    <span className="line">
                        {/*put router link here*/}
                        <a href="#">Sign Up</a>
                    </span>
                </p>
            </section>
           
      </>
      
  )
}

export default Login