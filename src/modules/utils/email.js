import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
   service:'gmail',
   auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS
   }
})

export async function sendReminderEmail(clientEmail,startTIme){
   await transporter.sendMail({
      from: `"Booking App"<${process.env.EMAIL_USER}>`,
      to: clientEmail,
      subject:"Appointment Reminder",
      text:`This is a reminder that you have an appointment tomorrow at ${new Date(startTIme).toLocaleString()}`
   })
}