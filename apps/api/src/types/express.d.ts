// Extension des types Express pour req.user et req.tenant

export {};
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        name: string;
      };
      tenant?: {
        organizationId: string;
        role: string;
      };
    }
  }
}
