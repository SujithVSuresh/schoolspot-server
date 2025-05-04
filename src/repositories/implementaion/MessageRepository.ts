import { MessageEntityType, MessageWithUserEntityType } from "../../types/ChatType";
import { IMessageRepository } from "../interface/IMessageRepository";
import { BaseRepository } from "./BaseRepository";
import Message from "../../models/Message";
import mongoose from "mongoose";

class MessageRepository
  extends BaseRepository<MessageEntityType>
  implements IMessageRepository
{
  constructor() {
    super(Message);
  }

  async createMessage(data: MessageEntityType): Promise<MessageEntityType> {
    try {
      return await this.create({
        conversationId: new mongoose.Types.ObjectId(data.conversationId),
        senderId: new mongoose.Types.ObjectId(data.senderId as string),
        messageType: data.messageType,
        content: data.content,
      });
    } catch (error) {
      console.error("Error creating message", error);
      throw new Error("Error creating message");
    }
  }

  async findMessaagesByConversationId(conversationId: string): Promise<MessageWithUserEntityType[]>{
    try {
        const messages = await Message.aggregate([
            {
                $match: {
                    conversationId: new mongoose.Types.ObjectId(conversationId)
                }
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'senderId',
                    foreignField: '_id',
                    as: 'senderId'
                }
            },
            {
                $unwind: {
                    path: "$senderId"
                }
            }
        ])

        return messages
        
      
      } catch (error) {
        console.error("Error creating message", error);
        throw new Error("Error creating message");
      }
  }
}

export default new MessageRepository();
