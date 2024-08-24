import RegisterAndLoginForm from './components/RegisterAndLoginForm'
import Chat from './components/Chat'
import { useContext } from "react"
import { UserContext } from "./context/UserContext"



export default function Routes() {
    const { loggedInUsername } = useContext(UserContext)

    if (loggedInUsername) {
        return <Chat />
    }

    return (
        <RegisterAndLoginForm />
    );
}