// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

// Este middleware do Clerk gerencia a autenticação
export default authMiddleware({
  // Rotas que serão acessíveis sem autenticação
  publicRoutes: ["/", "/pricing", "/about", "/api/webhooks(.*)"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};