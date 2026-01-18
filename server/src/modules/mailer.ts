import nodemailer from 'nodemailer'

let transporter: nodemailer.Transporter | null = null

export async function sendEmail(
  to: string,
  subject: string,
  body: string
) {
   try {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'bryana.dach@ethereal.email',
        pass: '5rAezvQeD8T7ngfwjG'
      }
    })
  }

  const info = await transporter.sendMail({
    from: `"ReachInbox" <no-reply@reachinbox.ai>`,
    to,
    subject,
    html: body
  })

  console.log('Preview URL:', nodemailer.getTestMessageUrl(info))
  } catch (err: any) {
    console.error('SMTP error:', err.message)
    throw err // IMPORTANT: let BullMQ handle retry
  }
}