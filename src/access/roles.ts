import type { Access, FieldAccess } from "payload";

export type Role = "admin" | "editor";

export const ADMIN_EMAIL_DOMAIN =
  process.env.ADMIN_EMAIL_DOMAIN ?? "findandhire.co";

const roleOf = (user: unknown): Role | undefined =>
  (user as { role?: Role } | null | undefined)?.role;

export const isAdmin: Access = ({ req: { user } }) => roleOf(user) === "admin";

export const isStaff: Access = ({ req: { user } }) => {
  const role = roleOf(user);
  return role === "admin" || role === "editor";
};

export const isStaffUser = ({ req: { user } }: { req: { user: unknown } }) => {
  const role = roleOf(user);
  return role === "admin" || role === "editor";
};

export const isAdminField: FieldAccess = ({ req: { user } }) =>
  roleOf(user) === "admin";
