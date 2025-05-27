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
      console.log(data, "hha dataaaaa")
      return await this.create({
        conversationId: new mongoose.Types.ObjectId(data.conversationId as string),
        senderId: new mongoose.Types.ObjectId(data.senderId as string),
        messageType: data.messageType,
        content: data.content,
        fileUrl: data.fileUrl
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


  async deleteMessage(messageId: string): Promise<MessageEntityType | null> {
    try{

      const message = await this.update(messageId, {
        status: "deleted"
      })

      return message

    }catch(error){
        console.error("Error deleting message", error);
        throw new Error("Error deleting message");
    }
  }

  async findMessageById(messageId: string): Promise<MessageEntityType | null> {
    try{

      const message = await Message.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(messageId)
                }
            },
            {
                $lookup: {
                    from: 'Conversations',
                    localField: 'conversationId',
                    foreignField: '_id',
                    as: 'conversationId'
                }
            },
            {
                $unwind: {
                    path: "$conversationId"
                }
            }
        ])

        return message[0]
        
    }catch(error){
        console.error("Error finding message", error);
        throw new Error("Error deleting message");
    }
  }
}

export default new MessageRepository();
