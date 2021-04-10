import HeadDetails from './HeadDetails'
import styled,{ keyframes} from 'styled-components'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db ,storage } from "../firebase";
import firebase from "firebase";
import moment from 'moment';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { useState } from 'react';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import { IconButton } from '@material-ui/core';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import MediaQuery from "react-responsive";

const Message = ({id ,user , message, delivered , read , chatID}) => {
    const [userLoggedIn] = useAuthState(auth);
    const [showImage,setShowImage] = useState('none');
    let MessageFormat = "LT";

    const deleteMessageFromDB = ()=>{
        db.collection('chats').doc(chatID).collection('messages').doc(id).delete().then(() => {
            db.collection("chats")
              .doc(chatID)
              .update({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .then(() => {
                //console.log("File deleted successful from db")
              })
              .catch((error) => {
                //console.log("Error While updating chat timestamp", error);
              });
          })
          .catch((error) => {
            //console.log("Error While deleting chat message", error);
          });
    }

    const deleteMessage = ()=>{
        const ans = confirm("Message will be deleted for everyone. Are you sure you want to delete?");
        if(ans===true){
            if(message.messageType==="image"){
                //console.log("File ",message.message)
                const filename = storage.refFromURL(message.message);
                //console.log("File to delete",filename)
                storage.ref(`images/${filename.name}`).delete().then(() => {
                    alert("File deleted successful from storage")
                    deleteMessageFromDB()
                });
            }
            else if(message.messageType==="doc"){
                //console.log("File ",message.message)
                const filename = storage.refFromURL(message.message);
                //console.log("File to delete",filename)
                storage.ref(`docs/${filename.name}`).delete().then(() => {
                    alert("File deleted successful from storage")
                    deleteMessageFromDB()
                });
            }
            else deleteMessageFromDB()
        }
    }

    const getDocInfo = ()=>{
        if(message.messageType==="doc"){
            //console.log("File ",message.message)
            const filename = storage.refFromURL(message.message);
            const extensionName = filename.name.split(".").pop().toUpperCase();
            //console.log("File to delete",filename)
            return (
                <>
                <MediaQuery minWidth={450}>
                <div style={{display:"flex", backgroundColor:TypeOfMessage===SenderDocElement?"#b6d6c0" : "#e8e8e8" , padding:"10px" , borderRadius:"6px",  cursor:"context-menu" ,userSelect:"none" }}>
                    <div>
                        {extensionName === "PDF"
                        ? <img width="35px" style={{position:"relative" , top:"3px"}} src="/pdf.svg" alt="pdf" />
                        : <img width="35px" style={{position:"relative" , top:"3px"}} src="/doc.svg" alt="doc" />
                        }
                    </div>
                    <div style={{whiteSpace: "nowrap",overflow : "hidden",textOverflow: "ellipsis" ,fontFamily:"monospace" ,padding:"10px"}}>
                        {filename.name}
                    </div>
                    
                    <div style={{position:"relative", top:"5px"}}>
                        <a href={message.message} target="_blank" download>
                            <img src="/download-circular-button.svg" width="30px" alt="download-doc" />
                        </a>
                    </div>
                    <div style={{position:"absolute", bottom:"-1px" , fontSize:"14px", fontFamily:"monospace" , color:"grey"}}>
                        <span style={{}}>.{extensionName}</span>
                    </div>
                </div>
                </MediaQuery>

                <MediaQuery maxWidth={450}>
                <div style={{display:"flex", backgroundColor:TypeOfMessage===SenderDocElement?"#b6d6c0" : "#e8e8e8" , padding:"10px" , borderRadius:"6px",  cursor:"context-menu" ,userSelect:"none" }}>
                    <div>
                        {extensionName === "PDF"
                        ? <img width="30px" style={{position:"relative" , top:"3px"}} src="/pdf.svg" alt="pdf" />
                        : <img width="35px" style={{position:"relative" , top:"3px"}} src="/doc.svg" alt="doc" />
                        }
                    </div>
                    
                    <div style={{whiteSpace: "nowrap",overflow : "hidden",textOverflow: "ellipsis" ,fontFamily:"monospace" ,padding:"5px"}}>
                        {filename.name}
                    </div>
                    <div style={{position:"relative", top:"5px"}}>
                        <a href={message.message} target="_blank" download>
                            <img src="/download-circular-button.svg" width="30px" alt="download-doc" />
                        </a>
                    </div>
                    <div style={{position:"absolute", bottom:"-1px" , fontSize:"14px", fontFamily:"monospace" , color:"grey"}}>
                        <span style={{}}>.{extensionName}</span>
                    </div>
                </div>
                </MediaQuery>
                </>
            );
        }
    }

    if(chatID && message){
        const MessageTimeDifference = new Date().getDate() - new Date(message.timestamp).getDate();
        const MessageYearDifference = new Date().getFullYear() - new Date(message.timestamp).getFullYear();
        //console.log("MessageYearDifference", MessageYearDifference)
        MessageFormat = MessageTimeDifference==0 ? "LT" : (MessageYearDifference==0 ? "h:mm A DD/MM" :"h:mm A DD/MM/YY");
    //console.log("MessageTimeDifference", MessageTimeDifference)
    }
    

    const TypeOfMessage =  (user === userLoggedIn.email 
                                ? message.messageType==="image" 
                                    ? SenderImageElement 
                                    : message.messageType==="doc"
                                    ? SenderDocElement
                                    :Sender 
                                : message.messageType==="image" 
                                ? ReceiverImageElement 
                                : message.messageType==="doc"
                                ? ReceiverDocElement
                                :Receiver 
                                )
    return ( 
        <Container>
        <HeadDetails />
        <TypeOfMessage style={{minWidth:MessageFormat==="LT"? "80px" : "130px"}}>
            {
                message.messageType==="image"
                ? 
                <>
                <a href={message.message} target="_blank" download> 
                    <img src="/download-circular-button.svg" alt="download-img" style={{position: "absolute",top: "50%",left: "50%",transform: "translate(-50%, -50%)",width: '20%'}}/>
                </a>
                
                <IconButton style={{position:"absolute", bottom:"2px" ,right:"8px" }} onClick={()=>setShowImage("block")} >
                    <FullScreenIconButton />        
                </IconButton>
                           
                {TypeOfMessage === SenderImageElement 
                        ?<>
                            <MediaQuery minWidth={450}>
                                <ImmageMessageText style={{height: "350px", padding:"5px 10px 12px 5px" }} src={message.message}  /> 
                            </MediaQuery>
                            <MediaQuery maxWidth={450}>
                                <ImmageMessageText style={{height: "250px", padding:"5px 10px 12px 5px"}} src={message.message}  /> 
                            </MediaQuery>                        
                            <IconButton style={{position:"absolute", top:"2px" ,right:"8px",color:"#dcf8c6" }} onClick={()=>deleteMessage(message)} >
                                <DeleteIcon />
                            </IconButton> 
                            <TimeStamp style={{right : "8px" , bottom : "-11px"}}>
                                {message.timestamp ? moment(message.timestamp).format(MessageFormat) : "..."}
                                {read
                                    ? <DoubleTickIcon style={{fontSize:18, color:"#34B7F1"}} />
                                    :delivered 
                                        ? <DoubleTickIcon style={{fontSize:18}} color="action" /> 
                                        : <SingleTickIcon style={{fontSize:18}} color="action"/>
                                }
                            </TimeStamp> 
                        </>
                        : <>
                        <MediaQuery minWidth={450}>
                            <ImmageMessageText style={{height: "350px", padding:"5px 5px 12px 10px"}} src={message.message}  /> 
                        </MediaQuery>
                        <MediaQuery maxWidth={450}>
                            <ImmageMessageText style={{height: "250px", padding:"5px 5px 12px 10px"}} src={message.message}  /> 
                        </MediaQuery>
                        <TimeStamp style={{right : "0px" , bottom : "-11px"}}>
                            {message.timestamp ? moment(message.timestamp).format(MessageFormat) : "..."}  
                        </TimeStamp>
                        </>
                } 
                </>
                : message.messageType==="doc"
                    ?
                    <>
                    <>
                    {getDocInfo()}
                    </>
                                
                    {TypeOfMessage === SenderDocElement 
                        ? 
                        <>
                        <IconButton style={{position:"absolute", top:"0px" ,right:"-5px" }} onClick={deleteMessage} >
                            <DeleteIcon style={{fontSize:17}}  />
                        </IconButton>
                        <TimeStamp style={{right : "8px"}}>
                            {message.timestamp ? moment(message.timestamp).format(MessageFormat) : "..."}
                            {read
                                ? <DoubleTickIcon style={{fontSize:18, color:"#34B7F1"}} />
                                :delivered 
                                    ? <DoubleTickIcon style={{fontSize:18}} color="action" /> 
                                    : <SingleTickIcon style={{fontSize:18}} color="action"/>
                            }
                        </TimeStamp> 
                        </>
                        : <TimeStamp style={{right : "0px"}}>
                            {message.timestamp ? moment(message.timestamp).format(MessageFormat) : "..."}  
                        </TimeStamp>
                    }
                    </>
                    : 
                    <>
                    <div style={{fontFamily:"Aparajita"}}>{message.message}</div>
                               
                    {TypeOfMessage === Sender 
                        ? 
                        <>
                        <IconButton style={{position:"absolute", top:"0px" ,right:"-5px" }} onClick={deleteMessage} >
                            <DeleteIcon style={{fontSize:17}}  />
                        </IconButton> 
                        <TimeStamp style={{right : "8px"}}>
                            {message.timestamp ? moment(message.timestamp).format(MessageFormat) : "..."}
                            {read
                                ? <DoubleTickIcon style={{fontSize:18, color:"#34B7F1"}} />
                                :delivered 
                                    ? <DoubleTickIcon style={{fontSize:18}} color="action" /> 
                                    : <SingleTickIcon style={{fontSize:18}} color="action"/>
                            }
                        </TimeStamp> 
                        </>
                        : <TimeStamp style={{right : "0px"}}>
                            {message.timestamp ? moment(message.timestamp).format(MessageFormat) : "..."}  
                        </TimeStamp>
                    }
                    </>
            }
            
        </TypeOfMessage>
        {
            message.messageType==="image" &&
            <ImageModal style={{display:showImage}} >
                <CloseButton>
                    <IconButton onClick={()=>setShowImage("none")}>
                        <FullscreenExitIcon style={{color:"red"}} />
                    </IconButton>
                </CloseButton>
                <ModalImage src={message.message}/>
            </ImageModal>
        }
        </Container> 
    );
}
 
export default Message;

const Container = styled.div``;

const ImmageMessageText = styled.img`
    alt : "image";
    width: 100%;
    border-radius : 17px;
`;

const MessageElement = styled.div`
    width : fit-content;
    padding : 15px;
    border-radius : 8px;
    margin : 10px;
    min-width : 80px;
    max-width : 70%;
    word-break : break-word;
    padding-bottom : 16px;
    padding-right : 50px;
    position : relative;
    text-align: justify;
    text-justify: inter-word;
`;

const TimeStamp = styled.div`
    color : grey;
    padding : 10px;
    font-size : 9px;
    position : absolute;
    bottom : -5px;
    
`;

const Sender = styled(MessageElement)`
    margin-left : auto;
    background-color : #dcf8c6;
    ::before{
        content: '';
        border-left: 20px solid #dcf8c6;
        border-top: 20px solid transparent;
        border-bottom: 20px solid transparent;
        position: absolute;
        top : 0px;
        right:-10px;
    }
`;

const SenderImageElement = styled(Sender)`
    width : 450px;
    padding : 0px;
`;

const SenderDocElement = styled(Sender)`
    padding : 5px;
    padding-bottom : 16px;
    padding-right : 26px;
`;

const Receiver = styled(MessageElement)`
    background-color : white;
    ::before{
        content: '';
        border-right: 20px solid white;
        border-top: 20px solid transparent;
        border-bottom: 20px solid transparent;
        position: absolute;
        top : 0px;
        left:-10px;
    }
`;

const ReceiverImageElement = styled(Receiver)`
    width : 450px;
    padding : 0px;
`;

const ReceiverDocElement = styled(Receiver)`
    padding : 5px;
    padding-bottom : 16px;
    padding-left : 10px;
`;

const SingleTickIcon = styled(DoneIcon)`
    position : absolute;
    top : 8px;
    right : -5px;
    padding-left : 5px;
`;

const DoubleTickIcon = styled(DoneAllIcon)`
    position : absolute;
    top : 8px;
    right : -5px;
    padding-left : 5px;
`;

const DeleteIcon = styled(DeleteOutlineIcon)`
    :hover {
        color :red;
    }
`;

const ImageModal = styled.div`
    position: fixed; /* Stay in place */
    z-index: 500; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.9); /* Black w/ opacity */
`;

const CloseButton = styled.span`
    position: absolute;
    top: 15px;
    right: 35px;
`;

const zoom = keyframes`
    from {transform : scale(0) }
    to {transform : scale(1)}
`;

const ModalImage = styled.img`
    alt : "ModalImage";
    margin: auto;
    display: block;
    width: 80%;
    max-width: 700px;
    animation-name : ${zoom};
    animation-duration : 0.6s;
`;

const FullScreenIconButton = styled(FullscreenIcon)`
    color: grey;
    :hover {
        color: #34B7F1;
    }
`;