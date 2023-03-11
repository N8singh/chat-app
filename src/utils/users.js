const users = []

const addUsers = ({id,Name,Room}) => {

    //Cleaning

    Name = Name.trim().toLowerCase()
    Room = Room.trim().toLowerCase()

    //Validation

    if(!Name || !Room) {
        return {
            error : "Username and Room are required!"
        }
    }

    const found = users.find(user => {
       return user.Name === Name && user.Room === Room
    })

    if(found) {
        return {
            error : "Username already taken"
        }
    }

    //Adding user

    const newUser = {
        id,
        Name,
        Room
    }

    users.push(newUser)

    return {newUser}

}

//Remove user

const removeUser = (id) => {
    const index  = users.findIndex(user => {return user.id === id})

    if(index !== -1) {
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    const found = users.find(user => {
        return user.id === id
    })
    return found
}

const getUsersInRoom = (Room) => {
    Room = Room.trim().toLowerCase()
    const newarr = users.filter(user => user.Room === Room)
    return newarr
}

module.exports = {
    addUsers,
    getUser,
    removeUser,
    getUsersInRoom
}