import { Prettify } from "@/lib/utils";
import { type users } from "@/server/db/schema";

export type User = Prettify<Omit<typeof users.$inferSelect, "name"> & {
  name?: string | null;
}>;