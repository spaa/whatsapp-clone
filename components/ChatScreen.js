import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import { auth, db ,storage } from "../firebase";
import { useEffect, useRef, useState } from "react";
//import Picker from 'emoji-picker-react'
import "emoji-mart/css/emoji-mart.css";
import { Picker, Emoji } from "emoji-mart";

import { Avatar, IconButton } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SendIcon from "@material-ui/icons/Send";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import Message from "./Message";
import 'w3-css/w3.css'
import { useSwipeable } from "react-swipeable";
import { v4 as uuidv4 } from "uuid";

import ChatConversationHeader from "./ChatConversationHeader";
//TODO Emoji Picker is not picking correct emojis
const ChatScreen = ({
  chatID,
  recepientData,
  updateRecepientData,
  toggleMobileViewContent,
}) => {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const [chaosenEmoji, setChosenEmoji] = useState(null);
  const [displayPicker, setDisplayPicker] = useState("none");

  const endOfMessageRef = useRef(null);
  const inputContainerRef = useRef(null);
  const hiddenImageFileInput = useRef(null);
  const hiddenAttachmentFileInput = useRef(null);

  const [messageSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(chatID)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  //console.log("User Online: ",recepientData)

  useEffect(() => {
    scrollToBottom();
  }, [messageSnapshot]);


  const saveMessageinDB = (message, messageType)=>{
    db.collection("chats")
      .doc(chatID)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: message,
        user: user.email,
        photoURL: user.photoURL,
        delivered: false,
        messageSeen: false,
        messageType: messageType,
      })
      .then(() => {
        db.collection("chats")
          .doc(chatID)
          .update({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            setInput("");
            scrollToBottom();
          })
          .catch((error) => {
            alert("Error While updating chat timestamp", error.message);
          });
      })
      .catch((error) => {
        alert("Error While creating chat message", error.message);
      });
  }

  const uplaoadFilesToDB = (uploadTask , fileType)=>{
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', 
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //console.log('Upload is ' + progress + '% done');
      //alert("Upload is "+progress+"% done");
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          //console.log('Upload is paused');
          //alert("Upload is paused")
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          //console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      // Handle unsuccessful uploads
      alert("Error Occured: ",error)
    }, 
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        //console.log('File available at', downloadURL);
        alert("File Uploaded Successfully");
        saveMessageinDB(downloadURL, fileType)
      });
    }
    );
  }

  const handler = useSwipeable({
    onSwipedLeft: (SwipeEventData) => {
      //console.log("Swpied Left from position: ",SwipeEventData.deltaX)
      if (SwipeEventData.initial[0] >= 300 && SwipeEventData.deltaX <= -100)
        toggleMobileViewContent();
    },
    onSwipedRight: (SwipeEventData) => {
      //console.log("Swpied Rght from position: ",SwipeEventData.initial)
      if (SwipeEventData.initial[0] <= 20 && SwipeEventData.deltaX >= 50)
        toggleMobileViewContent();
    },
  });

  const showMessage = () => {
    if (messageSnapshot) {
      let date = messageSnapshot?.docs?.[0]?.data().timestamp?.toDate();
      return messageSnapshot.docs.map((message) => (
        <>
          <Message
            key={message.id}
            user={message.data().user}
            id = {message.id}
            chatID={chatID}
            delivered={message.data().delivered}
            read={message.data().messageSeen}
            message={{
              ...message.data(),
              timestamp: message.data().timestamp?.toDate(),
            }}
            recepientData={recepientData}
          />
        </>
      ));
    }
  };

  const handleImageButtonClick = (e)=>{
    hiddenImageFileInput.current.click();
  }

  const handleAttachmentButtonClick = (e)=>{
    hiddenAttachmentFileInput.current.click();
  }

  const handleFileChange = (e)=>{
    //console.log("Image file:",e.target.files[0]);
    if(e.target.files[0] && e.target.files[0].size <= (1024*1024*3)){
      const fileExtension = e.target.files[0].name.split('.').pop();
      const fileName = "IMG"+uuidv4().replace(/\-/g, "")+new Date().getTime()+"."+fileExtension;
      const uploadTask = storage.ref(`images/${fileName}`).put(e.target.files[0], e.target.files[0].type);
      uplaoadFilesToDB(uploadTask , "image")
    }
  }

  const handleAttachmentFileChange = (e)=>{
    //console.log("Image file:",e.target.files[0]);
    if(e.target.files[0] && e.target.files[0].size <= (1024*1024*3)){
      const fileExtension = e.target.files[0].name.split('.').pop();
      const fileName = "DOC"+uuidv4().replace(/\-/g, "")+new Date().getTime()+"."+fileExtension;
      const uploadTask = storage.ref(`docs/${fileName}`).put(e.target.files[0], e.target.files[0].type);
      uplaoadFilesToDB(uploadTask , "doc")
    }
  }

  const scrollToBottom = () => {
    //console.log("scrollToBottom called", endOfMessageRef.current)
    endOfMessageRef.current.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    
    saveMessageinDB(input,"text")
    //console.log("Message send ",input)
  };

  const setTypingFalse = (e) => {
    e.preventDefault();
    //setInput(e.target.value);
    //console.log("setTypingFalse called")
    db.collection("chats")
      .doc(chatID)
      .update({
        typing: firebase.firestore.FieldValue.arrayRemove(user?.email),
      });
  };

  const setTypingTrue = (e) => {
    //console.log("setTypingTrue called")
    db.collection("chats")
      .doc(chatID)
      .update({
        typing: firebase.firestore.FieldValue.arrayUnion(user?.email),
      });
  };

  const toggleShowPicker = () => {
    // inputContainerRef.current.scrollIntoView({
    //   block: "start",
    //   behavior: "smooth" ,
    // })
    if (displayPicker === "none") setDisplayPicker("block");
    if (displayPicker === "block") setDisplayPicker("none");
  };

  const addEmoji = (e) => {
    let emoji = e.native;
    if (emoji == null) {
      let sym = e.unified.split("-");
      let codesArray = [];
      sym.forEach((el) => codesArray.push("0x" + el));
      emoji = String.fromCodePoint(...codesArray);
    }
    setChosenEmoji(emoji);
    setInput(input + chaosenEmoji);
  };

  return (
    <Container>
      <Header>
          <Avatar src={recepientData?.photoURL} />
        <ChatConversationHeader
          key = {chatID}
          chatID={chatID}
          recepientData={recepientData}
          updateRecepientData={updateRecepientData}
        />

        <HeaderIcons>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer {...handler} style={{ trackMouse: true }}>
        {showMessage()}
        <EndOfMessage className="EOD" ref={endOfMessageRef} />
      </MessageContainer>

      <InputContainer ref={inputContainerRef}>

        <IconButton onClick={toggleShowPicker}>
          <InsertEmoticonIcon />
        </IconButton>
        <>
        <Input
          value={input}
          onFocus={setTypingTrue}
          onBlur={setTypingFalse}
          onChange={(e) => setInput(e.target.value)}
        />
        <button disabled={!input} className="w3-circle" type="submit" onClick={sendMessage} style={{border: "none", cursor: input ? "pointer": ""}} >
          <SendIcon style={{color:input ? "#34B7F1" : "grey"}}/>
        </button>
          </>
        <>
        <IconButton onClick={handleImageButtonClick}>
        <PhotoLibraryIcon />
        <input type="file" style={{display:"none"}} ref={hiddenImageFileInput} onInput={handleFileChange} multiple={false} accept="image/*" />
        </IconButton>
        </>
        <>
        <IconButton onClick={handleAttachmentButtonClick}>
        <AttachFileIcon />
        <input type="file" style={{display:"none"}} ref={hiddenAttachmentFileInput} onInput={handleAttachmentFileChange} multiple={false} accept=".pdf,.doc" />
        </IconButton>
        </>
        <>
        <ImagePickerContainer style={{ display: displayPicker }}>
          <ImagePicker set="apple" onSelect={addEmoji} />
        </ImagePickerContainer>
        </>
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
  margin-bottom: 20px;
`;
const MessageContainer = styled.div`
  padding: 10px;
  background-image: url("/background.png");
  height: 85vh;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 3px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: grey;
  }
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0px;
  background-color: #e9eaeb;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 45px;
  align-items: center;
  padding: 10px;
  position: relative;
  bottom: 0px;
  background-color: white;
  margin-left: 5px;
  margin-right: 5px;
`;

const ImagePickerContainer = styled.div`
  width: 355px;
  position: absolute;
  bottom: 70px;
  left: 0px;
  background-image: url("/background.png");
`;

const ImagePicker = styled(Picker)`
  width: 100%;
`;
