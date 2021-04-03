import HeadDetails from '../components/HeadDetails'
import Sidebar from '../components/Sidebar'
import ChatConversation from '../components/ChatConversationPanel'
import styled from 'styled-components'
import {useState} from 'react'

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from 'firebase';
import { auth, db } from "../firebase";

export default function Home() {
  const [chatID, setChatID] = useState('');
  const [recepientData , setRecepientData] = useState('');

  const getChatId = (chatID , recepientData )=>{
    console.log("chat with user "+chatID);
    setChatID(chatID);
    setRecepientData(recepientData);
    //setOneTwoOnechatInfo(chatInfo);
  }

  const onContainerHover = ()=>{
    let recepientD;
    const readRecepientData = async()=> {
      console.log("readRecepientData async Function Called for email: ",recepientData.email)
      const recepientSnapshot = await db.collection('user').where("email","==",recepientData.email).get();
      setRecepientData(recepientSnapshot?.docs?.[0]?.data());

    }
    readRecepientData();
    //console.log("Hover Container");
    console.log("On Hover Recepient Updated Data" , recepientData );
  }

  return (
    <Container>
      <HeadDetails/>

      <SideBarColumn onHover={onContainerHover} chatID={chatID} seeChat={getChatId}/>
      <ChatConversationColumn onHover={onContainerHover} chatID={chatID} recepientData={recepientData} />
    </Container>
  )
}

const Container = styled.div`
    display: flex;
    overflow-y: scroll;
    overflow-x :hidden;
    ::-webkit-scrollbar {
        display:none;
    }

  `;

const SideBarColumn = styled(Sidebar)`
`;

const ChatConversationColumn = styled(ChatConversation)`
`;
