import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from 'firebase';
import { auth, db } from "../firebase";
import { useEffect, useRef, useState } from "react";
//import Picker from 'emoji-picker-react'
import 'emoji-mart/css/emoji-mart.css'
import {Picker , Emoji } from 'emoji-mart'

import { Avatar, IconButton } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MicIcon from '@material-ui/icons/Mic';
import SendIcon from '@material-ui/icons/Send';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import ChatIcon from "@material-ui/icons/Chat";
import Message from "./Message";

import {useSwipeable} from 'react-swipeable'

import ChatConversationHeader from './ChatConversationHeader';

const ChatScreen = ({ chatID, recepientData, updateRecepientData, toggleMobileViewContent}) => {
  const [user] = useAuthState(auth);
  const [input,setInput] = useState('');
  const [chaosenEmoji , setChosenEmoji] = useState(null);
  const [displayPicker , setDisplayPicker] = useState("none");
  
  const [messageSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(chatID)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  console.log("User Online: ",recepientData)

  const handler = useSwipeable({
    onSwipedLeft : (SwipeEventData)=> {
      console.log("Swpied Left from position: ",SwipeEventData.deltaX)
      if(SwipeEventData.initial[0] >=300 && SwipeEventData.deltaX <=-100)
        toggleMobileViewContent()
    },
    onSwipedRight : (SwipeEventData)=> {
      console.log("Swpied Rght from position: ",SwipeEventData.initial)
      if(SwipeEventData.initial[0] <=20 && SwipeEventData.deltaX >=50)
        toggleMobileViewContent()
    }
  });

  useEffect(() => {
    scrollToBottom();
  }, [messageSnapshot])

  const endOfMessageRef = useRef(null);


  const showMessage = () => {
    if(messageSnapshot){
        let date = messageSnapshot?.docs?.[0]?.data().timestamp?.toDate();
        return messageSnapshot.docs.map(message=> (
          <> 
            <Message 
                key = {message.id}
                user = {message.data().user}
                chatID = {chatID}
                delivered = {message.data().delivered}
                read = {message.data().messageSeen}
                message={{
                    ...message.data(),
                    timestamp : message.data().timestamp?.toDate()
                }}
                recepientData={recepientData}
            />
          </>
        ))
    }
  };

  const scrollToBottom = ()=>{
    //console.log("scrollToBottom called", endOfMessageRef.current)
    endOfMessageRef.current.scrollIntoView({
      block: "start", 
      behavior: "smooth" ,
    })
  }

  const sendMessage = (e)=>{
      e.preventDefault();

      db.collection('chats').doc(chatID).collection('messages').add({
          timestamp : firebase.firestore.FieldValue.serverTimestamp(),
          message : input,
          user: user.email,
          photoURL : user.photoURL,
          delivered : false,
          messageSeen : false,
      }).then(()=>{
        db.collection('chats').doc(chatID).update({
          timestamp : firebase.firestore.FieldValue.serverTimestamp()
        }).then(()=>{
          setInput("");
          scrollToBottom();
        }).catch((error)=>{alert("Error While updating chat timestamp",error.message)})
      }).catch((error)=>{alert("Error While creating chat message",error.message)})
      //console.log("Message send ",input)
      
  }

  const setTypingFalse = (e) => {
      e.preventDefault();
      //setInput(e.target.value);
      //console.log("setTypingFalse called")
      db.collection("chats").doc(chatID).update({
        typing : firebase.firestore.FieldValue.arrayRemove(user?.email)
      })
  }

  const setTypingTrue = (e) => {
    //console.log("setTypingTrue called")
    db.collection("chats").doc(chatID).update({
      typing : firebase.firestore.FieldValue.arrayUnion(user?.email)
    })
  }

  const toggleShowPicker = ()=>{
      if(displayPicker==="none") setDisplayPicker("block");
      if(displayPicker === "block") setDisplayPicker("none");
  }

  const addEmoji = (e)=>{
    let emoji = e.native;
    if(emoji == null){
        let sym = e.unified.split('-')
        let codesArray = []
        sym.forEach(el => codesArray.push('0x' + el))
        let emoji = String.fromCodePoint(...codesArray)
    }
      setChosenEmoji(emoji);
      setInput(input + chaosenEmoji);
  }

  return (
    <Container>
      <Header>
        {recepientData 
                ? (<Avatar src={recepientData?.photoURL}/>)
                : (<Avatar> S</Avatar>)
            }
        <ChatConversationHeader chatID={chatID} recepientData={recepientData} updateRecepientData={updateRecepientData} />
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      
      <MessageContainer {...handler} style={{trackMouse: true}}>
        {showMessage()}
        <EndOfMessage className="EOD" ref={endOfMessageRef} />
      </MessageContainer>
      <ImagePickerContainer style={{display: displayPicker}}>
        <ImagePicker  set="apple" onSelect={addEmoji}/>
      </ImagePickerContainer>
      <InputContainer>
        <InsertEmoticonIcon onClick={toggleShowPicker}/>
        {/* <Emoji emoji={{ id: 'smile'}} size={16} onSelect={addEmoji} /> */}
        <Input value={input} onFocus={setTypingTrue} onBlur={setTypingFalse} onChange={e=> setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage} >Send Message</button>
        <MicIcon/>
      </InputContainer>
    </Container>
  );
};

export default ChatScreen;

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  position: sticky;
  background-color: #e9eaeb;
  z-index: 100;
  top: 0px;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
`;

const HeaderIcons = styled.div``;

const EndOfMessage = styled.div`
  margin-bottom : 20px;
`;
const MessageContainer = styled.div`
    padding : 10px;
    background-image : url('/background.png');
    height : 85vh;
    overflow-y :scroll;
    ::-webkit-scrollbar {
        width : 3px;
    }
    ::-webkit-scrollbar-track{
        background : #f1f1f1;
    }
    ::-webkit-scrollbar-thumb{
        background: grey;
    }
`;

const InputContainer = styled.form`
    display :flex;
    align-items: center;
    padding : 10px;
    position : sticky;
    bottom : 0px;
    background-color :#e9eaeb;
    z-index: 100;

`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border : none;
    border-radius : 45px;
    align-items: center;
    padding : 10px;
    position : sticky;
    bottom : 0px;
    background-color : white;
    margin-left : 5px;
    margin-right : 5px;
`;

const ImagePickerContainer = styled.div`
width :100%;
`;

const ImagePicker = styled(Picker)`
    width: 100%;
`;