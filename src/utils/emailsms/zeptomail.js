import { SendMailClient } from "zeptomail"
import config from "../../config";
import logger from "../logger";


export const sendZeptoMail = ({to, subject, message}) => {
    const url = config.zeptoMail.api
    const token = config.zeptoMail.key;

    let client = new SendMailClient({ url, token })
    if (config.env.isProduction) {
        client
            .sendMail({
                from: {
                    address: "noreply@genhrm.com",
                    name: "Auth Boilerplate Support",
                },
                to: [
                    {
                        email_address: {
                            address: to,
                            name: "Boiler Plate Inc",
                        },
                    },
                ],
                subject: subject,
                htmlbody: message,
            })
            .catch((err) =>
                logger.error(
                    "This error occured while sending emails using zepto mail service",
                    {
                        error: err,
                    }
                )
            )
    }
}
