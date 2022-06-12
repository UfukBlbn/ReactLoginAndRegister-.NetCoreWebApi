import React from 'react'
import {useState, useEffect} from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation,useNavigate } from 'react-router-dom';

const Users = () => {

  const USERS_URL ='/Home/users';
  const [users,setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();

    debugger
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(USERS_URL,{
          signal:controller.signal
        });
        isMounted && setUsers(response.data);
      } catch (err) {
        console.log(err);
        // navigate('/login', {state : {from : location}, replace : true})
      }
    }


    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    }


  },[]);
  return (
    <article>
      <h2>User List</h2>
      {
        users?.length  ?
         ( <ul> {users.map((user, i ) => <li key={i}>{user?.firstName}</li> )} </ul> ) 
         : <p> No Users To Display</p>


      }
    </article>
  )
}

export default Users