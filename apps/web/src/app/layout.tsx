// apps/web/src/app/layout.tsx
import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "TaskFlow",
  description: "Mini-SaaS de gestion de tâches collaborative",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
