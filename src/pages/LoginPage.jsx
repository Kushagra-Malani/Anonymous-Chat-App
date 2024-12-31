import React, {useEffect, useState} from 'react'
import { useAuth } from '../utils/AuthContext'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import '../index.css'

function LoginPage() {
    const navigate = useNavigate()
    const {user, handleUserLogin} = useAuth()
    const [credentials, setCredentials] = useState({
        email:"", 
        password:""
    })

    useEffect(() => {
        if(user){
          navigate('/')
        }
    },[])

    // useEffect(() => {
    //     console.log(credentials);
    // },[credentials])

    return (
        <div className="auth--container">
          <div className="form--wrapper">
            <form onSubmit={(e) => {handleUserLogin(e, credentials)}}>
                <div className="field--wrapper">
                  <label>Email:</label>
                  <input 
                  required
                  type="email"
                  name="email"
                  placeholder="Enter your email..."
                  value={credentials.email}
                  onChange={(e) => {
                    setCredentials({
                        ...credentials,
                        email: e.target.value
                    })
                  }}
                  />
                </div>

                <div  className="field--wrapper">
                  <label>Password:</label>
                  <input 
                  required
                  type="password"
                  name="password"
                  placeholder="Enter password..."
                  value={credentials.password}
                  onChange={(e) => {
                    setCredentials({
                        ...credentials,
                        password: e.target.value
                    })
                  }}
                  />
                </div>

                <div className="field--wrapper">

                  <input 
                  type="submit"
                  value="Login"
                  className="btn btn--lg btn--main"
                  />

                </div>
            </form>

            <p>Dont have an account? Register <Link to="/register">here</Link></p>
          </div>
        </div>
    );
}

export default LoginPage;