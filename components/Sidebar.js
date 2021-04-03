import {Avatar, Button, IconButton} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import styled from 'styled-components'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useAuthState} from 'react-firebase-hooks/auth';
import {useCollection} from 'react-firebase-hooks/firestore'
import {auth , db} from '../firebase'
import firebase from 'firebase';


import SearchBar from './SearchBar';
import Chat from './Chat'
import * as EmailValidator from 'email-validator'

const Sidebar = ({seeChat}) => {
    const [user] = useAuthState(auth);

    const userCharRef = db.collection('chats').where('users', 'array-contains' ,user.email);
    const usersAccountRef = db.collection('user');
    const [chatSnapshot] = useCollection(userCharRef);
    const [userAccountSnapshot] = useCollection(usersAccountRef)

    const createChat = () => {

        const input = prompt('Please enter email of  person with whom you need to start chat');
        if(!input) return null;

        const data = chatAlreadyExists(input);
        // if(!data.userExists) {
        //     alert("Entered Email id is not registered");
        //     return "";
        // }
        if(data.chatExists) {
            alert("Chat with user already exists");
            return "";
        }
        console.log("Creating chat");
        if(EmailValidator.validate(input) && input != user.email){
            //Need to add chat into DB 'chats' collection
            db.collection('chats').add({
                users: [user.email , input],
                typing: [],
            })
        }
    }

    const chatAlreadyExists = (recepientEmail) => {
        const chatExists =!!chatSnapshot?.docs.find(chat => chat.data().users.find(user => user === recepientEmail)?.length>0)
        //const userExists = !!userAccountSnapshot?.docs.find(user => user.data().email === recepientEmail)
        //return {chatExists,userExists};
        return {chatExists};
    }
    const onLogout = ()=>{
        //Update the last Sceen
        db.collection("user").doc(user.uid).set({
            lastSeen : firebase.firestore.FieldValue.serverTimestamp(),
            online: false
        },{merge:true});
        auth.signOut();
    }

    return (  
        <OuterContainer>
        <Container>
            <Sticky>
            <Header>
                <UserAvatar src={user?.photoURL} onClick={onLogout}/>                
                <IconContainer>
                <IconButton><ChatIcon/></IconButton>
                <IconButton><MoreVertIcon/></IconButton>
                </IconContainer>
            </Header>
            <SearchButton/>
            <SideBarButton onClick={createChat}>Start New Chat</SideBarButton>
            </Sticky>
            {/* List of Chats */}
            <ChatList>
            {chatSnapshot?.docs.map(chat =>(
                <Chat key={chat.id} id={chat.id} users={chat.data().users} seeChat={seeChat} />
            ))}
            </ChatList>
        </Container>
        </OuterContainer>
    );
}
 
export default Sidebar;

const OuterContainer = styled.div`
    flex : 0.5;
    border-right : 1px solid whitesmoke;
    height :100vh;
    min-width : 250px;
    max-width : 350px;
    overflow-y : scroll;

    ::-webkit-scrollbar {
        display : none;
    }
    -ms-overflow-style : none;
    scrollbar-width : none;
`;

const Container = styled.div`
    flex : 0.5;
    border-right : 1px solid whitesmoke;
    height :100vh;
    min-width : 250px;
    max-width : 350px;
    overflow-y : scroll;

    ::-webkit-scrollbar {
        display : none;
    }
    -ms-overflow-style : none;
    scrollbar-width : none;
`;

const Sticky = styled.div`
background: white;
position : sticky;
top : 0px;
z-index:100;
`;

const IconContainer = styled.div``;

const Header = styled.div`
display:flex;
background-color : #e9eaeb;
justify-content : space-between;
align-items : center;
padding :15px;
height :80px;
border-bottom : 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity : 0.8;
    }
`;

const SearchButton = styled(SearchBar)``;

const SideBarButton = styled(Button)`
    width : 100%;
    &&&{
        border-top : 1px solid whitesmoke;
        border-bottom : 1px solid whitesmoke;
    }
`;

const ChatList = styled.div`
    height: 80%;
    overflow-y: scroll;
    overflow-x :hidden;
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