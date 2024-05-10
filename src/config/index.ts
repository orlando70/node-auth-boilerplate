import * as env from 'dotenv';

env.config();

export enum AppEnvironmentEnum {
	TEST = 'test',
	LOCAL = 'local',
	DEVELOPMENT = 'development',
	STAGING = 'staging',
	PRODUCTION = 'production',
}

type Config = {
	env: {
		isProduction: boolean
		isTest: boolean
		isDevelopment: boolean
	}
	app: {
		port: number
		secret: string
		baseUrl: string
	}
    database: {
        uri: string
    }
    redis: {
        host: string
        port: number
        password: string
    }
	// sms: {
	// 	url: string
	// 	token: string
	// 	sender: string
	// },
	zeptoMail: {
		key: string
		api: string
	}
}

const isTestEnviroment = process.env.NODE_ENV === AppEnvironmentEnum.TEST;
const isProductionEnvironment = process.env.NODE_ENV === AppEnvironmentEnum.PRODUCTION;

const config: Config = {
	env: {
		isProduction: process.env.APP_ENV === AppEnvironmentEnum.PRODUCTION,
		isTest: process.env.APP_ENV === AppEnvironmentEnum.TEST,
		isDevelopment: process.env.APP_ENV === AppEnvironmentEnum.DEVELOPMENT,
	},
	app: {
		port: isTestEnviroment
			? +process.env.TEST_PORT! || 3005
			: +process.env.PORT! || 5000,
		secret: process.env.SESSION_SECRET!,
		baseUrl: process.env.BASE_URL!
	},
    redis: {
        host: isProductionEnvironment
            ? process.env.REDIS_HOST!
            : process.env.DEV_REDIS_HOST!,
        port: isProductionEnvironment
            ? +process.env.REDIS_PORT!
            : +process.env.DEV_REDIS_PORT!,
        password: process.env.REDIS_PASSWORD!,
    },
    database: {
        uri: isProductionEnvironment
            ? process.env.MONGO_URI!
            : process.env.MONGO_TEST_URI!,
    },
	// sms: {
	// 	url: process.env.SMS_API_URL!,
	// 	token: process.env.SMS_API_TOKEN!,
	// 	sender: process.env.SMS_SENDER!,
	// },
	zeptoMail: {
		key: process.env.ZEPTO_MAIL_TOKEN as string,
		api: process.env.ZEPTO_MAIL_API as string
	}
};

const validateConfiguration = () => {
	const missingKeys: string[] = [];
	Object.entries(config).forEach(([baseKey, baseValue]) => {
		Object.entries(baseValue).forEach(([key, value]) => {
			if (value === '' || value === undefined) {
				missingKeys.push(`${baseKey}.${key}`);
			}
		});
	});
	if (missingKeys.length) {
		global.console.error(
			`The following environment variables ${missingKeys.join(
				', '
			)} are not set`
		);
		process.exit(1);
	}
};

validateConfiguration();

export default config;
