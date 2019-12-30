const users = []

const addUser = ({id,username,room}) => {
    username = username.trim(),
    room = room.trim()
    //validation
    if(!username || !room){
        return{
            error:'Username and room are required'
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if(existingUser){
        return{
            error:'Username already there in chatroom'
        }
    }

    //store user
    const user = {id,username,room}
    users.push(user)
    return {user}
}

//Remove user
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

//getUser
const getUser = (id) => {
    return users.find((user) => user.id === id )
}

//userInRoom
const getUserInRoom = (room) => {
    room = room.trim()
    return users.filter((user) => user.room === room)
}

module.exports = {
     addUser,
     removeUser,
     getUser,
     getUserInRoom
}