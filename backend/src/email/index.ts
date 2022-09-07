import nodemailer from 'nodemailer';
import mjml2html from 'mjml';
import { readFileSync } from 'fs';
import path from 'path';
import hbs from 'handlebars';

const transport = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: Number.parseInt(process.env.MAILER_PORT ?? '', 10),
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
    },
}, {
    from: process.env.MAILER_FROM,
});

export function sendMail(templateName: string, opts: { to: string, subject: string }, context: Record<string, any>) {
    const fileName = path.join(process.cwd(), 'src', 'email', 'templates', `${templateName}.mjml`);
    const template = hbs.compile(readFileSync(fileName, { encoding: 'utf8' }));
    const res = mjml2html(template(context));

    return transport.sendMail({
        to: opts.to,
        subject: opts.subject,
        html: res.html,
    });
}
