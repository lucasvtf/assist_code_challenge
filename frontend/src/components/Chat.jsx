import { useContext, useEffect, useState } from "react"
import { uniqBy } from 'lodash'
import { UserContext } from '../context/UserContext'
import Avatar from "./Avatar";
import Logo from "./Logo";


function Chat() {
    const [ws, setWs] = useState(null)
    const [onlinePeople, setOnlinePeople] = useState({})
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [newMessageText, setNewMessageText] = useState('')
    const [messages, setMessages] = useState([])
    const { username, id } = useContext(UserContext)

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001');
        setWs(ws)
        ws.addEventListener('message', handleMessage)
    }, [])

    function showOnlinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username
        });
        setOnlinePeople(people)
    }

    function handleMessage(e) {
        const messagaData = JSON.parse(e.data)
        console.log(messagaData)
        if ('online' in messagaData) {
            showOnlinePeople(messagaData.online)
        } else if ('text' in messagaData) {
            setMessages(prev => ([...prev, { ...messagaData }]))
        }
    }

    function sendMessage(e) {
        e.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessageText
        }))
        setNewMessageText('')
        setMessages(prev => ([...prev, { text: newMessageText, isOur: true }]))
    }

    const onlinePeopleExcludeOurUser = { ...onlinePeople }
    delete onlinePeopleExcludeOurUser[id]

    const messagesWithoutDupes = uniqBy(messages, 'id')

    return (
        <div className="flex h-screen">
            <div className="bg-white w-1/3">
                <Logo />
                {username}
                {
                    Object.keys(onlinePeopleExcludeOurUser).map(userId => (
                        <div onClick={() => setSelectedUserId(userId)}
                            key="userId"
                            className={"border-b border-gray-100 flex items-center gap-2 cursor-pointer " + (userId === selectedUserId ? "bg-blue-50" : "")}>
                            {userId === selectedUserId && (
                                <div className="w-1 bg-blue-500 h-12 rounde-r-md"></div>
                            )}
                            <div className="flex gap-2 py-2 pl-4 items-center">
                                <Avatar username={onlinePeople[userId]} userId={userId} />
                                <span className="text-grey-800">{onlinePeople[userId]}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2">
                <div className="flex-grow">
                    {
                        !selectedUserId && (
                            <div className="flex h-full items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-gray-400">
                                    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                                </svg>

                                <div className="text-gray-400 pl-2">Select a person from the sidebar</div>
                            </div>
                        )
                    }
                    {
                        !!selectedUserId && (
                            <div>
                                {
                                    messagesWithoutDupes.map(m => (
                                        <div>{m.text}</div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
                {!!selectedUserId && (
                    <form className="flex gap-2" onSubmit={sendMessage}>
                        <input type="text"
                            value={newMessageText}
                            onChange={e => setNewMessageText(e.target.value)}
                            placeholder=" Type your message here"
                            className="bg-white flex-grow border p-2 rounded-sm"></input>
                        <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Chat