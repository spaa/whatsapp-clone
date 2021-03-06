import { Avatar } from '@material-ui/core';
import HeadDetails from './HeadDetails'
import styled from 'styled-components'
import { useAuthState} from 'react-firebase-hooks/auth';
import getRecepientEmail from '../utils/getRecepientEmail'
import {auth , db , storage} from '../firebase'
import { useCollection, useCollectionOnce } from 'react-firebase-hooks/firestore';
import moment from 'moment';
import 'w3-css/w3.css'
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import Image from 'next/image'
//import { useRouter } from 'next/router'

const Chat = ({id , users , seeChat}) => {
    //const router = useRouter();
    const [user] = useAuthState(auth)
    const [recepientSnapshot] = useCollectionOnce(db.collection('user').where("email" , "==" ,getRecepientEmail(users,user)))
    const recepient = recepientSnapshot?.docs?.[0]?.data();
    const recepientEmail = getRecepientEmail(users , user);
    //if(recepientEmail)
        var [chatMessagesSnapshot] = useCollection(db.collection('chats').doc(id).collection("messages").orderBy("timestamp", "desc"))
    const lastMessage = chatMessagesSnapshot?.docs?.[0]?.data();
    const lastMessageTime = chatMessagesSnapshot?.docs?.[0]?.data()?.timestamp?.toDate();
    const unreadMessageCount = chatMessagesSnapshot?.docs?.filter(msg=> msg?.data()?.user === recepientEmail && msg?.data()?.messageSeen === false)?.length;
    const lastMessageDayDifference = lastMessageTime ? (new Date().getDate() - lastMessageTime.getDate()) : "Nan";
    // const tempTime = new Date(lastMessageTime);
    // const lastMessageTimeDifference = lastMessageTime ? ((new Date().setHours(0,0,0,0) === tempTime.setHours(0,0,0,0))) : "Nan";
    const lastMessageTimeFormat = lastMessageDayDifference == 0 ? "LT" : "DD/MM/YY"
    //console.log("Last Message for chat :",id," = ",lastMessage)
    // console.log("Unread Message Count: ",unreadMessageCount)
    // console.log("chatMessagesSnapshot" ,chatMessagesSnapshot?.docs?.length)
    // console.log("Last Message Time Stamp" , lastMessageTime)
    //console.log("Message Time Difference ", lastMessageDayDifference)


    const getDocInfo = ()=>{
            //console.log("File ",lastMessage.message)
            const filename = storage.refFromURL(lastMessage.message);
            const extensionName = filename.name.split(".").pop().toUpperCase();
            //console.log("File to delete",filename)
            return (
                <>
                {extensionName === "PDF"
                        ? <><Image width={20} height={20} src="/pdf-simple.svg" alt="pdf" /><span style={{position: "relative", bottom:"4px", fontFamily:"Helvetica"}}> PDF</span></>
                        : <><Image width={20} height={20} src="/doc-simple.svg" alt="doc" /><span style={{position: "relative", bottom:"4px", fontFamily:"Helvetica"}}> DOC</span></>
                }
                </>
            );
    }


    return (  
        <Container onClick={()=>seeChat(id , recepient )}>
            <HeadDetails />
                <UserAvatar src={recepient?.photoURL} alt={recepientEmail} />
            <MessageContent>
                <UserName >
                    {recepientEmail}                  
                </UserName>
                <LastMessageContainer>
                    <LastMessage>
                        {lastMessage?.messageType === "image" 
                            ? <><Image width={20} height={20} src="/camera.svg" alt="doc" /> <span style={{position: "relative", bottom:"4px", fontFamily:"Helvetica"}}>Photo</span></>
                            : lastMessage?.messageType === "doc" 
                                ? getDocInfo()
                                :lastMessage?.message
                        }
                    </LastMessage>
                    <div>
                        {lastMessage?.user === user?.email && (lastMessage?.delivered 
                            ? lastMessage?.messageSeen
                                ?   <DoubleTick style={{fontSize:18, color:"#34B7F1"}}/>
                                :   <DoubleTick style={{fontSize:18}} color="action"/>
                            : <SingleTick style={{fontSize:18}} color="action"/>)}
                    </div>
                </LastMessageContainer>
            </MessageContent>
            <MessageMetaData>
                {unreadMessageCount>0 
                    ?<LastMessageTimeUnread >
                        {lastMessageDayDifference ==1 
                            ? "Yesterday" 
                            : ((lastMessageDayDifference==0 || lastMessageDayDifference>1) 
                                ? moment(lastMessageTime).format(lastMessageTimeFormat) 
                                : "..."
                            )
                        }
                    </LastMessageTimeUnread>
                    :<LastMessageTime>
                        {lastMessageDayDifference ==1 
                            ? "Yesterday" 
                            : ((lastMessageDayDifference==0 || lastMessageDayDifference>1) 
                                ? moment(lastMessageTime).format(lastMessageTimeFormat) 
                                : ""
                            )
                        }
                    </LastMessageTime>
                }
                
                <MessageCountContainer>
                <MessageCount className="w3-badge" >
                        {unreadMessageCount>0 ? unreadMessageCount : " "}
                </MessageCount>
                </MessageCountContainer>
            </MessageMetaData>
        </Container>
    );
}
 
export default Chat;

const SingleTick = styled(DoneIcon)`
    position :relative;
    right : 5px;
    bottom : -5px;
`;
const DoubleTick = styled(DoneAllIcon)`
    position :relative;
    right : 5px;
    bottom : -5px;
`;

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
    font-family : Geneva;
    font-size : 18px;
    margin : 5px 0px;
`;

const LastMessage = styled.span`
    flex:1;
    white-space: nowrap;
    overflow : hidden;
    text-overflow: ellipsis;
    font-family : Optima;
    font-size : 15px;
    margin : 5px 0px;
`;

const LastMessageContainer = styled.div`
    display :flex;
    white-space: nowrap;
    overflow : hidden;
    text-overflow: ellipsis;
    margin : 5px 0px;
`;

const LastMessageTime = styled.div`
    font-size : 10px;
`;

const LastMessageTimeUnread = styled.div`
    font-size : 10px;
    color : #25D366;
`;

const MessageCountContainer = styled.div`
    position: relative;
`;

const MessageCount = styled.div`
    position : inherit;
    left : 10px;
    font-size : 10px;
    font-weight :bold;
    background-color : #25D366;
    padding-left : 12%;
    padding-right : 12%;
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
    cursor: pointer;
    padding: 5px 15px;
    position:relative;
    border-bottom: 1px solid whitesmoke;
    height: 80px;
    user-select: none;
    :hover {
        background-color : #e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`
    margin : 5px;
    margin-right : 5px;
`;