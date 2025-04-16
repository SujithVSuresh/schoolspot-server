import { Server, Namespace, Socket } from "socket.io";
// import AnnouncementService from "../services/AnnouncementService.js";
// import ClassService from "../services/ClassService.js";
import { ClassService } from "../services/implementation/ClassService";
import ClassRepository from "../repositories/implementaion/ClassRepository";
import TeacherRepository from "../repositories/implementaion/TeacherRepository";
import AnnouncementRepository from "../repositories/implementaion/AnnouncementRepository";
import AttendanceRepository from "../repositories/implementaion/AttendanceRepository";
import StudentRepository from "../repositories/implementaion/StudentRepository";

interface AuthPayload {
  userId: string;
  role: "student" | "teacher" | "admin";
  schoolId: string;
}

interface SendAnnouncementPayload {
  classId: string;
  title: string;
  message: string;
  createdBy: string;
}

const classService = new ClassService(
  ClassRepository,
  TeacherRepository,
  AnnouncementRepository,
  AttendanceRepository,
  StudentRepository
);

const setupAnnouncementNamespace = (io: Server) => {
  const announcementNamespace: Namespace = io.of("/announcements");

  announcementNamespace.on("connection", async (socket: Socket) => {
    const { userId, role, schoolId } = socket.handshake.auth;

    if (!userId || !role) {
      console.log("Invalid socket auth");
      socket.disconnect();
      return;
    }

    const classIds: { name: string; section: string; id: string }[] =
      await classService.getClassIdsForUsers(userId, role, schoolId);

    classIds.forEach((classId) => {
      socket.join(`class-${classId}`);
    });

    console.log(`✅ ${role} ${userId} joined rooms:`, classIds);

    // socket.on("send_announcement", async (data: SendAnnouncementPayload) => {
    //   const { classId, title, message, createdBy } = data;

    //   const announcement = await AnnouncementService.createAnnouncement({
    //     classId,
    //     title,
    //     message,
    //     createdBy,
    //   });

    //   announcementNamespace.to(`class-${classId}`).emit("new_announcement", announcement);
    // });

    socket.on("disconnect", () => {
      console.log(`❌ [Socket Disconnected]: ${socket.id}`);
    });
  });
};

export default setupAnnouncementNamespace;
