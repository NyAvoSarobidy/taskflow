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
      <body>{children}</body>
    </html>
  );
}
