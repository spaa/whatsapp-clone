import styled from 'styled-components';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from 'firebase';
import { auth, db } from "../firebase";
import { useEffect, useRef, useState } from "react";


import getRecepientEmail from "../utils/getRecepientEmail";

import Timeago from 'timeago-react'


const ChatConversationHeader = ({recepientData , chatID , updateRecepientData }) => {
    const [user] = useAuthState(auth);

    const [chatInfoSnapShot] = useCollection(db.collection('chats'));
    const chatInfo = chatInfoSnapShot?.docs?.filter(doc=> doc.id === chatID)?.[0]?.data();
    //console.log("chat Info",chatInfo);

    const [recepientSnapShot] = useCollection(db.collection("user").where("email","==",recepientData?.email))
    const recipientInfo = recepientSnapShot?.docs?.[0]?.data();
    //console.log(recepientInfo)

    // if(recipientInfo){
    //     if(recepientData?.online != recipientInfo?.online ) {
    //         console.log("Recepient Info Updated");
    //         updateRecepientData(recipientInfo);
    //     }
    // }
    //console.log("Recepient Info: ", recipientInfo);

    //const recipientName = getRecepientEmail(userChat.users, user);

    const [messageSnapshot] = useCollection(
        db
          .collection("chats")
          .doc(chatID)
          .collection("messages")
          .orderBy("timestamp", "asc")
      );

    useEffect(() => {
        console.log("UseEffect Called")
        const filteredMessage = messageSnapshot?.docs?.filter(message=> message.data().user === recepientData?.email && message.data().messageSeen === false);
        console.log("UseEffect Called Filtered Message",filteredMessage);
        filteredMessage?.map(message=> (
            db.collection('chats').doc(chatID).collection('messages').doc(message.id).update({
                messageSeen : true
            }).catch((error=>alert("Not able to Update Data...try again: Error Message"+error.message)))
        ))
    }, [messageSnapshot])

    if(recipientInfo?.online){
        const messageFilter = messageSnapshot?.docs?.filter(message=> message?.data()?.user === user.email && message?.data()?.delivered ===false)
        //console.log(" message Filter Called: ", messageFilter)
        messageFilter?.map(message=> (
            
            db.collection('chats').doc(chatID).collection('messages').doc(message.id).update({
                delivered : true
            })
        ))

    }

    const lastActive = ()=> {
        return (
            <>
              Last Active :{recipientInfo?.lastSeen ? <Timeago datetime={recipientInfo?.lastSeen?.toDate()}/> : "Unavailable"} 
            </>
        );
    }
    
    return (  
        <Container>
            <h5>{recipientInfo?.email }</h5>
            <p>{chatInfo?.typing ? (chatInfo?.typing?.includes(recepientData?.email) ? "Typing...." : recipientInfo?.online ?  "Online" : lastActive()) : recipientInfo?.online ?  "Online" : lastActive()}</p>
        </Container>
    );
}
 
export default ChatConversationHeader;

const Container = styled.div`
    margin-left: 15px;
  flex: 1;
  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: grey;
  }
`;