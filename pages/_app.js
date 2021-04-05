import '../styles/globals.css'
import LoginPage from '../components/Login'
import { useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '../firebase'
import Loading from '../components/Loading'
import {} from 'w3-css/w3.css'
function MyApp({ Component, pageProps }) {
  const [user,loading] = useAuthState(auth);

  if(loading) return <Loading/>
  if (!user) return <LoginPage/>
  return <Component {...pageProps} />
}

export default MyApp
