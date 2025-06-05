import { UserResource } from "@clerk/types";

export function isAdmin(user: UserResource) {
  return user.publicMetadata?.role === "admin";
}
