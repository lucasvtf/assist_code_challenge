import RegisterAndLoginForm from './components/RegisterAndLoginForm'
import { useContext } from "react"
import { UserContext } from "./context/UserContext"



export default function Routes() {
    const { loggedInUsername } = useContext(UserContext)

    if (loggedInUsername) {
        return 'logged in!' + loggedInUsername;
    }

    return (
        <RegisterAndLoginForm />
    );
}