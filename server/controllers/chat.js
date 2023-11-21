const chat = (io) => {
    io.use((socket, next) => {
        const username = socket.handshake.auth.username;
        console.log("username on handshake",username)
        if(!username){
            return next(new Error("Invalid Username"))
        }
        socket.username= username
        next();
    });
    io.on("connection", (socket) => {
        console.log("socket.id", socket.id)
       let users=[]
        for(let [id,socket] of io.of('/').sockets){
            console.log("idd",id)
            const existingUser = users.find((u)=>u.username===socket.username)
            if(existingUser){
             socket.emit("username taken")
             socket.disconnect();
             return
            }else{
               users.push({
                   userID:id,
                   username: socket.username
               })
            }
        }
        socket.emit("users",users);
        socket.broadcast.emit('User connected',{
            userID:socket.id,
            username:socket.username
        })
        socket.on("message", (data) => {
            io.emit("message", data)
        })

        socket.on("typing",(username)=>{
            socket.broadcast.emit("typing",`${username} is typing`)
        })
        socket.on('private message',({message,to})=>{
            socket.to(to).emit("private message",{
                message,
                from:socket.id,
                name:socket.username
            })
        })
        socket.on('disconnect', () => {
            socket.broadcast.emit("user disconnected",socket.id)
            console.log("user disconnected")
        });


    });

}
export default chat