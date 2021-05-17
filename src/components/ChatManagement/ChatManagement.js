import MessagesManagement  from '../Messages/MessagesManagement/MessagesManagement';
import RoomsManagement from '../Rooms/RoomsManagement/RoomsManagement'
import './ChatManagement.css';
import { useState, useEffect } from 'react';
import { generateUUID } from "pubnub";
import ProfileDialog from '../ProfileDialog/ProfileDialog'
import PubNub from "pubnub";
import { PubnubProvider } from './PubnubContext';
import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';

const ChatManagement = () => {

    const [pubnub] = useState(new PubNub({ 
        publishKey: "xxx",
        subscribeKey : "xxx",
        uuid: "xxx",
        state: {
            "name": "xxx",
            "picture": "xxx"
        }}));
    const [isConnected, setIsConnected] = useState(false);

    const [open, setOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState({});
    const [selectedRoom, setSelectedRoom] = useState(false); 
    const [notifications, setNotifications] = useState([]);

    const [newMessage, setNewMessage] = useState({});
    const [newPresenceEvent, setNewPresenceEvent] = useState({});
    const [usersPresent, setUsersPresent] = useState([]);
 
    useEffect(() => {
        const unsubscribeToGeneral = (e) => {
            e.preventDefault();
            console.log(JSON.stringify(e));
            pubnub.unsubscribeAll();
            setIsConnected(false);
        }
            
        window.addEventListener('beforeunload', (e) => unsubscribeToGeneral(e)); 

        const storedName = localStorage.getItem("name");
        const storedPicture = localStorage.getItem("picture");
        const storedUUID = localStorage.getItem("uuid");

        const uuid = storedUUID ? storedUUID : generateUUID();

        pubnub.setUUID(uuid);

        pubnub.addListener({
            message: function(msg) {
                setNewMessage(msg);
            },
            presence: function(presenceEvent) {
                setNewPresenceEvent(presenceEvent);
            }
        });

        if (!storedName || !storedPicture || !storedUUID) { 
            setOpen(true);
        } else {
            subscribeToGeneral();
        }

        return () => {
            window.removeEventListener('beforeunload', (e) => unsubscribeToGeneral(e));
        }
    }, []);

    const sendMessageNotification = (msg) => {
        toast.dark('\u2728 Vous avez reçu un message !');
        const notification = { room: msg.room };
        notifications.push(notification);

        setNotifications([ ...notifications ]);
    }

    const sendUpdateNotification = (oldUser, newUser) => {
        if (oldUser.firstname !== newUser.firstname) {
            toast.info(`\uD83D\uDC84 ${oldUser.firstname} a changé son nom en ${newUser.firstname} !`);
        } else if (oldUser.picture !== newUser.picture) {
            toast.info(`\uD83D\uDC84 ${oldUser.firstname} a changé sa photo de profil !`);
        }

        if (selectedUser === oldUser) {
            setSelectedUser(newUser);
        }
    }
    
    const openDialog = () => {
        setOpen(true);
    } 

    const onHandleProfileConfirmed = (name, picture) => {
        localStorage.setItem('name', name);
        localStorage.setItem('picture', picture)
        localStorage.setItem('uuid', pubnub.getUUID());
        
        if (!isConnected) {
            subscribeToGeneral();
        } else {
            updatePubnubState(name, picture);
        }
    
        setOpen(false);
    };

    const updatePubnubState = (
        name = localStorage.getItem('name'), 
        picture = localStorage.getItem('picture')
    ) => 
    {
        pubnub.setState({
            state: {
                "name": name,
                "picture": picture
            },
            channels: ["general"]
        },
        function (status, response) {
            console.group('SET-STATE');
            console.log(response);
            console.groupEnd();
        });
    }

    
    const subscribeToGeneral = () => {
        console.group('IN-SUBSCRIBE-TO-GENERAL-FUNCTION');
        console.groupEnd();
        
        pubnub.subscribe({
            channels: ["general"],
            includeState: true,
            withPresence: true
        }, function(status, response) {
            console.group('SUBSCRIBE-TO-GENERAL');
            console.log(status);
            console.log(response);
            console.groupEnd();
        });
        
        setIsConnected(true);

        pubnub.hereNow({
            channels: ["general"],
            includeState: true
        }, function(status, response) {
            console.group("USERS-PRESENT-FOR-REAL");
            console.log(response);
            console.groupEnd();
            
            setUsersPresent(response?.channels.general.occupants);
        });
    }

    const onHandleClickRoom = (room, user) => {
        const filteredNotifications = notifications.filter((notification) => notification.room !== room);

        setNotifications([ ...filteredNotifications ]);
        setSelectedRoom(room);
        setSelectedUser(user);
    }

    return (
        <PubnubProvider value={pubnub}>
            <div className="global-chat">
                <RoomsManagement 
                    onClickRoom={(room, user) => onHandleClickRoom(room, user)}
                    notifications={notifications}
                    newPresenceEvent={newPresenceEvent}
                    usersAlreadyPresent={usersPresent}
                    onDetectOwnJoin={() => updatePubnubState()}
                    openDialog={() => { openDialog() }}
                    onHandleUserUpdated={(oldUser, newUser) => { sendUpdateNotification(oldUser, newUser) }}
                />
                <MessagesManagement 
                    selectedUser={selectedUser} 
                    selectedRoom={selectedRoom}
                    newMessage={newMessage}
                    onHandleMessageReceived={(msg) => { sendMessageNotification(msg) }} 
                />
            </div>
            <ToastContainer 
                position="top-right" 
            />
            <ProfileDialog 
                open={open} 
                name={localStorage.getItem('name')}
                picture={localStorage.getItem('picture')}
                onProfileConfirmed={(name, picture) => { onHandleProfileConfirmed(name, picture) }} 
            />
        </PubnubProvider>
        
    )
}

export default ChatManagement;