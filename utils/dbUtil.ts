import mysql from 'mysql2/promise';
import { test } from '../customFixtures/expertusFixture';
import { format, addMinutes } from 'date-fns';
import data from "../data/dbData/dbCredentials.json"
import { environmentSetup } from '../playwright.config';
let dbName: string;
switch (environmentSetup) {
    case "qa":
        dbName = "qa_features_database_config";
        break;
    case "automation":
        dbName = "qa_auto_database_config";
        break;
    case "qaProduction":
        dbName = "qa_production_database_config";
        break;
        case "dev":
            dbName = "dev_database_config";
            break;
    default:
        throw new Error(`Invalid environment setup: ${environmentSetup}`);
}


export default class DB {
    private DBConfig: mysql.ConnectionOptions = {
        host: data[dbName].host,
        user: data[dbName].credentials.user,
        database: data[dbName].database_name,
        password: data[dbName].credentials.password,
        port: data[dbName].port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0

    };
 

    async executeQuery(query: string): Promise<any[]> {
        const connection = await mysql.createConnection(this.DBConfig);
        try {
            const [rows] = await connection.execute(query) as [any[], any];
            return rows;
        } catch (error) {
            console.error("Error in connection/executing query:", error);
            throw error;
        } finally {
            await connection.end().catch((error) => {
                console.error("Error ending connection:", error);
            });
        }
    }
}