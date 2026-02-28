import axios from "axios";
import { format } from "date-fns";
import { z } from "zod";

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
