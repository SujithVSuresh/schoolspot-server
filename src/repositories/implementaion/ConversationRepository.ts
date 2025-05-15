import { ConversationEntityType } from "../../types/ChatType";
import { IConversationRepository } from "../interface/IConversationRepository";
import { BaseRepository } from "./BaseRepository";
import Conversation from "../../models/Conversation";
import mongoose from "mongoose";

class ConversationRepository extends BaseRepository<ConversationEntityType> implements IConversationRepository {

    constructor(){
        super(Conversation)
    }

    async createConversation(data: ConversationEntityType): Promise<ConversationEntityType> {
            try {
                return await this.create(data)
            } catch (error) {
              console.error("Error creating conversation", error);
              throw new Error("Error creating conversation");
            }
    }

    async findConversationById(id: string): Promise<ConversationEntityType | null> {
            try {
                return await this.findById(id)
            } catch (error) {
              console.error("Error creating conversation", error);
              throw new Error("Error creating conversation");
            }
    }


    async deleteConversation(id: string): Promise<ConversationEntityType | null> {
        try {
            return await this.update(id, {
                status: "deleted"
            })
        } catch (error) {
          console.error("Error deleting conversation", error);
          throw new Error("Error deleting conversation");
        }
    }


    async updateConversation(id: string, data: Partial<ConversationEntityType>): Promise<ConversationEntityType | null> {
        try {
            return await this.update(id, data)
        } catch (error) {
          console.error("Error updating conversation", error);
          throw new Error("Error updating conversation");
        }
    }

    async findConversations(subjectId?: string, userId?: string): Promise<ConversationEntityType[]>{
        try{

            const query: any = {}

            if(subjectId){
                query.subjectId = new mongoose.Types.ObjectId(subjectId)
            }

            if(userId){
                query.participants = new mongoose.Types.ObjectId(userId)
            }

            const conversations = await Conversation.aggregate([
                {
                    $match: query
                },
                {
                    $lookup: {
                      from: "Messages",
                      localField: "lastMessage",
                      foreignField: "_id",
                      as: "lastMessage",
                    },
                },
                {
                    $unwind: {
                        path: "$lastMessage",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                      sortTime: { $ifNull: ["$lastMessage.createdAt", "$createdAt"] }
                    }
                  },
                  {
                    $sort: {
                      sortTime: -1
                    }
                  }
            ])

            return conversations

        }catch(error){
            console.error("Error fetching conversations", error);
            throw new Error("Error fetching conversations");
        }
    }

}


export default new ConversationRepository()