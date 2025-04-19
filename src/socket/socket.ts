import { Server } from "socket.io";


export class SocketManager {
    private io: Server

    constructor(io: Server){
        this.io = io
    }

    public initialize(){
        this.setupAnnouncement()
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
        
            socket.on('disconnect', () => {
              console.log('User disconnected from /announcement:', socket.id);
            });
          });
    }
}


