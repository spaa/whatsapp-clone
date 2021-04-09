import {Circle} from 'better-react-spinkit'
import HeadDetails from './HeadDetails'

const Loading = () => {
    return (
        <center style={{display : "grid" , placeItems: "center" , height : "100vh"}}>
        <HeadDetails/>
        <div >
            <img src="/whatsapp640-640.png"
             style={{marginBottom : 10}}
            height={200}/>
            <Circle color="#3CBC28"/>
        </div>
        </center>
    );
}

export default Loading;