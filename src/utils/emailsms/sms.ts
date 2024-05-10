import axios from 'axios';
import logger from '../logger';
import config from '../../config';

type SMSType = {
    to: string
    text: string
}

type SendSMSResponse = {
    code: number
    successful: string
    basic_successful: string
    corp_successful: string
    simserver_successful: string
    simserver_shared: string
    simserver_failed: string
    simserver_distribution: []
    failed: string
    flooding: string
    insufficient_unit: string
    invalid: string
    all_numbers: string
    nondnd_numbers: string
    dnd_numbers: string
    units_used: string
    units_calculated: string
    basic_units: number
    corp_units: number
    units_before: string
    units_after: string
    sms_pages: number
    simhost: string
    message_id: string
    ref_id: string
    comment: string
}

export async function sendSMS({ to, text }: SMSType) {
	const params = new URLSearchParams();
	params.append('token', config.sms.token);
	params.append('sender', config.sms.sender);
	params.append('to', to);
	params.append('message', text);
	params.append('type', '0');
	params.append('routing', '3');
	try {
		if (config.env.isProduction) {
			// 👇️ const data: SendSMSResponse
			const request = await axios.post<SendSMSResponse>(
				config.sms.url,
				params
			);
	
			return request;
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			logger.error(
				'An error associated with axios occured while sending an SMS. ',
				{
					errorMessage: error.message,
					receipient: to,
					message: text,
				}
			);
			// 👇️ error: AxiosError<any, any>
			return error.message;
		} else {
			logger.error(
				'unexpected error occurred while sending an SMS ',
				{
					errorMessage: error,
					receipient: to,
					message: text,
				}
			);
			return 'An unexpected error occurred';
		}
	}
}
