import styled from 'styled-components';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import { useEffect, useRef, useState } from "react";
import ChatHeaderTypingChangeTracker from './ChatHeaderTypingChangeTracker';

const ChatConversationHeader = ({recepientData , chatID , updateRecepientData }) => {
    const [user] = useAuthState(auth);

    const [recepientSnapShot] = useCollection(db.collection("user").where("email","==",recepientData?.email))
    const recipientInfo = recepientSnapShot?.docs?.[0]?.data();
    //console.log(recepientInfo)


    const [messageSnapshot] = useCollection(
        db
          .collection("chats")
          .doc(chatID)
          .collection("messages")
          .orderBy("timestamp", "asc")
      );
    console.log("Message snapshot: ", messageSnapshot)

    useEffect(() => {
        //console.log("UseEffect Called")
        const filteredMessage = messageSnapshot?.docs?.filter(message=> message.data().user === recepientData?.email && message.data().messageSeen === false);
        //console.log("UseEffect Called Filtered Message",filteredMessage);
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

    return (  
        <ChatHeaderTypingChangeTracker recipientInfo={recipientInfo} chatID={chatID} />
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
    font-size: 12px;
    color: grey;
    font-family : Arial;
  }
`;