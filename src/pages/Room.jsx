import React, { useState } from 'react';
import { useEffect } from 'react';
import { databases, ID, client } from '../appwriteConfig.js';
import { Query, Role, Permission } from 'appwrite';
import {Trash2} from 'react-feather';
import Header from '../components/Header.jsx';
import { useAuth } from '../utils/AuthContext.jsx';
import conf from '../conf/conf.js'

function Room() {
    const [messages, setMessages] = useState([])
    const [messageBody, setMessageBody] = useState('')
    const {user} = useAuth()

    useEffect(() => {
        getMessages()
        const unsubscribe = client.subscribe('databases.6766b7be003292b20523.collections.6766b7d8002ba975712f.documents', response => {
            // Callback will be executed on changes for all documents.
            console.log("Real Time: ", response);

            if (response.events.includes("databases.*.collections.*.documents.*.create")) {
                console.log("A Message is Created");
                setMessages((prevState)=>[response.payload,...prevState])
            }

            if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
                console.log("A Message is Deleted");
                setMessages((prevState) => prevState.filter(msg => msg.$id != response.payload.$id))
            }
        });

        return () => {
            unsubscribe();
        }

    }, [])

    const handleSubmit = async(e) => {
        e.preventDefault()

        let permissions = [
            Permission.write(Role.user(user.$id))  
            // The user who send a msg will have the permission to update and delete the msg along with the create and read permission. 
            // Note: all the users have the create and read permission.
        ]

        const response = await databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            ID.unique(),
            {
                body: messageBody,
                user_id: user.$id,
                username: user.name
            },
            permissions

        );
        console.log("Created!", response);
        //setMessages((prevState)=>[response,...messages])
        setMessageBody('')
    }

    const getMessages = async() => {

        let response = await databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            [
                Query.orderDesc("$createdAt"),
                Query.limit(15)
            ]
        );
        setMessages(response.documents)
        console.log("Response docs = ", response.documents);
    }

    const delMessage = async(message_id) => {
        const result = await databases.deleteDocument(
            //'6766b7be003292b20523', // databaseId
            //'6766b7d8002ba975712f', // collectionId
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            message_id // documentId
        );
        console.log("Deleted! ",result);
        //setMessages(messages.filter(msg => msg.$id != message_id))
    }

    return (
        <main className='container'>
            <Header/>
            <div className='room--container'>
                <form onSubmit={handleSubmit} id='message--form'>
                    <div>
                        <textarea required maxLength={1000} placeholder='type msg here...' onChange={(e)=>{
                            setMessageBody(e.target.value)
                        }} value={messageBody}>
                        </textarea>
                    </div>
                    <div className='send-btn--wrapper'>
                        <input className='btn btn--secondary' type="submit" value="Send"/>
                    </div>
                </form>
                <div>
                    {messages.map((msg) => (
                        <div key={msg.$id}  className='message--wrapper'>
                            <div className='message--header'>
                                <p>                                
                                    {msg.username ? <span>{msg.username}</span> : <span>Anonymous user</span>}
                                    <small className='message-timestamp'>
                                        {new Date(msg.$createdAt).toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                        })}
                                    </small>
                                </p>
                                {(msg.user_id == user.$id) && (<Trash2 className='delete--btn' onClick={() => {delMessage(msg.$id)}}/>)}
                            </div>
                            <div className='message--body'>
                                <span>{msg.body}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default Room;