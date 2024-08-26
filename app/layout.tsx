import { Inter } from "next/font/google";
import "./globals.css";
import Warnings from "./components/warnings";
import { assistantId } from "./assistant-config";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Todd's Guide",
  description: "A quickstart template using the Assistants API with OpenAI",
  icons: {
    icon: "/health-man.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {assistantId ? children : <Warnings />}
        <img className="logo" src="/health-man.png" alt="Todd's Guide" />
      </body>
    </html>
  );
}
