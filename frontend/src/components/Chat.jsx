import { useContext, useEffect, useRef, useState } from "react"
import { uniqBy } from 'lodash'
import { UserContext } from '../context/UserContext'
import Logo from "./Logo";
import { getMessages, getPeople, logout } from "../utils/api";
import Contact from "./Contact";


function Chat() {
    const [ws, setWs] = useState(null)
    const [onlinePeople, setOnlinePeople] = useState({})
    const [offlinePeople, setOfflinePeople] = useState({})
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [newMessageText, setNewMessageText] = useState('')
    const [messages, setMessages] = useState([])
    const { loggedInUsername, id, setId, setLoggedInUsername } = useContext(UserContext)
    const divUnderMessages = useRef()

    useEffect(() => {
        connectToWs()
    }, [])

    function connectToWs() {
        const ws = new WebSocket('ws://localhost:3001');
        setWs(ws)
        ws.addEventListener('message', handleMessage)
        ws.addEventListener('close', () => {
            setTimeout(() => {
                connectToWs();
            }, 1000)
        })
    }

    function showOnlinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username
        });
        setOnlinePeople(people)
    }

    function handleMessage(e) {
        const messagaData = JSON.parse(e.data)
        if ('online' in messagaData) {
            showOnlinePeople(messagaData.online)
        } else if ('text' in messagaData) {
            if (messagaData.sender === selectedUserId) {
                setMessages(prev => ([...prev, { ...messagaData }]))
            }
        }
    }

    function sendMessage(e) {
        e.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessageText
        }))
        setNewMessageText('')
        setMessages(prev => ([...prev, { text: newMessageText, sender: id, recipient: selectedUserId, _id: Date.now() }]))
    }

    function userLogout() {
        logout();
        setId(null);
        setLoggedInUsername(null);
        setWs(null)
    }

    useEffect(() => {
        const div = divUnderMessages.current
        if (div) {
            div.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
    }, [messages])

    useEffect(() => {
        const fetchPeople = async () => {
            const peopleData = await getPeople();

            const offlinePeopleArr = peopleData
                .filter(p => p._id !== id)
                .filter(p => !Object.keys(onlinePeople).includes(p._id))
            const offlinePeopleObj = {};
            offlinePeopleArr.forEach(p => {
                offlinePeopleObj[p._id] = p;
            });

            setOfflinePeople(offlinePeopleObj)
        }
        fetchPeople()
    }, [onlinePeople])

    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedUserId) {
                const messages = await getMessages(selectedUserId);
                setMessages(messages);
            }
        };
        fetchMessages();
    }, [selectedUserId]);

    const onlinePeopleExcludeOurUser = { ...onlinePeople }
    delete onlinePeopleExcludeOurUser[id]

    const messagesWithoutDupes = uniqBy(messages, '_id')

    return (
        <div className="flex h-screen">
            <div className="bg-white w-1/3 flex flex-col">
                <div className="flex-grow">
                    <Logo />
                    {
                        Object.keys(onlinePeopleExcludeOurUser).map(userId => (
                            <Contact
                                key={userId}
                                id={userId}
                                username={onlinePeopleExcludeOurUser[userId]}
                                onClick={() => setSelectedUserId(userId)}
                                selected={userId === selectedUserId}
                                online={true}
                            />
                        ))
                    }
                    {
                        Object.keys(offlinePeople).map(userId => (
                            <Contact
                                key={userId}
                                id={userId}
                                username={offlinePeople[userId].username}
                                onClick={() => setSelectedUserId(userId)}
                                selected={userId === selectedUserId}
                                online={false}
                            />
                        ))
                    }
                </div>
                <div className="flex p-2 text-center items-center justify-center">
                    <span className="flex mr-2 text-sm text-gray-600 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                        </svg>
                        {loggedInUsername}</span>
                    <button
                        onClick={userLogout}
                        className="text-sm text-gray-500 bg-blue-100 py-1 px-2 border rounded-sm">logout</button>
                </div>
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
                            <div className="relative h-full">
                                <div className="overflow-y-scroll absolute top-0 right-0 left-0 bottom-2">
                                    {
                                        messagesWithoutDupes.map(m => (
                                            <div key={m._id} className={(m.sender === id ? "text-right" : "text-left")}>
                                                <div className={"text-left inline-block p-2 my-2 rounded-md text-sm " +
                                                    (m.sender === id ? "bg-blue-500 text-white" : "bg-white text-gray-500")}>{
                                                        m.text
                                                    }</div>
                                            </div>
                                        ))
                                    }
                                    <div ref={divUnderMessages}></div>
                                </div>
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