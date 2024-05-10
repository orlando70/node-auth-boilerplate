export function passwordResetTemplate (name: string, link: string) {
    return `
    <html>
    <head>
        <style>

        </style>
    </head>
    <body>
        <p>Hi ${name},</p>
        <p>You requested to reset your password.</p>
        <p> Please, click the link below to reset your password</p>
        <a href="${link}">Reset Password</a>
    </body>
</html>
    `
}


export function sendEmailVerificationTemplate (name: string, link: string) {
    return `
    <html>
    <head>
        <style>

        </style>
    </head>
    <body>
        <p>Hi ${name},</p>
        <p> Please, click the link below to verify your email</p>
        <a href="${link}">Verify Email</a>
    </body>
</html>
    `
}

export function passwordResetSuccessTemplate (name: string) {
    return `
    <html>
    <head>
        <style>

        </style>
    </head>
    <body>
        <p>Hi ${name},</p>
        <p>Your password has been reset successfully.</p>
    </body>
</html>
    `
}