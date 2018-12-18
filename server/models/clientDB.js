var clients=[];


exports.getAllClient=()=>{
    return clients;
}
exports.addClient=(client)=>{
    clients[`${client.userId}`]=client.socketId;
    // console.log(clients[client.userId]);
}
exports.getClientByUserId=(userId)=>{
    
    return clients[userId];
}