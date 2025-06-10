import { SocketManager } from "../socket/socket";
let socketManagerInstance: SocketManager | null = null;

export const setSocketManager = (instance: SocketManager) => {
  socketManagerInstance = instance;
};

export const getSocketManager = (): SocketManager => {
  if (!socketManagerInstance) {
    throw new Error("SocketManager instance not initialized yet!");
  }
  return socketManagerInstance;
};
