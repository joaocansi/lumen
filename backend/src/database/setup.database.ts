import { connectOttoman } from "../couchbase";

export async function setupDatabase() {
    await connectOttoman();
} 