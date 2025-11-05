import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { to, subject, html, text } = await request.json();

    // Validate required fields
    if (!to || !subject) {
      return NextResponse.json(
        { message: 'Recipient email and subject are required' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      // Fix for SSL certificate issue
      tls: {
        rejectUnauthorized: false
      },
      // Alternative fix - use secure connection
      secure: true,
      // Additional options for better compatibility
      pool: true,
      maxConnections: 1,
      rateDelta: 20000,
      rateLimit: 5
    });

    // Verify transporter configuration
    await transporter.verify();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully to:', to);
    return NextResponse.json({ message: 'Email sent successfully' });
    
  } catch (error) {
    console.error('Email error details:', error);
    return NextResponse.json(
      { message: `Failed to send email: ${error.message}` },
      { status: 500 }
    );
  }
}