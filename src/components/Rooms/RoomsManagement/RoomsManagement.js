import UserList from '../UserList/UserList';
import GlobalRoom from '../GlobalRoom/GlobalRoom';
import TitleCategory from '../TitleCategory/TitleCategory';
import { useEffect, useState, useContext } from 'react';
import PubnubContext from '../../ChatManagement/PubnubContext';
import { IconButton } from "@material-ui/core";
import Edit from '@material-ui/icons/Edit';
import Profile from '../Profile/Profile';
import './RoomsManagement.css';

const RoomsManagement = (props) => {

    const pubnub = useContext(PubnubContext);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        console.group('USERS-PRESENT');
        console.log(props.usersAlreadyPresent);
        console.groupEnd();

        props.usersAlreadyPresent?.forEach((user) => {
            console.log(user.uuid);
            console.log(pubnub.getUUID());
            if (user.state && user.state.name && user.state.picture && (user.uuid !== pubnub.getUUID()) && !isAlreadyAdded(user.uuid)) {
                const newUser = {
                    id: user.uuid,
                    firstname: user.state.name,
                    lastname: "",
                    picture: user.state.picture
                }
                users.push(newUser);
                setUsers([ ...users]);
                subscribeToUserRoom(newUser);
            }
        });
    }, [props.usersAlreadyPresent]);

    useEffect(() => {
        console.group('PRESENCE-EVENT');
        console.log(props.newPresenceEvent);
        console.groupEnd();

        updateUserList(props.newPresenceEvent.action, props.newPresenceEvent.uuid, props.newPresenceEvent.state);
    }, [props.newPresenceEvent]);

    const updateUserList = (action, userUUID, state) => {
        if (action === "join" || action === "state-change") {
            console.group('CONDITIONS-TO-CHECK');
            console.log(userUUID !== pubnub.getUUID());
            console.log(!isAlreadyAdded(userUUID));
            console.log('userUUID: ' + userUUID);
            console.log('my UUID: ' + pubnub.getUUID());
            console.groupEnd();

            if (userUUID !== pubnub.getUUID() && !isAlreadyAdded(userUUID) && userUUID && state) {
                const user = {
                    id: userUUID,
                    firstname: state.name,
                    lastname: "",
                    picture: state.picture
                } 
                
                if (user.firstname) {
                    console.log('on push le user :)');
                    users.push(user);
                    setUsers([ ...users]);
                    subscribeToUserRoom(user);
                }
            } else if (isAlreadyAdded(userUUID) && userUUID !== pubnub.getUUID() && userUUID && action === "state-change" && state) {
                console.group('INSIDE-UPDATE-OTHER-USER-STATE-CONDITION');
                console.groupEnd();
        
                const modifiedUser = {
                    id: userUUID,
                    firstname: state.name,
                    lastname: "",
                    picture: state.picture
                } 

                console.log(JSON.stringify(modifiedUser));

                const updatedUsers =  [ ...users ];
                const indexOfUserToUpdate = users.findIndex((user) => user.id === modifiedUser.id)

                if (indexOfUserToUpdate > -1) {
                    const oldUser = updatedUsers[indexOfUserToUpdate];
                    updatedUsers[indexOfUserToUpdate] = modifiedUser;

                    setUsers([ ...updatedUsers ]);
                    props.onHandleUserUpdated(oldUser, modifiedUser);
                }
            } else if (action === "join" && userUUID === pubnub.getUUID()) {
                console.group('DETECT-OWN-JOIN-EVENT');
                console.groupEnd();
                // The user has detected its own join event. It can now update his own state, 
                // and send it to other users to detect. 
                // https://stackoverflow.com/questions/38203083/pubnub-cannot-get-state-object-with-presence-event
                props.onDetectOwnJoin();
            }
        } else if (action === "leave") {
            console.log('un user a leave');
            const userIndex = users.findIndex((user) => user.id === userUUID);
            if (userIndex > -1) {
                users.splice(userIndex, 1);
            }            
            setUsers([ ...users]);
        }
    }

    const subscribeToUserRoom = (user) => {
        const roomIdPartOne = user.id < pubnub.getUUID() ? user.id : pubnub.getUUID();
        const roomIdPartTwo = user.id > pubnub.getUUID() ? user.id : pubnub.getUUID();

        pubnub.subscribe({
            channels: [`room_${roomIdPartOne}_${roomIdPartTwo}`],
            withPresence: true
        });
    }

    const onClickGlobalRoom = () => {
        props.onClickRoom("general", { firstname: "Chat global"});
    } 

    const isAlreadyAdded = (id) => {
        const user = users.find((user) => user.id === id);
        return user === undefined ? false : true;
    }

    const onClickUserList = (user) => {
        const roomIdPartOne = user.id < pubnub.getUUID() ? user.id : pubnub.getUUID();
        const roomIdPartTwo = user.id > pubnub.getUUID() ? user.id : pubnub.getUUID();

        props.onClickRoom(`room_${roomIdPartOne}_${roomIdPartTwo}`, user);
    }

    return (
        <div className="rooms-management">
            <div className="room-list">
            <TitleCategory title={"CHANNELS"} />
            <GlobalRoom 
                onClick={() => { onClickGlobalRoom() }} 
                notifications={props.notifications} 
            />
            <TitleCategory title={"FRIENDS"} />
            <UserList 
                users={users} onClick={(user) => { onClickUserList(user) }} 
                notifications={props.notifications}
            />
            </div>
            <div className="logged-in-profile">
            { 
                localStorage.getItem('uuid') 
                ? 
                <div className="logged-in-profile-settings">
                    <Profile 
                        picture={localStorage.getItem('picture')} 
                        firstname={localStorage.getItem('name')}
                        lastname={""} 
                    />
                    <IconButton>
                        <Edit 
                            onClick={() => { props.openDialog()}}
                            style={{ fontSize: 20 }} 
                        />
                    </IconButton>
                </div>
                : <p>Not logged in.</p>
            }
            </div>
        </div>
        
    )
}

export default RoomsManagement;