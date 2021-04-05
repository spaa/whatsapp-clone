import { Avatar, Button, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ChatIcon from "@material-ui/icons/Chat";
import styled from "styled-components";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import RefreshIcon from '@material-ui/icons/Refresh';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import firebase from "firebase";

import MediaQuery from "react-responsive";

import SearchBar from "./SearchBar";
import Chat from "./Chat";
import * as EmailValidator from "email-validator";
import { useEffect, useState } from "react";

const Sidebar = ({ seeChat }) => {
  const [user] = useAuthState(auth);
  const [showChatList,setShowChatList] = useState(true);

  if(user){
  var userCharRef = db
    .collection("chats")
    .where("users", "array-contains", user.email)
    .orderBy("timestamp","desc");
  var usersAccountRef = db.collection("user");
  var [chatSnapshot] = useCollection(userCharRef);
  var [userAccountSnapshot] = useCollection(usersAccountRef);
    
  }

  const toggleSearchBarView = (value)=>{
    setShowChatList(value);
  }

  const createChat = () => {
    const input = prompt(
      "Please enter email of  person with whom you need to start chat"
    );
    if (!input) return null;

    const data = chatAlreadyExists(input);
    if (!data.userExists) {
      alert("Entered Email id is not registered");
      return "";
    }
    if (data.chatExists) {
      alert("Chat with user already exists");
      return "";
    }
    console.log("Creating chat");
    if (EmailValidator.validate(input) && input != user.email) {
      //Need to add chat into DB 'chats' collection
      db.collection("chats").add({
        users: [user.email, input],
        typing: [],
        timestamp : new Date(),
      });
    }
  };

  const chatAlreadyExists = (recepientEmail) => {
    const chatExists = !!chatSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recepientEmail)?.length > 0
    );
    const userExists = !!userAccountSnapshot?.docs.find(
      (user) => user.data().email === recepientEmail
    );
    return { chatExists, userExists };
  };
  const onLogout = () => {
    //Update the last Sceen
    db.collection("user")
      .doc(user.uid)
      .set(
        {
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          online: false,
        },
        { merge: true }
      )
      .then(() => {
        auth.signOut();
      })
      .catch((error) => alert("Problem while logging out :" + error.message));
  };

  const mobileViewContainerStyle = {
    width: "100%",
    maxWidth: "100%",
    minWidth : "200px"
  };

  return (
    <>
      <MediaQuery minWidth={450}>
        <OuterContainer>
          <Container>
            <Sticky>
              <Header>
                <UserAvatar src={user?.photoURL} />
                <IconContainer>
                  <IconButton>
                    <ExitToAppIcon onClick={onLogout}  />
                  </IconButton>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </IconContainer>
              </Header>
              <SearchButton toggleSearchBarView={toggleSearchBarView} showChatList={showChatList} chatSnapshot={chatSnapshot} seeChat={seeChat} />
              <SideBarButton style={{display: showChatList ? "block" : "none"}} onClick={createChat}>Start New Chat</SideBarButton>
            </Sticky>
            {/* List of Chats */}
            <ChatList style={{display: showChatList ? "block" : "none"}}>
              {chatSnapshot?.docs.map((chat) => (
                <Chat
                  key={chat.id}
                  id={chat.id}
                  users={chat.data().users}
                  seeChat={seeChat}
                />
              ))}
            </ChatList>
          </Container>
        </OuterContainer>
      </MediaQuery>

      <MediaQuery maxWidth={450}>
        <OuterContainer style={mobileViewContainerStyle}>
          <Container >
            <Sticky>
              <Header>
                <UserAvatar src={user?.photoURL} />
                <IconContainer>
                  <IconButton>
                    <ExitToAppIcon onClick={onLogout}  />
                  </IconButton>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </IconContainer>
              </Header>
              <SearchButton toggleSearchBarView={toggleSearchBarView} showChatList={showChatList} chatSnapshot={chatSnapshot} seeChat={seeChat} />
              <SideBarButton style={{display: showChatList ? "block" : "none"}} onClick={createChat}>Start New Chat</SideBarButton>
            </Sticky>
            {/* List of Chats */}
            <ChatList style={{display: showChatList ? "block" : "none"}}>
              {chatSnapshot?.docs.map((chat) => (
                <Chat
                  key={chat.id}
                  id={chat.id}
                  users={chat.data().users}
                  seeChat={seeChat}
                />
              ))}
            </ChatList>
          </Container>
        </OuterContainer>
      </MediaQuery>
    </>
  );
};

export default Sidebar;

const OuterContainer = styled.div`
  border-right: 1px solid whitesmoke;
  height: 100vh;
  width: 100%;
  min-width: 30%;
  max-width: 400px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Container = styled.div`
  flex: 0.5;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Sticky = styled.div`
  background: white;
  position: sticky;
  top: 0px;
  z-index: 100;
`;

const IconContainer = styled.div``;

const Header = styled.div`
  display: flex;
  background-color: #e9eaeb;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const SearchButton = styled(SearchBar)``;

const SideBarButton = styled(Button)`
  width: 100%;
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;

const ChatList = styled.div`
  height: 80%;
  overflow-y: scroll;
  overflow-x: hidden;
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
