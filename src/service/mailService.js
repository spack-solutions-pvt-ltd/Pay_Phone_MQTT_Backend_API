
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSKEY,
    },
});


const sendManufacturerForgotPasswordEmail = async (email, token) => {
    const resetLink = `https://mqttsuperadmin.sseiot.in/auth/reset-password?token=${token}`;

    const mailOptions = {
        from: `"Support Team" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Reset Your Password",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Password Reset</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
            
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:40px 0;">
                <tr>
                    <td align="center">
                        
                        <table width="600" cellpadding="0" cellspacing="0" 
                            style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                            
                            <!-- Header -->
                            <tr>
                                <td align="center" 
                                    style="background:#0f172a; padding:30px;">
                                    <h1 style="color:#ffffff; margin:0; font-size:28px;">
                                        Password Reset
                                    </h1>
                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td style="padding:40px 30px; color:#333333;">
                                    
                                    <h2 style="margin-top:0; color:#111827;">
                                        Hello,
                                    </h2>

                                    <p style="font-size:16px; line-height:1.6; color:#4b5563;">
                                        We received a request to reset your password.
                                        Click the button below to create a new password.
                                    </p>

                                    <!-- Button -->
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td align="center" style="padding:30px 0;">
                                                <a href="${resetLink}"
                                                    style="
                                                        background:#2563eb;
                                                        color:#ffffff;
                                                        text-decoration:none;
                                                        padding:14px 30px;
                                                        border-radius:6px;
                                                        display:inline-block;
                                                        font-size:16px;
                                                        font-weight:bold;
                                                    ">
                                                    Reset Password
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="font-size:14px; line-height:1.6; color:#6b7280;">
                                        This password reset link will expire shortly for security reasons.
                                    </p>

                                    <p style="font-size:14px; line-height:1.6; color:#6b7280;">
                                        If you did not request a password reset, you can safely ignore this email.
                                    </p>

                                    <!-- Fallback Link -->
                                    <p style="font-size:14px; line-height:1.6; color:#6b7280;">
                                        If the button above does not work, copy and paste the following link into your browser:
                                    </p>

                                    <p style="word-break:break-all; font-size:13px; color:#2563eb;">
                                        ${resetLink}
                                    </p>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td align="center" 
                                    style="background:#f9fafb; padding:20px; font-size:13px; color:#9ca3af;">
                                    
                                    © ${new Date().getFullYear()} Your Company Name.  
                                    All rights reserved.
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Forgot password email sent successfully");
    } catch (error) {
        console.error("Error sending forgot password email:", error);
    }
};

const sendDistributorForgotPasswordEmail = async (email, token) => {
    const resetLink = `https://mqttadmin.sseiot.in/auth/reset-password?token=${token}`;

    const mailOptions = {
        from: `"Support Team" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Reset Your Password",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Password Reset</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
            
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:40px 0;">
                <tr>
                    <td align="center">
                        
                        <table width="600" cellpadding="0" cellspacing="0" 
                            style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                            
                            <!-- Header -->
                            <tr>
                                <td align="center" 
                                    style="background:#0f172a; padding:30px;">
                                    <h1 style="color:#ffffff; margin:0; font-size:28px;">
                                        Password Reset
                                    </h1>
                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td style="padding:40px 30px; color:#333333;">
                                    
                                    <h2 style="margin-top:0; color:#111827;">
                                        Hello,
                                    </h2>

                                    <p style="font-size:16px; line-height:1.6; color:#4b5563;">
                                        We received a request to reset your password.
                                        Click the button below to create a new password.
                                    </p>

                                    <!-- Button -->
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td align="center" style="padding:30px 0;">
                                                <a href="${resetLink}"
                                                    style="
                                                        background:#2563eb;
                                                        color:#ffffff;
                                                        text-decoration:none;
                                                        padding:14px 30px;
                                                        border-radius:6px;
                                                        display:inline-block;
                                                        font-size:16px;
                                                        font-weight:bold;
                                                    ">
                                                    Reset Password
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="font-size:14px; line-height:1.6; color:#6b7280;">
                                        This password reset link will expire shortly for security reasons.
                                    </p>

                                    <p style="font-size:14px; line-height:1.6; color:#6b7280;">
                                        If you did not request a password reset, you can safely ignore this email.
                                    </p>

                                    <!-- Fallback Link -->
                                    <p style="font-size:14px; line-height:1.6; color:#6b7280;">
                                        If the button above does not work, copy and paste the following link into your browser:
                                    </p>

                                    <p style="word-break:break-all; font-size:13px; color:#2563eb;">
                                        ${resetLink}
                                    </p>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td align="center" 
                                    style="background:#f9fafb; padding:20px; font-size:13px; color:#9ca3af;">
                                    
                                    © ${new Date().getFullYear()} Your Company Name.  
                                    All rights reserved.
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Forgot password email sent successfully");
    } catch (error) {
        console.error("Error sending forgot password email:", error);
    }
};
const sendOperatorForgotPasswordEmail = async (email, token) => {
    const resetLink = `https://mqttuser.sseiot.in/auth/reset-password?token=${token}`;

    const mailOptions = {
        from: `"Support Team" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Reset Your Password",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Password Reset</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
            
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:40px 0;">
                <tr>
                    <td align="center">
                        
                        <table width="600" cellpadding="0" cellspacing="0" 
                            style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                            
                            <!-- Header -->
                            <tr>
                                <td align="center" 
                                    style="background:#0f172a; padding:30px;">
                                    <h1 style="color:#ffffff; margin:0; font-size:28px;">
                                        Password Reset
                                    </h1>
                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td style="padding:40px 30px; color:#333333;">
                                    
                                    <h2 style="margin-top:0; color:#111827;">
                                        Hello,
                                    </h2>

                                    <p style="font-size:16px; line-height:1.6; color:#4b5563;">
                                        We received a request to reset your password.
                                        Click the button below to create a new password.
                                    </p>

                                    <!-- Button -->
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td align="center" style="padding:30px 0;">
                                                <a href="${resetLink}"
                                                    style="
                                                        background:#2563eb;
                                                        color:#ffffff;
                                                        text-decoration:none;
                                                        padding:14px 30px;
                                                        border-radius:6px;
                                                        display:inline-block;
                                                        font-size:16px;
                                                        font-weight:bold;
                                                    ">
                                                    Reset Password
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="font-size:14px; line-height:1.6; color:#6b7280;">
                                        This password reset link will expire shortly for security reasons.
                                    </p>

                                    <p style="font-size:14px; line-height:1.6; color:#6b7280;">
                                        If you did not request a password reset, you can safely ignore this email.
                                    </p>

                                    <!-- Fallback Link -->
                                    <p style="font-size:14px; line-height:1.6; color:#6b7280;">
                                        If the button above does not work, copy and paste the following link into your browser:
                                    </p>

                                    <p style="word-break:break-all; font-size:13px; color:#2563eb;">
                                        ${resetLink}
                                    </p>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td align="center" 
                                    style="background:#f9fafb; padding:20px; font-size:13px; color:#9ca3af;">
                                    
                                    © ${new Date().getFullYear()} Your Company Name.  
                                    All rights reserved.
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Forgot password email sent successfully");
    } catch (error) {
        console.error("Error sending forgot password email:", error);
    }
};

const sendDistributorCredentialsEmail = async ({ email, dummyPassword, name }) => {

    const loginUrl = "https://mqttadmin.sseiot.in ";

    const mailOptions = {
        from: `"SSEIOT Support Team" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Your Distributor Account Credentials",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Distributor Account Credentials</title>
        </head>

        <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0; background-color:#f3f4f6;">
                <tr>
                    <td align="center">

                        <table width="620" cellpadding="0" cellspacing="0"
                            style="
                                background:#ffffff;
                                border-radius:12px;
                                overflow:hidden;
                                box-shadow:0 4px 12px rgba(0,0,0,0.08);
                            ">

                            <!-- Header -->
                            <tr>
                                <td align="center"
                                    style="
                                        background:linear-gradient(90deg,#0f172a,#1e293b);
                                        padding:35px 20px;
                                    ">
                                    
                                    <h1 style="
                                        margin:0;
                                        color:#ffffff;
                                        font-size:30px;
                                        font-weight:bold;
                                    ">
                                        Welcome to SSEIOT Distributor Portal
                                    </h1>

                                    <p style="
                                        margin:10px 0 0;
                                        color:#cbd5e1;
                                        font-size:15px;
                                    ">
                                        Your distributor account has been created successfully.
                                    </p>
                                </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                                <td style="padding:40px 35px;">

                                    <h2 style="
                                        margin-top:0;
                                        color:#111827;
                                        font-size:24px;
                                    ">
                                        Hello ${name},
                                    </h2>

                                    <p style="
                                        font-size:16px;
                                        line-height:1.7;
                                        color:#4b5563;
                                        margin-bottom:25px;
                                    ">
                                        We are pleased to inform you that your distributor account is now active.
                                        Below are your login credentials for accessing the distributor dashboard.
                                    </p>

                                    <!-- Credentials Box -->
                                    <table width="100%" cellpadding="0" cellspacing="0"
                                        style="
                                            background:#f9fafb;
                                            border:1px solid #e5e7eb;
                                            border-radius:10px;
                                            padding:20px;
                                        ">

                                        <tr>
                                            <td style="padding-bottom:15px;">
                                                <span style="
                                                    font-size:14px;
                                                    color:#6b7280;
                                                    font-weight:bold;
                                                ">
                                                    LOGIN URL
                                                </span>

                                                <p style="
                                                    margin:5px 0 0;
                                                    font-size:16px;
                                                    color:#2563eb;
                                                    word-break:break-all;
                                                ">
                                                    ${loginUrl}
                                                </p>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding-bottom:15px;">
                                                <span style="
                                                    font-size:14px;
                                                    color:#6b7280;
                                                    font-weight:bold;
                                                ">
                                                    EMAIL ADDRESS
                                                </span>

                                                <p style="
                                                    margin:5px 0 0;
                                                    font-size:16px;
                                                    color:#111827;
                                                ">
                                                    ${email}
                                                </p>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <span style="
                                                    font-size:14px;
                                                    color:#6b7280;
                                                    font-weight:bold;
                                                ">
                                                    TEMPORARY PASSWORD
                                                </span>

                                                <p style="
                                                    margin:5px 0 0;
                                                    font-size:16px;
                                                    color:#111827;
                                                    font-weight:bold;
                                                    letter-spacing:1px;
                                                ">
                                                    ${dummyPassword}
                                                </p>
                                            </td>
                                        </tr>

                                    </table>

                                    <!-- Button -->
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td align="center" style="padding:35px 0 10px;">

                                                <a href="${loginUrl}"
                                                    style="
                                                        display:inline-block;
                                                        background:#2563eb;
                                                        color:#ffffff;
                                                        text-decoration:none;
                                                        padding:14px 32px;
                                                        border-radius:8px;
                                                        font-size:16px;
                                                        font-weight:bold;
                                                    ">
                                                    Login to Dashboard
                                                </a>

                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Security Note -->
                                    <p style="
                                        margin-top:30px;
                                        font-size:14px;
                                        line-height:1.7;
                                        color:#6b7280;
                                    ">
                                        For security reasons, we strongly recommend changing your password
                                        after your first login.
                                    </p>

                                    <p style="
                                        font-size:14px;
                                        line-height:1.7;
                                        color:#6b7280;
                                    ">
                                        If you have any questions or need assistance, please contact our support team.
                                    </p>

                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td align="center"
                                    style="
                                        background:#f9fafb;
                                        padding:25px 20px;
                                        border-top:1px solid #e5e7eb;
                                    ">

                                    <p style="
                                        margin:0;
                                        font-size:13px;
                                        color:#9ca3af;
                                    ">
                                        © ${new Date().getFullYear()} SSEIOT Distributor Portal.
                                        All rights reserved.
                                    </p>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Distributor credentials email sent successfully");
    } catch (error) {
        console.error("Error sending distributor credentials email:", error);
    }
};
const sendOperatorCredentialsEmail = async ({ email, password, name }) => {

    const loginUrl = "https://mqttuser.sseiot.in";

    const mailOptions = {
        from: `"SSEIOT Support Team" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Welcome to SSEIOT Operator Portal - Your Login Credentials",
        html: `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Operator Account Credentials</title>
        </head>

        <body style="
            margin:0;
            padding:0;
            background-color:#f3f4f6;
            font-family:Arial, Helvetica, sans-serif;
        ">

            <table width="100%" cellpadding="0" cellspacing="0" 
                style="background-color:#f3f4f6; padding:40px 0;">

                <tr>
                    <td align="center">

                        <table width="620" cellpadding="0" cellspacing="0"
                            style="
                                background:#ffffff;
                                border-radius:12px;
                                overflow:hidden;
                                box-shadow:0 4px 12px rgba(0,0,0,0.08);
                            ">

                            <!-- Header -->
                            <tr> 
                                <td align="center" style=" background:#020617; padding:45px 25px; border-bottom:1px solid #1e293b; "> <h1 style=" margin:0; color:#ffffff; font-size:32px; font-weight:700; letter-spacing:0.5px; "> SSEIOT </h1> 
                                    <p style=" margin:12px 0 0; color:#94a3b8; font-size:15px; line-height:1.6; "> Operator Portal Access Credentials </p>
                                </td>
                             </tr>

                            <!-- Body -->
                            <tr>
                                <td style="padding:40px 35px;">

                                    <h2 style="
                                        margin-top:0;
                                        color:#111827;
                                        font-size:24px;
                                    ">
                                        Hello ${name},
                                    </h2>

                                    <p style="
                                        font-size:16px;
                                        line-height:1.7;
                                        color:#4b5563;
                                        margin-bottom:25px;
                                    ">
                                        Welcome to the SSEIOT Operator Portal.
                                        Your account is now active and ready to use.
                                        Please find your login credentials below.
                                    </p>

                                    <!-- Credentials Box -->
                                    <table width="100%" cellpadding="0" cellspacing="0"
                                        style="
                                            background:#f9fafb;
                                            border:1px solid #e5e7eb;
                                            border-radius:10px;
                                            padding:20px;
                                        ">

                                        <tr>
                                            <td style="padding-bottom:18px;">

                                                <span style="
                                                    font-size:13px;
                                                    color:#6b7280;
                                                    font-weight:bold;
                                                ">
                                                    LOGIN URL
                                                </span>

                                                <p style="
                                                    margin:6px 0 0;
                                                    font-size:16px;
                                                    color:#2563eb;
                                                    word-break:break-all;
                                                ">
                                                    ${loginUrl}
                                                </p>

                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding-bottom:18px;">

                                                <span style="
                                                    font-size:13px;
                                                    color:#6b7280;
                                                    font-weight:bold;
                                                ">
                                                    EMAIL ADDRESS
                                                </span>

                                                <p style="
                                                    margin:6px 0 0;
                                                    font-size:16px;
                                                    color:#111827;
                                                ">
                                                    ${email}
                                                </p>

                                            </td>
                                        </tr>

                                        <tr>
                                            <td>

                                                <span style="
                                                    font-size:13px;
                                                    color:#6b7280;
                                                    font-weight:bold;
                                                ">
                                                    TEMPORARY PASSWORD
                                                </span>

                                                <p style="
                                                    margin:6px 0 0;
                                                    font-size:16px;
                                                    color:#111827;
                                                    font-weight:bold;
                                                    letter-spacing:1px;
                                                ">
                                                    ${password}
                                                </p>

                                            </td>
                                        </tr>

                                    </table>

                                    <!-- Login Button -->
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td align="center" style="padding:35px 0 15px;">

                                                <a href="${loginUrl}"
                                                    target="_blank"
                                                    style="
                                                        display:inline-block;
                                                        background:#2563eb;
                                                        color:#ffffff;
                                                        text-decoration:none;
                                                        padding:14px 32px;
                                                        border-radius:8px;
                                                        font-size:16px;
                                                        font-weight:bold;
                                                    ">
                                                    Login to Operator Portal
                                                </a>

                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Security Note -->
                                    <p style="
                                        margin-top:25px;
                                        font-size:14px;
                                        line-height:1.7;
                                        color:#6b7280;
                                    ">
                                        For security purposes, we recommend changing your password
                                        immediately after logging in.
                                    </p>

                                    <p style="
                                        font-size:14px;
                                        line-height:1.7;
                                        color:#6b7280;
                                    ">
                                        If you did not expect this account creation email,
                                        please contact the support team immediately.
                                    </p>

                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td align="center"
                                    style="
                                        background:#f9fafb;
                                        border-top:1px solid #e5e7eb;
                                        padding:25px 20px;
                                    ">

                                    <p style="
                                        margin:0;
                                        font-size:13px;
                                        color:#9ca3af;
                                    ">
                                        © ${new Date().getFullYear()} SSEIOT Operator Portal.
                                        All rights reserved.
                                    </p>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>

            </table>

        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Operator credentials email sent successfully");
    } catch (error) {
        console.error("Error sending operator credentials email:", error);
    }
};

module.exports = {
    transporter,
    sendManufacturerForgotPasswordEmail,
    sendDistributorForgotPasswordEmail,
    sendOperatorForgotPasswordEmail,
    sendOperatorCredentialsEmail,
    sendDistributorCredentialsEmail,
};