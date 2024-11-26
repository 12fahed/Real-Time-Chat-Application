import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_KEY
    }
});

export const sendSuccessMail = (name, receiverEmail, password) =>{

    const message = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
        <h2 style="color: #4A90E2; margin-bottom: 15px;">Welcome to Chat App!</h2>
        <p style="font-size: 14px;">
            Hello <strong>${name}</strong>,
        </p>
        <p style="font-size: 14px; margin-bottom: 10px;">
            We are thrilled to have you onboard. Here are your login credentials to access your account:
        </p>
        <p style="font-size: 14px; margin-bottom: 10px;">
            <strong>Email:</strong> ${receiverEmail}<br />
            <strong>Password:</strong> ${password}
        </p>
        <p style="font-size: 14px; margin-bottom: 20px;">
            Please keep your credentials secure and do not share them with anyone. You can update your password anytime from your profile settings.
        </p>
        <p style="font-size: 12px; color: #555;">
            If you have any questions or need assistance, feel free to reach out to our support team.
        </p>
        <p style="font-size: 14px; color: #4A90E2; margin-top: 20px;">
            Happy chatting!<br />
            The Chat App Team
        </p>
    </div>`

    var mailOptions = {
        from: ` "Chat App" <${process.env.EMAIL}>`,
        to: receiverEmail,
        subject: 'Welcome to Chat App',
        text: 'Hello and Welcome to Chat App, your key',
        html: message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });    


}

export const sendOTPmail = (receiverEmail, otp) =>{

    const message = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #4A90E2; margin-bottom: 15px;">Your OTP for Chat App</h2>
        <p style="font-size: 14px;">
            Hello <strong>${receiverEmail}</strong>,
        </p>
        <p style="font-size: 14px; margin-bottom: 10px;">
            Thank you for using Chat App! To continue, please use the One-Time Password (OTP) provided below to verify your identity:
        </p>
        <p style="font-size: 24px; font-weight: bold; color: #4A90E2; margin-bottom: 20px; text-align: center;">
            ${otp}
        </p>
        <p style="font-size: 14px; margin-bottom: 20px;">
            This OTP is valid for the next 5 minutes. If you did not request this, please ignore this email.
        </p>
        <p style="font-size: 12px; color: #555;">
            Need help? Contact our support team for assistance.
        </p>
        <p style="font-size: 14px; color: #4A90E2; margin-top: 20px;">
            Best regards,<br />
            The Chat App Team
        </p>
    </div>`;


    var mailOptions = {
        from: ` "Chat App" <${process.env.EMAIL}>`,
        to: receiverEmail,
        subject: 'OTP For Chat App',
        text: 'OTP For Chat App',
        html: message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });  

}