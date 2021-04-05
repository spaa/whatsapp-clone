import HeadDetails from '../components/HeadDetails'
import Sidebar from '../components/Sidebar'
import ChatConversation from '../components/ChatConversationPanel'
import styled from 'styled-components'
import {useMediaQuery } from 'react-responsive';
import MediaQuery from 'react-responsive'
import {useState} from 'react'

export default function Home() {
  const [chatID, setChatID] = useState('');
  const [recepientData , setRecepientData] = useState('');
  const [mobileViewToggle , setMobileViewToggle] = useState(false);

  const getChatId = (chatID , recepientData )=>{
    //console.log("chat with user "+chatID);
    setChatID(chatID);
    setRecepientData(recepientData);
    //setOneTwoOnechatInfo(chatInfo);
  }

  const updateRecepientData = (recepientData) =>{
    setRecepientData(recepientData);
  }

  const toggleMobileViewContent = (e)=>{
    console.log("toggleMobileViewContent called")
    setMobileViewToggle(!mobileViewToggle);
  }

  const toggleAnNullifyChat = ()=>{
    setMobileViewToggle(!mobileViewToggle);
    setChatID(null);
  }

  return (
    <>
      <HeadDetails/>
      <MediaQuery minWidth={450}>
      <Container style={{display:"flex"}}>
        <SideBarColumn chatID={chatID} seeChat={getChatId}/>
        <ChatConversationColumn chatID={chatID} recepientData={recepientData} updateRecepientData={updateRecepientData} />
        </Container>
      </MediaQuery>
      <MediaQuery maxWidth={450}>
      <Container >
        <SideBarDiv style={{display:mobileViewToggle ? "none" : "block"}} onClick={toggleMobileViewContent}>
        <SideBarColumn chatID={chatID} seeChat={getChatId}/>
        </SideBarDiv>
        <ChatPanelDiv style={{display:mobileViewToggle? "block" : "none"}} >
        <ChatConversationColumn chatID={chatID} recepientData={recepientData} updateRecepientData={updateRecepientData} toggleMobileViewContent={toggleAnNullifyChat} />
        </ChatPanelDiv>
        </Container>
      </MediaQuery>
    </>
  )
}

const Container = styled.div`
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

const SideBarDiv = styled.div``;

const ChatPanelDiv = styled.div``;