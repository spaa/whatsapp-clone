import styled from 'styled-components';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";

import Timeago from 'timeago-react'


const ChatHeaderTypingChangeTracker = ({recipientInfo , chatID , updateRecepientData }) => {
    const [user] = useAuthState(auth);

    const [chatInfoSnapShot] = useCollection(db.collection('chats'));
    const chatInfo = chatInfoSnapShot?.docs?.filter(doc=> doc.id === chatID)?.[0]?.data();
    console.log("chat Info",chatInfo);


    const lastActive = ()=> {
        return (
            <>
              Last Active :{recipientInfo?.lastSeen ? <Timeago datetime={recipientInfo?.lastSeen?.toDate()}/> : "Unavailable"} 
            </>
        );
    }
    
    return (  
        <Container>
            <h6>{recipientInfo?.email }</h6>
            <p>{chatInfo?.typing ? (chatInfo?.typing?.includes(recipientInfo?.email) ? "Typing...." : recipientInfo?.online ?  "Online" : lastActive()) : recipientInfo?.online ?  "Online" : lastActive()}</p>
        </Container>
    );
}
 
export default ChatHeaderTypingChangeTracker;

const Container = styled.div`
    margin-left: 15px;
  flex: 1;
  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 12px;
    color: grey;
    font-family : Arial;
  }
`;