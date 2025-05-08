import { Server } from "socket.io";


export class SocketManager {
    private io: Server

    constructor(io: Server){
        this.io = io
    }

    public initialize(){
        this.setupAnnouncement()
        this.setupChat()
        this.setupNotification()
    }

    setupAnnouncement(){
        const announcementNamespace = this.io.of("/announcement")
        announcementNamespace.on('connection', (socket) => {
            console.log('User connected to /announcement:', socket.id);

            socket.on('join-room', (roomId: string) => {
                socket.join(roomId);
                console.log(`${socket.id} joined room ${roomId}`);
            });

            socket.on('leave-room', (roomId: string) => {
                socket.leave(roomId);
                console.log(`${socket.id} left room ${roomId}`);
            });

            socket.on('send-announcement', ({ roomId, message }) => {
                console.log(`Message from ${socket.id} to room ${roomId}: ${message}`);
                socket.to(roomId).emit('receive-announcement', message);
            });

            socket.on('edit-announcement', ({ roomId, message }) => {
                console.log(`Edit message from ${socket.id} to room ${roomId}: ${message}`);
                socket.to(roomId).emit('receive-edit-announcement', message);
            });

            socket.on('delete-announcement', ({ roomId, message }) => {
                console.log(`Delete message from ${socket.id} to room ${roomId}: ${message}`);
                socket.to(roomId).emit('receive-delete-announcement', message);
            });
        
            socket.on('disconnect', () => {
              console.log('User disconnected from /announcement:', socket.id);
            });
          });
    }

    setupChat(){
        const chatNameSpace = this.io.of("/chat")

        chatNameSpace.on('connection', (socket) => {
            console.log('User connected to /chat:', socket.id)

            socket.on('join-room', (roomId: string) => {
                socket.join(roomId);
                console.log(`${socket.id} joined conversation room ${roomId}`);
            });

            socket.on('leave-room', (roomId: string) => {
                socket.leave(roomId);
                console.log(`${socket.id} left room ${roomId}`);
            });

            socket.on('send-message', ({ roomId, message }) => {
                console.log(`Message from ${socket.id} to message room ${roomId}: ${message}`);
                socket.to(roomId).emit('receive-message', message);
            });
        })
    }


    setupNotification(){
        const chatNameSpace = this.io.of("/notification")

        chatNameSpace.on('connection', (socket) => {
            console.log('User connected to /notification:', socket.id)

            socket.on('join-room', (roomId: string) => {
                socket.join(roomId);
                console.log(`${socket.id} joined room ${roomId}`);
            });

            socket.on('leave-room', (roomId: string) => {
                socket.leave(roomId);
                console.log(`${socket.id} left room ${roomId}`);
            });

            socket.on('send-notification', ({ roomId, message }) => {
                console.log("jaaaaaaaaaaaaaaaaaa", message)
                console.log(`Message from ${socket.id} to room ${roomId}: ${message}`);
                socket.to(roomId).emit('receive-notification', message);
            });
        })
    }
}


