import React from 'react';
import { useAuth } from '../utils/AuthContext';
import { LogOut } from 'react-feather';

function Header() {
    const {user, handleUserLogout} = useAuth()
    return (
        <div id='header--wrapper'>
            {user ? (
                <>
                    Welcome {user.name}
                    <LogOut className='header--link' onClick={handleUserLogout}/>
                </>
            ) : (<button>Login</button>)}
        </div>
    );
}

export default Header;