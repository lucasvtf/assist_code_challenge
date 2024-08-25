import Avatar from "./Avatar"

function Contact({ id, username, onClick, selected, online }) {
    return (
        <div onClick={() => onClick(id)}
            key="id"
            className={"border-b border-gray-100 flex items-center gap-2 cursor-pointer " + (selected ? "bg-blue-50" : "")}>
            {selected && (
                <div className="w-1 bg-blue-500 h-12 rounde-r-md"></div>
            )}
            <div className="flex gap-2 py-2 pl-4 items-center">
                <Avatar online={online} username={username} userId={id} />
                <span className="text-grey-800">{username}</span>
            </div>
        </div>
    )
}

export default Contact