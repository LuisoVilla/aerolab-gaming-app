import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ req }) => {
        // Define which routes require authentication
        const { pathname } = req.nextUrl;
        
        // Allow access to auth pages
        if (pathname.startsWith('/auth/')) {
          return true;
        }
        
        // For now, don't protect any routes - user can access everything
        // You can modify this to protect specific routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
