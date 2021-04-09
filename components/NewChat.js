import { Avatar } from '@material-ui/core';
import styled from 'styled-components'
import { useAuthState} from 'react-firebase-hooks/auth';
import {auth , db} from '../firebase'
import 'w3-css/w3.css'
import AddIcon from '@material-ui/icons/Add';

const Chat = ({ data , seeChat , changeToggleView}) => {
    const [user] = useAuthState(auth);

    const createNewChat = ()=>{
        db.collection("chats").add({
            users: [user.email, data.email],
            typing: [],
            timestamp : new Date(),
        }).then(result=>{
            //console.log("Chat Added to db",result?.id)
            changeToggleView()
            //seeChat(result.id, data)
        });
        
    }

    return (  
        <Container>
            <UserAvatar src={data.photoURL}/>
            <MessageContent>
                <UserName >
                    {data.email}                  
                </UserName>
            </MessageContent>
            <MessageMetaData>
                <AddUser onClick={createNewChat} style={{color:"#34B7F1"}}/>
            </MessageMetaData>
        </Container>
    );
}
 
export default Chat;

const MessageContent = styled.div`
    flex:1;
    white-space: nowrap;
    overflow : hidden;
    text-overflow: ellipsis;
    align-items: center;
    
`;

const UserName = styled.p`
    white-space: nowrap;
    overflow : hidden;
    text-overflow: ellipsis;
    font-weight : bold;
    margin : 5px 0px;
`;

const AddUser = styled(AddIcon)`
cursor: pointer;
`;


const MessageMetaData = styled.div`
    position:relative;
    display: flex-column;
    align-items: center;
    padding-left : 5px;
    right:0px;
`;



const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 5px 15px;
    position:relative;
    border-bottom: 1px solid whitesmoke;
    height: 80px;
    :hover {
        background-color : #e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`
    margin : 5px;
    margin-right : 5px;
`;