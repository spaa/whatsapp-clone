import styled from 'styled-components'
import SearchIcon from '@material-ui/icons/Search';
import {} from '@material-ui/core';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useState ,useRef } from 'react';
import Chat from './Chat'
import NewChatSuggestion from './NewChat'

const SearchBar = ({toggleSearchBarView, showChatList , chatSnapshot ,seeChat}) => {
    const [user] = useAuthState(auth);
    const [flag,setFlag] = useState(true);
    const [newSuggestion , setNewSuggestion] = useState([]);
    const searchValue = useRef(null);
    const [chatList,setChatList] = useState([]);

    const searchUsers = (e)=>{
        if(e.target.value != ""){
            console.log("Entered Text",e.target.value);
            if(showChatList == true)
                toggleSearchBarView(!showChatList);
            const getUsers = async()=>{
                const users = await db.collection("user").orderBy("email").startAt(e.target.value).endAt(e.target.value+"\uf8ff").get();
                //console.log("Chat Snapshot",users);
                let userChatList = [];
                let nonChatUsers =  [];
                users?.docs?.forEach(user=>{
                    //console.log("User Name: ",user.data().email)
                    const chatExists = chatSnapshot?.docs.find(
                        (chat) =>
                          chat.data().users.find((u) => u === user.data().email)
                      );
                    //console.log("Chat exists for id ",user.id," : ", chatExists?.data())
                    if(chatExists){
                        userChatList =
                            [...userChatList,
                                {
                                    id: chatExists.id,
                                    email : user.data().email
                                }
                            ]
                        ;
                    }
                    else{
                        nonChatUsers = [
                            ...nonChatUsers,
                            {
                                id: user.id,
                                data : user.data(), 
                            }
                        ]
                    }
                });
                //console.log("User List: ",userChatList);
                //console.log("Non chat User List", nonChatUsers)
                setChatList(userChatList);
                setNewSuggestion(nonChatUsers);
            }
            getUsers();
            //console.log("Outer User List: ",chatList);
            setFlag(false);
        }
    }

    const changeToggleView = (e)=>{
        searchValue.current.value = "";
        if(showChatList === false)   {
            toggleSearchBarView(!showChatList);
            setFlag(true);
        }
    }

    return (
        <>  
        <Search>
        {flag 
            ? <SearchIconStyle style={{fontSize:24}} color="disabled" />
            : <GoBackIconStyle style={{fontSize:24, color:"#34B7F1"}} onClick={changeToggleView} />
        }
            <label style={{display:"none"}}>Search</label>
            <SearchInput ref={searchValue} placeholder="Search in Chat" onChange={searchUsers} />
        </Search>
        
        <ChatList className="ChatList" style={{display: showChatList===false ? "block" : "none"}} >
            {chatList.length!=0 
                ?chatList?.map((chat) => (
                    <Chat
                    key={chat.id}
                    id={chat.id}
                    users={[chat.email , user?.email]}
                    seeChat={seeChat}
                    />
                ))
                : ""
            }
            {
                newSuggestion?.length!=0
                ? newSuggestion?.map((user)=>(
                    <NewChatSuggestion 
                        key={user.id}
                        data = {user.data}
                        changeToggleView={changeToggleView}
                        seeChat={seeChat}
                    />
                ))
                : ""
            }
        </ChatList>
        </>
    );
}
 
export default SearchBar;

const Search = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    padding : 5px;
    border-radius : 2px;
    background-color: #e1eaeb;
    width:100%;
    min-width : 30%;
`;

const SearchInput = styled.input`
outline-width: 0px;
border-radius : 45px;
border : none;
background-color : white;
font-family: Arial, Helvetica, sans-serif;
padding : 10px;
padding-left : 25px;
flex : 1;
`;

const SearchIconStyle = styled(SearchIcon)`
    cursor:"pointer";
    position:absolute;
`;

const GoBackIconStyle = styled(ArrowBackIcon)`
    cursor:"pointer";
    position:absolute;
    z-index: 500;
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
