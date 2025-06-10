import { Server } from "socket.io";

export class SocketManager {
  private io: Server;
  private notificationNamespace: ReturnType<Server['of']>;


  constructor(io: Server) {
    this.io = io;
    this.notificationNamespace = this.io.of("/notification");
  }

  public initialize() {
    this.setupAnnouncement();
    this.setupChat();
    this.setupNotification();
  }

  setupAnnouncement() {
    const announcementNamespace = this.io.of("/announcement");
    announcementNamespace.on("connection", (socket) => {
      console.log("User connected to /announcement:", socket.id);

      socket.on("join-room", (roomId: string) => {
        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`);
      });

      socket.on("leave-room", (roomId: string) => {
        socket.leave(roomId);
        console.log(`${socket.id} left room ${roomId}`);
      });

      socket.on("send-announcement", ({ roomId, message }) => {
        console.log(`Message from ${socket.id} to room ${roomId}: ${message}`);
        socket.to(roomId).emit("receive-announcement", message);
      });

      socket.on("edit-announcement", ({ roomId, message }) => {
        console.log(
          `Edit message from ${socket.id} to room ${roomId}: ${message}`
        );
        socket.to(roomId).emit("receive-edit-announcement", message);
      });

      socket.on("delete-announcement", ({ roomId, message }) => {
        console.log(
          `Delete message from ${socket.id} to room ${roomId}: ${message}`
        );
        socket.to(roomId).emit("receive-delete-announcement", message);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected from /announcement:", socket.id);
      });
    });
  }

  setupChat() {
    const userSocketMap = new Map<string, string>();

    const chatNameSpace = this.io.of("/chat");

    chatNameSpace.on("connection", (socket) => {
      console.log("User connected to /chat:", socket.id);

      socket.on("register-user", (userId: string) => {
        userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
      });

      socket.on("join-room", (roomId: string) => {
        socket.join(roomId);
        console.log(`${socket.id} joined conversation room ${roomId}`);
      });

      socket.on("leave-room", (roomId: string) => {
        socket.leave(roomId);
        console.log(`${socket.id} left room ${roomId}`);
      });

      socket.on("send-message", ({ roomId, message }) => {
        console.log(
          `Message from ${socket.id} to message room ${roomId}: ${message}`
        );
        socket.to(roomId).emit("receive-message", message);
      });

      socket.on("create-conversation", ({ roomId, message }) => {
        // console.log(
        //   `Create conversation message from ${socket.id} to message room ${roomId}: ${message}`
        // );
        // console.log("participants", message.participants)
        // socket.to(roomId).emit("receive-create-conversation", message);

        message.participants.forEach((memberId: string) => {
          const memberSocketId = userSocketMap.get(memberId);
          console.log(memberSocketId, "socker id of users")
          if (memberSocketId) {
            // Get the socket instance by id
            const memberSocket = chatNameSpace.sockets.get(memberSocketId);

            console.log(memberSocket, "member socket instance")
            if (memberSocket) {
              memberSocket.join(roomId);
              console.log(`User ${memberId} joined room ${roomId}`);

              // Notify them about the new group
              memberSocket.emit("receive-create-conversation", message);
            }
          }
        });
      });

      socket.on("disconnect", () => {
        for (const [uid, sid] of userSocketMap.entries()) {
          if (sid === socket.id) {
            userSocketMap.delete(uid);
            break;
          }
        }
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  setupNotification() {

    this.notificationNamespace.on("connection", (socket) => {
      console.log("User connected to /notification:", socket.id);

      socket.on("join-room", (roomId: string) => {
        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`);
      });

      socket.on("leave-room", (roomId: string) => {
        socket.leave(roomId);
        console.log(`${socket.id} left room ${roomId}`);
      });
    });
  }

  public emitNotification(roomId: string, message: any) {
    this.notificationNamespace.to(roomId).emit("receive-notification", message);
  }

}
