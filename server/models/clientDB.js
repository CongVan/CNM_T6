var clients = {};
exports.getAllClient = () => {
    return clients;
}
exports.addClient = (client) => {

    // var cli = clients.filter(c => { c.userId == client.userId });
    // if (cli) {
    //     clients[clients.indexOf(cli)] = client;
    //     // clients.push(client);
    // } else {
    //     clients.push(client);

    // }
     clients[`${client.userId}`]=client.socketId;
    // console.log(clients[client.userId]);
}
// exports.removeClient=(socketId)=>{
//     clients.splice(clients.indexOf(socketId),1);
//     // clients[`${client.userId}`]=client.socketId;
//     // console.log(clients[client.userId]);
// }
exports.getClientByUserId = (userId) => {
    // var client =null; //clients.filter((c,i,cls) => { return c.userId == userId; });
    // console.log('length',clients.length);
    // for (const c of clients) {
    //     console.log(c);
    //     if(c.userId==userId){
    //         client=c;
    //         return c;
    //     }
    // }
    // console.log('clientFind', client, clients);
    
    // return client.socketId;
    return clients[userId];
}
