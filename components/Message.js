import styled from 'styled-components'
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from 'firebase';
import { auth, db } from "../firebase";
import moment from 'moment';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';

const Message = ({user , message, devlivered}) => {
    const [userLoggedIn] = useAuthState(auth);

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver
    return ( 
        <Container>
        <TypeOfMessage>
            {message.message}
            <TimeStamp>{message.timestamp ? moment(message.timestamp).format('LT') : "..."} {TypeOfMessage === Sender ? (devlivered ? <DoubleTickIcon style={{fontSize:15}} color="primary"/> : <SingleTickIcon style={{fontSize:15}} color="primary"/>) : ""} </TimeStamp>
        </TypeOfMessage>
        </Container> 
    );
}
 
export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
    width : fit-content;
    padding : 15px;
    border-radius : 8px;
    margin : 10px;
    min-width : 60px;
    max-width : 80%;
    word-break : break-word;
    padding-bottom : 16px;
    padding-right : 50px;
    position : relative;
    text-align: justify;
    text-justify: inter-word;
`;

const Sender = styled(MessageElement)`
    margin-left : auto;
    background-color : #dcf8c6;
`;

const Receiver = styled(MessageElement)`
    background-color : white;
`;

const TimeStamp = styled.span`
    color : grey;
    padding : 10px;
    font-size : 9px;
    position : absolute;
    bottom : 0;
    right : 8px;
`;

const SingleTickIcon = styled(DoneIcon)`
    position : absolute;
    top : 10px;
    right : 0;
    padding-left : 5px;
`;

const DoubleTickIcon = styled(DoneAllIcon)`
    position : absolute;
    top : 10px;
    right : 0;
    padding-left : 5px;
`;