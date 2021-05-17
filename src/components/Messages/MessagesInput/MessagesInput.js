import { TextField } from "@material-ui/core";
import './MessagesInput.css';
import { useState } from 'react';
import SendIcon from "./SendIcon/SendIcon";

const MessagesInput  = (props) => {

    const [message, setMessage] = useState("");

    const onKeyDown = (event) => {
        if (event.key === 'Enter') {
            !!props.onMessageSent && props.onMessageSent(message);
            setMessage("");
        }
    }

    const onIconClick = () => {
        props.onMessageSent(message);
        setMessage("");
    }

    const handleChange = (event) => {
        setMessage(event.target.value);
    }

    return (
        <div className="message-input-container">
            <TextField 
                className="message-input" 
                variant="outlined" 
                value={message}
                onChange={(event) => handleChange(event)}
                size="small" 
                placeholder="Enter a message..."
                onKeyDown={(event) => { onKeyDown(event) }} />
            <SendIcon onMessageSent={() => onIconClick()} />
        </div>
    )
}

export default MessagesInput;