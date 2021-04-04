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
    //console.log("chat with user "+chatID);
    setChatID(chatID);
    setRecepientData(recepientData);
    //setOneTwoOnechatInfo(chatInfo);
  }

  const updateRecepientData = (recepientData) =>{
    setRecepientData(recepientData);
  }

  return (
    <Container>
      <HeadDetails/>

      <SideBarColumn chatID={chatID} seeChat={getChatId}/>
      <ChatConversationColumn chatID={chatID} recepientData={recepientData} updateRecepientData={updateRecepientData} />
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
