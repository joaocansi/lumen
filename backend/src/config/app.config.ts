import path from "path";
import { __dirname } from "../utils/path";

export interface AppConfig {
    port: number;
    cors: {
        origin: string;
        credentials: boolean;
        allowHeaders: string[];
        allowMethods: string[];
    };
    uploads: {
        directory: string;
        servePath: string;
    };
    database: {
        couchbase: {
            url: string;
            bucket: string;
            username: string;
            password: string;
        };
    };
}

export const appConfig: AppConfig = {
    port: parseInt(process.env.PORT || "3000"),
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3001",
        credentials: true,
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    },
    uploads: {
        directory: path.resolve(__dirname, "../../uploads"),
        servePath: "/api/uploads",
    },
    database: {
        couchbase: {
            url: process.env.COUCHBASE_URL || "couchbase://localhost",
            bucket: process.env.COUCHBASE_BUCKET || "default",
            username: process.env.COUCHBASE_USERNAME || "admin",
            password: process.env.COUCHBASE_PASSWORD || "password",
        },
    },
}; 