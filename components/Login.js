import styled from 'styled-components';
import HeadDetails from './HeadDetails'
import { Button } from '@material-ui/core';
import {auth , provider, db} from '../firebase';
import firebase from 'firebase'

const Login = () => {

    const signIn = () =>{
        auth.signInWithPopup(provider)
        .then(result=>{
            const user = result.user
            //console.log(user);
            db.collection('user').doc(user.uid).set({
                userName : user.displayName,
                email : user.email,
                lastSeen : firebase.firestore.FieldValue.serverTimestamp(),
                photoURL : user.photoURL,
                online: true,
              },{merge:true});
            })
        .catch((error)=>alert(`Problem:${error.message}`));
    }

    return (
        <Body> 
        <Container>
            <HeadDetails title="Whatsapp:Login" />
                
            <LogoContainer>
                <Logo src="/whatsapp640-640.png" alt="whatsapp-logo" />
                <LoginButton variant="contained" onClick={signIn}>Sign in</LoginButton>
            </LogoContainer>
        </Container>
        </Body>
    );
}
 
export default Login;

const Body = styled.div`
    background-image : url('/background.png')
`;

const Container = styled.div`
    display : grid;
    place-items : center;
    height :100vh;
`;

const LogoContainer = styled.div`
    padding :100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius : 5px;
    box-shadow : 0px 4px 14px -3px rgba(0,0,0.7);
`;

const Logo = styled.img`
    height: 200px;
    width : 200px;
    margin-bottom : 50px;
`;

const LoginButton = styled(Button)`
    &&&{
        color : white;
        background-color : #3CBC28;
    }
`;