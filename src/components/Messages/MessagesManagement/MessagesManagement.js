import MessagesInput from '../MessagesInput/MessagesInput'
import MessagesHeader from '../MessagesHeader/MessagesHeader.js'
import PubnubContext from '../../ChatManagement/PubnubContext';
import MessagesContent from '../MessagesContent/MessagesContent';
import Grid from '@material-ui/core/Grid';
import './MessagesManagement.css';

import { useEffect, useState, useContext } from 'react';
import NoSelectedRoom from '../../Rooms/NoSelectedRoom/NoSelectedRoom';

const { DateTime } = require("luxon");

const MessagesManagement  = (props) => {

    const pubnub = useContext(PubnubContext);

    const [messages, setMessages] = useState([]);
    const [messagesByRoom, setMessagesByRoom] = useState([]);
    const [messagesEnd, setMessagesEnd] = useState({});

    useEffect(() => {
        pubnub.fetchMessages({
            channels: ["general"],
            count: 25
        }, function(status, response) {
            console.group('MESSAGES-FETCH');
            console.log(response.channels.general);
            console.groupEnd();

            const oldMessages = response.channels.general;
            oldMessages.forEach(message => {
                if (message.message.content) {
                    messages.push({
                        content: message.message.content,
                        isMine: message.message.authorUUID !== pubnub.getUUID() ? false : true,
                        author: message.message.author,
                        picture: message.message.picture,
                        time: message.message.time,
                        room: message.message.room
                    })
                    setMessages([ ...messages ]);   
                    sendNotification(message);
                }
            });
        })
    }, [])

    useEffect(() => {
        if (props.newMessage.message) {
            messages.push({ 
                content: props.newMessage.message.content, 
                isMine: props.newMessage.message.authorUUID !== pubnub.getUUID() ? false : true,
                author: props.newMessage.message.author,
                picture: props.newMessage.message.picture,
                time: props.newMessage.message.time,
                room: props.newMessage.message.room,
            });
            setMessages([ ...messages ]);
            sendNotification(props.newMessage);
        }
        
        getMessagesByRoom();
    
        if (messagesEnd && messagesEnd.scrollIntoView && (props.newMessage.message.room === props.selectedRoom)) {
            messagesEnd.scrollIntoView();
        }
    }, [props.newMessage]);

    useEffect(() => {
        getMessagesByRoom();
    }, [props.selectedRoom]);

    const getMessagesByRoom = () => {
        let newMessages = [];

        if (props.selectedRoom !== "general") {
            newMessages = messages.filter((message) => message.room === props.selectedRoom);
        } else {
            newMessages = messages.filter((message) => message.room === "general");
        }
       
        setMessagesByRoom([ ...newMessages ]);
    }
    
    const sendNotification = (msg) => {
        if (props.selectedRoom !== msg.message.room 
            && msg.message.authorUUID !== pubnub.getUUID()) {
            props.onHandleMessageReceived(msg.message);
        }
    }

    const onHandleMessageSent = (message) => {
        const publishPayload = {
            channel: props.selectedRoom,
            message: {
                type: "message",
                content: message,
                authorUUID: pubnub.getUUID(),
                author: localStorage.getItem('name') ? localStorage.getItem('name') : 'Anonyme',
                picture: localStorage.getItem('picture'),
                time: DateTime.now().toFormat('T'),
                room: props.selectedRoom
            }
        }

        pubnub.publish(publishPayload, function(status, response) {});
    }

    return (
        <div className="messages">
            {
                props.selectedRoom ?
                <div className="messages-management">
                    <div className="messages-header">
                        <MessagesHeader user={props.selectedUser} />
                    </div>
                    <div className="messages-content">
                        <div className="messages-content-container">
                            <Grid container spacing={0}>
                                {messagesByRoom.map((message, index) => (
                                        <Grid item xs={12} key={index}>
                                            <MessagesContent message={message} />
                                        </Grid>
                                ))}
                                <div 
                                    style={{ float:"left", clear: "both" }}
                                    ref={(el) => { setMessagesEnd(el); }}>
                                </div>
                            </Grid>
                        </div>
                    </div>
                    <MessagesInput onMessageSent={(message) => { onHandleMessageSent(message) }} />
                </div>
                : <NoSelectedRoom />
            }
        </div>
    )
}

export default MessagesManagement;