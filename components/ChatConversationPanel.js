import styled from 'styled-components'
import {useEffect , useState} from 'react';
import { useAuthState} from 'react-firebase-hooks/auth';
import {useCollection} from 'react-firebase-hooks/firestore'
import {auth , db} from '../firebase'

import ChatScreen from './ChatScreen'

const ChatConversation = ({chatID,recepientData  , onHover}) => {
    const [userChat,setUserChat] = useState('');
    const [userMessages,setUserMessages] = useState('');
    const [user] = useAuthState(auth);

    useEffect(() => {
        console.log("userEffect called and chatID:"+ chatID)
        const getMessages = async()=>{
            if(chatID){
                const ref = db.collection('chats').doc(chatID);
        
                //PREP the messages on server
                const messageRes = await ref.collection("messages").orderBy("timestamp","asc").get();
        
                const messages = messageRes.docs.map(doc=> ({
                    id: doc.id,
                    ...doc.data(),
                })).map(message => ({
                    ...message,
                    timestamp : message.timestamp.toDate().getTime()
                }));
                
                //PREP the chats
                const chatRes = await ref.get();
                const chat={
                    id : chatRes.id,
                    ...chatRes.data()
                }
                console.log("Chat ref: ", chatRes)
                setUserChat(chat);
                setUserMessages(messages);
                console.log("chat",userChat);
                console.log("messages",userMessages);
            }
        }
        getMessages();
    }, [chatID , recepientData])

    return ( 
         
            <>
                {chatID 
                ? <ChatScreen onHover={onHover} chatID={chatID} recepientData={recepientData} userChat={userChat} userMessages={userMessages} /> 
                :
                <Body>
                <Container>
                    <DefaultImage src='/WhenNoChatSelected.PNG'/>
                </Container> 
                </Body>
                }                   
            </>
    );
}
 
export default ChatConversation;

//export async function getServerSideProps()

const Body = styled.div`
    top:0px;
    height :100vh;
    width : 100%;
    background-color : #f8f9fa;
`;

const Container = styled.div`
    height:100%;
    width : 100%;
    place-items : center;
    display : grid;
`;

const DefaultImage = styled.img`
    max-width: 100%;
    height: auto;
`;

