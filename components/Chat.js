import { Avatar } from '@material-ui/core';
import styled from 'styled-components'
import { useAuthState} from 'react-firebase-hooks/auth';
import getRecepientEmail from '../utils/getRecepientEmail'
import {auth , db} from '../firebase'
import { useCollection } from 'react-firebase-hooks/firestore';
//import { useRouter } from 'next/router'

const Chat = ({id , users , seeChat}) => {
    //const router = useRouter();
    const [user] = useAuthState(auth)
    const [recepientSnapshot] = useCollection(db.collection('user').where("email" , "==" ,getRecepientEmail(users,user)))
    const recepient = recepientSnapshot?.docs?.[0]?.data();
    const recepientEmail = getRecepientEmail(users , user);

    //console.log("recepientSnapshot" ,recepientSnapshot)
    
    return (  
        <Container onClick={()=>seeChat(id , recepient )}>
            {recepient 
                ? (<UserAvatar src={recepient?.photoURL}/>)
                : (<UserAvatar> {recepientEmail[0]}</UserAvatar>)
            }
            <p>{recepientEmail}</p>
        </Container>
    );
}
 
export default Chat;

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break : break-word;
    :hover {
        background-color : #e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`
    margin : 5px;
    margin-right : 5px;
`;