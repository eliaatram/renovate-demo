import express, { Request, Response } from "express";
import axios from "axios";
import { format } from "date-fns";
import { z } from "zod";

const app = express();
const port = process.env.PORT ?? 3000;

// Schema validation with Zod
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;

export async function fetchUser(id: number): Promise<User> {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return UserSchema.parse(response.data);
}

export function formatWelcomeMessage(user: User): string {
  const today = format(new Date(), "MMMM do, yyyy");
  return `Hello, ${user.name}! Today is ${today}.`;
}

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/user/:id", async (req: Request, res: Response) => {
  try {
    const user = await fetchUser(Number(req.params.id));
    res.send(formatWelcomeMessage(user));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
}
