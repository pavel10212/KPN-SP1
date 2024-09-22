import {Resend} from 'resend';
import EmailTemplate from "@/components/email/email-template";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
    const {to, name, role, password, email} = await req.json();
    console.log(to, name, role, password, email);

    try {
        const {data, error} = await resend.emails.send({
            from: 'onboarding@taskspro.live',
            to: to,
            subject: 'Welcome to Our Team!',
            react: <EmailTemplate firstName={name} role={role} email={email} password={password}/>,
        });

        if (error) {
            return new Response(JSON.stringify({error}), {status: 400});
        }

        return new Response(JSON.stringify(data));
    } catch (error) {
        return new Response(JSON.stringify({error: error.message}), {status: 500});
    }
}