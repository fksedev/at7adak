import mailer from 'nodemailer'
import { get_all_options, get_option } from './options'
import { fetcher } from '$lib/dashboard'

export const toEmail = async ({
    to, 
    subject, 
    message = '', 
    attachments = []
}) => {
    const html = message

    const options = await get_all_options()
    // console.log('options', options)
    const {
        smtp_email,
        smtp_name,
        smtp_enc_type,
        smtp_host,
        smtp_port,
        smtp_username,
        smtp_password,
    } = options
    try {
        let transporter = mailer.createTransport({
            host: smtp_host,
            port: +smtp_port,
            secure: smtp_enc_type === 'ssl', // true for 465, false for other ports
            auth: {
                user: smtp_username,
                pass: smtp_password
            }
        })
    
        const res = await transporter.sendMail({
            from: {
                name: smtp_name,
                address: smtp_email,
            },
            to,
            subject,
            html,
            attachments,
        })
    
        return res.response
    } catch (error) {
        return error.message
    }   
}

export const toSlack = async ( text ) => {
    const hook = await get_option('slack_hook')
    return await fetcher.post(hook, { text })
}
