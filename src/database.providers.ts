import { DataSource } from 'typeorm';
import * as AWS from 'aws-sdk';
import * as process from "process";

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            let dbPassword = process.env.DB_PASSWORD;

            if (!dbPassword) {
                const sm = new AWS.SecretsManager({ region: process.env['AWS_REGION'] });
                const secretStr = (await sm.getSecretValue({SecretId: process.env['DB_SECRET_ARN']}).promise()).SecretString;
                const secretObj = JSON.parse(secretStr);
                dbPassword = secretObj.password;
            }

            const dataSource = new DataSource({
                type: "postgres",
                url: `postgresql://${process.env.DB_USER}:${dbPassword}@${process.env.DB_ENDPOINT}/${process.env.DB_NAME}`,
                ssl: true,
                entities: [
                    __dirname + '/**/models/index.js',
                ],
                synchronize: false
            });

            return dataSource.initialize();
        },
    },
];