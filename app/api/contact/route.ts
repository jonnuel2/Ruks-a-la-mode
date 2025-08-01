// app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // e.g., your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // your Gmail App Password
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: 'Ruksalamode@gmail.com',
      subject: 'New Contact Message from Ruks Á La Mode',
      text: message,
      html: `
        <h2>New Message from Ruks Á La Mode Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}
