import React, { createContext, useContext, useState, useEffect } from 'react';
import {account} from '../appwriteConfig.js'; // Import Appwrite account instance
import { useNavigate } from 'react-router-dom';
import { ID } from '../appwriteConfig.js';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State to store authenticated user
    const [loading, setLoading] = useState(true); // State to handle initial load
    const navigate = useNavigate();
    const userId = ID.unique();

    useEffect(() => {
        getUserOnLoad()
    },[])

    // Fetch current user from Appwrite
    const getUserOnLoad = async () => {
        try {
            const userData = await account.get();
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Register (sign up) user
    const handleRegisterUser = async(e, credentials) => {
        e.preventDefault()
        console.log("Handle Register triggered!", credentials);

        try {
            const response = await account.create(userId, credentials.email, credentials.password, credentials.name);
            console.log("User registered!", response);
            handleUserLogin(e, credentials)
        } catch (err) {
            console.error(err);
        }
    }

    // Login function
    const handleUserLogin = async (e, credentials) => {
        e.preventDefault();

        try {
            let response = await account.createEmailPasswordSession(credentials.email, credentials.password);
            console.log("Sucecssfully LoggedIn: ",response);
            
            let accountDetails = await account.get();  // we can use account.get() only when we are loggedin
            console.log("Account Details (USER): ", accountDetails);

            setUser(accountDetails);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    // Logout function
    const handleUserLogout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            navigate('/login'); // Redirect after logout
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, handleUserLogin, handleUserLogout, handleRegisterUser}}>
            {loading ? <p>Loading...    </p> : children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};