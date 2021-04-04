import styled from 'styled-components'
import {useEffect , useState} from 'react';
import { useAuthState} from 'react-firebase-hooks/auth';
import {useCollection} from 'react-firebase-hooks/firestore'
import {auth , db} from '../firebase'

import ChatScreen from './ChatScreen'

const ChatConversation = ({chatID,recepientData ,updateRecepientData}) => {

    if(chatID){
        const setMessageSceen = async()=>{
            const messages = await db
            .collection("chats")
            .doc(chatID)
            .collection("messages")
            .orderBy("timestamp", "asc").get();

            console.log("Messages:",messages)
            const filteredMessage = messages?.docs?.filter(message=> message.data().user === recepientData?.email && message.data().messageSeen === false);
            console.log("Filtered Message",filteredMessage)
            // messages?.map(message=> (
            
            //     db.collection('chats').doc(chatID).collection('messages').doc(message.id).update({
            //         messageSeen : true
            //     })
            // ))
        }
        setMessageSceen();
    }


    return ( 
         
            <>
                {chatID 
                ? <ChatScreen chatID={chatID} recepientData={recepientData} updateRecepientData={updateRecepientData} /> 
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

