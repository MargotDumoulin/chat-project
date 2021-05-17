import { List, ListItem } from "@material-ui/core";
import Profile from '../Profile/Profile';
import './UserList.css';
import { useContext } from 'react';
import PubnubContext from '../../ChatManagement/PubnubContext';
    
const UserList = (props) => {
    
    const pubnub = useContext(PubnubContext);

    const getNotificationsByUser = (user) => {
        const roomIdPartOne = user.id < pubnub.getUUID() ? user.id : pubnub.getUUID();
        const roomIdPartTwo = user.id > pubnub.getUUID() ? user.id : pubnub.getUUID();

        const notifications =  props.notifications?.filter((notification) => notification.room === `room_${roomIdPartOne}_${roomIdPartTwo}`);
        return notifications.length;
    }

    return (
        <div className="user-list">
            <List>
            {props.users.map((user) => (
                <ListItem button onClick={() => props.onClick(user)} key={user.id}>
                    <Profile firstname={user.firstname} lastname={user.lastname} picture={user.picture} />
                    <p className={getNotificationsByUser(user) > 0 ? 'notifications-number' : ''}>
                        { getNotificationsByUser(user) > 0 ? getNotificationsByUser(user)  : '' }
                    </p>
                </ListItem>
            ))}
            </List>
        </div>
    )
}

export default UserList;