import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sujithforcoding@gmail.com',
        pass: 'zhbu jqil iook ulqz'
    }
})

export default transporter