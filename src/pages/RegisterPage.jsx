import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { Link } from 'react-router-dom';

function RegisterPage() {
    const [creds, setCreds] = useState({
        name: "",
        email: "",
        password: ""
    })

    const {handleRegisterUser} = useAuth()

    return (
        <div className="auth--container">
            <div className="form--wrapper">
  
                <form onSubmit={(e) => {handleRegisterUser(e, creds)}}>
                  <div className="field--wrapper">
                        <label>Name:</label>
                        <input 
                          required
                          type="text" 
                          name="name"
                          //value={credentials.name}
                          placeholder="Enter your name..."
                          onChange={(e) => {
                            setCreds({
                                ...creds,
                                name: e.target.value
                            })
                          }}
                        />
                    </div>

                    <div className="field--wrapper">
                        <label>Email:</label>
                        <input 
                          required
                          type="email" 
                          name="email"
                          placeholder="Enter your email..."
                          //value={credentials.email}
                          onChange={(e) => {
                            setCreds({
                                ...creds,
                                email: e.target.value
                            })
                          }}
                        />
                    </div>

                    <div className="field--wrapper">
                        <label>Password:</label>
                        <input 
                          required
                          type="password" 
                          name="password1"
                          placeholder="Enter a password..."
                          //value={credentials.password1}
                          onChange={(e) => {
                            setCreds({
                                ...creds,
                                password: e.target.value
                            })
                          }}
                        />
                    </div>

                    <div className="field--wrapper">
                        <input className="btn btn--lg btn--main" type="submit" value="Register"/>
                    </div>
                </form>

                <p>Already have an account? Login <Link to="/login">here</Link></p>
            </div>
        </div>
    );
}

export default RegisterPage;