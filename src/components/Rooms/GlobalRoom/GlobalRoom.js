import './GlobalRoom.css';
import { List, ListItem } from "@material-ui/core";
import { useEffect, useState } from 'react';

const GlobalRoom  = (props) => {

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        setNotifications(props.notifications?.filter((notification) => notification.room === "general"));
    }, [props.notifications]);

    return (
        <div className="global-room">
            <List>
                <ListItem button onClick={() => { props.onClick() }}>
                    <p># Chat global</p>
                    <p className={notifications.length > 0 ? 'notifications-number' : ''}>
                    { notifications.length > 0 ? notifications.length : '' }
                    </p>
                </ListItem>
            </List>
        </div>
    )
}

export default GlobalRoom;