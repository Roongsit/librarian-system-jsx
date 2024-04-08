import React from 'react'
import { useNavigate } from 'react-router-dom'


function Home() {


    console.log(user);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try{
            await logOut();
            navigate('/');
        }catch(err){
            console.log(err.message);
        }
    }


  return (
    <div>
        <h2>Welcome to home page</h2>
        <p>Hi, {user.email}</p>
        <a onClick={handleLogout} variant='danger'>Logout</a>
    </div>
  )
}

export default Home