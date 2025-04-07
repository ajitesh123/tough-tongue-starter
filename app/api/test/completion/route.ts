import { testCompletionHandler } from "@/app/test/api-test";

export async function POST(req: Request) {
  return testCompletionHandler(req);
} 