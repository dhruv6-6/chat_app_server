users = []

const addUser = ({name , room , id}) =>{
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const find = users.find((user) => user.name===name && user.room===room);

    if(find){
        return({error : 'User Already Exists'});
    }
    const user = {name: name , room: room , id: id};
    users.push(user);

    return ({user});
}

const deleteUser = (id) =>{
    const index = users.findIndex((user) => user.id === id);
    const user = users[index];
    if(index!=-1){
        users.splice(index, 1);
    }
    return (user)
}

const getUser = (id) => {
    return(users.find((user) => user.id === id));
}

const getUserInRoom = (room) => {
    return(users.filter((user) => user.room === room));
}

module.exports = {addUser , deleteUser , getUser , getUserInRoom };
