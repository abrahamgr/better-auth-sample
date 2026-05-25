import nodemailer, { type Transporter } from 'nodemailer'
import { Resend } from 'resend'

import { env } from './env.server'
import { logger } from './logger.server'

let smtpTransport: Transporter | null = null
function getSmtpTransport() {
  if (!smtpTransport) {
    smtpTransport = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
    })
  }
  return smtpTransport
}

let resendClient: Resend | null = null
function getResend() {
  if (!env.RESEND_API_KEY) return null
  if (!resendClient) {
    resendClient = new Resend(env.RESEND_API_KEY)
  }
  return resendClient
}

function getPasswordResetMarkup({
  resetUrl,
  userName,
}: {
  resetUrl: string
  userName?: string | null
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#1f2937">
      <p style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#0f766e;margin:0 0 16px">Better Auth Sample</p>
      <h1 style="font-size:28px;line-height:1.1;margin:0 0 16px">Reset your password</h1>
      <p style="font-size:16px;line-height:1.7;margin:0 0 24px">Hello ${userName ?? 'there'},</p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 24px">Use the button below to set a new password for your account.</p>
      <p style="margin:0 0 24px">
        <a href="${resetUrl}" style="display:inline-block;background:#1f2937;color:#fff;padding:14px 22px;border-radius:999px;text-decoration:none;font-weight:600">Reset password</a>
      </p>
      <p style="font-size:14px;line-height:1.6;color:#5b6471">If you did not request this change, you can ignore this email.</p>
      <p style="font-size:14px;line-height:1.6;color:#5b6471;word-break:break-all">${resetUrl}</p>
    </div>
  `
}

export async function sendPasswordResetEmail({
  resetUrl,
  userEmail,
  userName,
  userId,
}: {
  resetUrl: string
  userEmail: string
  userId: string
  userName?: string | null
}) {
  const html = getPasswordResetMarkup({ resetUrl, userName })
  const isProduction = process.env.NODE_ENV === 'production'

  if (!isProduction) {
    const result = await getSmtpTransport().sendMail({
      from: env.EMAIL_FROM,
      html,
      subject: 'Reset your password',
      to: userEmail,
    })

    logger.info(
      {
        messageId: result.messageId,
        transport: 'smtp',
        userEmail,
      },
      'Password reset email sent.',
    )
    return
  }

  const resend = getResend()
  if (!resend) {
    logger.warn(
      {
        configured: false,
        transport: 'resend',
        userEmail,
      },
      'Password reset email was requested, but Resend is not configured.',
    )
    return
  }

  const { data, error } = await resend.emails.send(
    {
      from: env.EMAIL_FROM,
      html,
      subject: 'Reset your password',
      to: [userEmail],
    },
    {
      idempotencyKey: `password-reset/${userId}/${Date.now()}`,
    },
  )

  if (error) {
    logger.error(
      { error, transport: 'resend', userEmail },
      'Resend failed to send the password reset email.',
    )
    return
  }

  logger.info(
    { emailId: data?.id, transport: 'resend', userEmail },
    'Password reset email sent.',
  )
}
