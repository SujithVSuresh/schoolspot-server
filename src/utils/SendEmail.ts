import transporter from "../config/mail"
import { CustomError } from "./CustomError"
import Messages from "../constants/MessageConstants"
import HttpStatus from "../constants/StatusConstants"


export const sendOtpEmail = async (email: string, otp: number) => {
    try{

        const mailOptions = {
            from: 'sujithforcoding@gmail.com',
            to: email,
            subject: 'SchoolSpot OTP Verificaiton',
            html: `
          <h1>OTP Verification</h1>
          <p>Your OTP is: ${otp}</p>
          <p>Use this OTP to verify your email. Do not share it with anyone.</p><br />
          <p>If you did not request this verification, you can ignore this email.</p>
          <p>~ SchoolSpot</p>
            `
        }
    
        const info = await transporter.sendMail(mailOptions)
        console.log("OTP mail send successfully", info.response)
    }catch(err){
        console.error('Error sending verification email:', err);
        throw new CustomError(
            Messages.SERVER_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

}