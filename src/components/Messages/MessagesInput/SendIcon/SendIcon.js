import { IconButton } from '@material-ui/core';
import Send from '@material-ui/icons/Send';
import './SendIcon.css';

const SendIcon  = (props) => {

    const onClick = (value) => {
        !!props.onMessageSent && props.onMessageSent(value);
    }

    return (
        <IconButton 
            className="send-icon" 
            onClick={(event) => { onClick(event.target.value)}}>
            <Send />
        </IconButton>
    )
}

export default SendIcon;