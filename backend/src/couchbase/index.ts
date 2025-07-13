import { Ottoman } from "ottoman";

const ottomanConfig = {
    scopeName: "_default",
    collectionName: "log",
    maxExpiry: 0,
};

export const ottoman = new Ottoman(ottomanConfig);

const connectionConfig = {
    connectionString: process.env.COUCHBASE_URL || "couchbase://localhost",
    bucketName: process.env.COUCHBASE_BUCKET || "default",
    username: process.env.COUCHBASE_USERNAME || "admin",
    password: process.env.COUCHBASE_PASSWORD || "password",
};

export async function connectOttoman() {
    await ottoman.connect(connectionConfig);
    await ottoman.start();
}