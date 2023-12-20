export { default } from "next-auth/middleware";

export const config = { matcher: ["/dashboard", "/dashboard/users", "/dashboard/posts", "/dashboard/users/create", "/dashboard/users/edit"] };