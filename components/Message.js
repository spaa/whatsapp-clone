import styled from 'styled-components'
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from 'firebase';
import { auth, db } from "../firebase";
import moment from 'moment';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';

const Message = ({user , message, delivered , read , chatID}) => {
    const [userLoggedIn] = useAuthState(auth);
    let MessageFormat = "LT";
    if(chatID && message){
        const MessageTimeDifference = new Date().getDate() - new Date(message.timestamp).getDate();
        const MessageYearDifference = new Date().getFullYear() - new Date(message.timestamp).getFullYear();
        //console.log("MessageYearDifference", MessageYearDifference)
        MessageFormat = MessageTimeDifference==0 ? "LT" : (MessageYearDifference==0 ? "h:mm A DD/MM" :"h:mm A DD/MM/YY");
    //console.log("MessageTimeDifference", MessageTimeDifference)
    }
    

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver
    return ( 
        <Container>
        <TypeOfMessage style={{minWidth:MessageFormat==="LT"? "80px" : "130px"}}>
            {message.message}
             
                {TypeOfMessage === Sender 
                    ? <TimeStamp style={{right : "8px"}}>
                        {message.timestamp ? moment(message.timestamp).format(MessageFormat) : "..."}
                        {read
                            ? <DoubleTickIcon style={{fontSize:18, color:"#34B7F1"}} />
                            :delivered 
                                ? <DoubleTickIcon style={{fontSize:18}} color="action" /> 
                                : <SingleTickIcon style={{fontSize:18}} color="action"/>
                        }
                      </TimeStamp> 
                    : <TimeStamp style={{right : "0px"}}>
                        {message.timestamp ? moment(message.timestamp).format(MessageFormat) : "..."}  
                      </TimeStamp>
                } 
            
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
    min-width : 80px;
    max-width : 70%;
    word-break : break-word;
    padding-bottom : 16px;
    padding-right : 50px;
    position : relative;
    text-align: justify;
    text-justify: inter-word;
`;

const TimeStamp = styled.div`
    color : grey;
    padding : 10px;
    font-size : 9px;
    position : absolute;
    bottom : -5px;
    
`;

const Sender = styled(MessageElement)`
    margin-left : auto;
    background-color : #dcf8c6;
    ::before{
        content: '';
        border-left: 20px solid #dcf8c6;
        border-top: 20px solid transparent;
        border-bottom: 20px solid transparent;
        position: absolute;
        top : 0px;
        right:-10px;
    }
`;

const Receiver = styled(MessageElement)`
    background-color : white;
    ::before{
        content: '';
        border-right: 20px solid white;
        border-top: 20px solid transparent;
        border-bottom: 20px solid transparent;
        position: absolute;
        top : 0px;
        left:-10px;
    }
`;

const SingleTickIcon = styled(DoneIcon)`
    position : absolute;
    top : 8px;
    right : -5px;
    padding-left : 5px;
`;

const DoubleTickIcon = styled(DoneAllIcon)`
    position : absolute;
    top : 8px;
    right : -5px;
    padding-left : 5px;
`;