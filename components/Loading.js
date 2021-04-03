import {Circle} from 'better-react-spinkit'
const Loading = () => {
    return (
        <center style={{display : "grid" , placeItems: "center" , height : "100vh"}}>
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