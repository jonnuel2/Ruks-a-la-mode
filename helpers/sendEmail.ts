import nodemailer from "nodemailer"

export async function sendEmail(email: string, verificationLink: string, firstName: string) {
  try {
    console.log("Setting up email transporter with:", {
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
    })

    // Create a test account if using Ethereal
    let testAccount
    let transporter

    if (process.env.SMTP_HOST === "smtp.ethereal.email") {
      console.log("Using Ethereal for testing - creating test account")
      testAccount = await nodemailer.createTestAccount()

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      })

      console.log("Created Ethereal test account:", testAccount.user)
    } else {
      // Use configured SMTP settings
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
              body {
                  font-family: 'Montserrat', Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5;
              }
              .email-wrapper {
                  width: 100%;
                  background-color: #f5f5f5;
                  padding: 20px 0;
              }
              .email-container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
              }
              .logo-header {
                  background-color: #000000;
                  padding: 20px;
                  text-align: center;
              }
              .brand-name {
                  color: #ffffff;
                  font-weight: 700;
                  font-size: 24px;
              }
              .verification-header {
                  background-color: #f8f8f8;
                  padding: 15px;
                  text-align: center;
                  font-weight: 600;
                  color: #333333;
                  border-bottom: 1px solid #eeeeee;
              }
              .email-body {
                  padding: 30px;
                  color: #333333;
              }
              .greeting-section, .verification-section, .support-section {
                  margin-bottom: 25px;
              }
              h2 {
                  color: #000000;
                  margin-top: 0;
              }
              .verification-button {
                  display: inline-block;
                  background-color: #000000;
                  color: #ffffff !important;
                  text-decoration: none;
                  padding: 12px 30px;
                  border-radius: 4px;
                  font-weight: 600;
                  margin: 15px 0;
              }
              .verification-code {
                  background-color: #f5f5f5;
                  padding: 12px;
                  border-radius: 4px;
                  word-break: break-all;
                  margin: 10px 0;
                  font-size: 14px;
              }
              .email-footer {
                  background-color: #f8f8f8;
                  padding: 15px;
                  text-align: center;
                  font-size: 12px;
                  color: #666666;
                  border-top: 1px solid #eeeeee;
              }
              a {
                  color: #000000;
                  text-decoration: underline;
              }
          </style>
      </head>
      <body>
          <div class="email-wrapper">
              <div class="email-container">
                  <div class="logo-header">
                      <div class="logo"><span class="brand-name">RUKS Á LA MODE</span></div>
                  </div>
                  <div class="verification-header">EMAIL VERIFICATION REQUIRED</div>
                  <div class="email-body">
                      <div class="greeting-section">
                          <h2>Verify Your Email Address</h2>
                          <p>Hello ${firstName}! Please verify that this is your email address:</p>
                          <p><strong>${email}</strong></p>
                      </div>
                      <div class="verification-section">
                          <p>Click the button below to verify your email:</p>
                          <a href="${verificationLink}" class="verification-button" target="_blank">VERIFY EMAIL</a>
                          <p>Or copy and paste this link into your browser:</p>
                          <div class="verification-code">${verificationLink}</div>
                          <p>This verification link will expire in 24 hours.</p>
                      </div>
                      <div class="support-section">
                          <p>If you didn't request this email, you can safely ignore it.</p>
                          <p>Need help? Contact us at <a href="mailto:support@ruksalamode.com">support@ruksalamode.com</a></p>
                      </div>
                  </div>
                  <div class="email-footer">
                      <p>&copy; 2025 <span class="brand-name">RUKS Á LA MODE</span>. All Rights Reserved.</p>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"RUKS Á LA MODE" <no-reply@ruksalamode.com>',
      to: email,
      subject: "Email Verification Required",
      html: htmlContent,
    }

    console.log("Sending email to:", email)
    const info = await transporter.sendMail(mailOptions)

    // If using Ethereal, log the preview URL
    if (process.env.SMTP_HOST === "smtp.ethereal.email") {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    }

    console.log("Email sent successfully:", info.messageId)
    return info
  } catch (error) {
    console.error("Failed to send verification email:", error)
    throw new Error(`Email sending failed: ${error.message}`)
  }
}
