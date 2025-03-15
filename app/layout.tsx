import DashboardLayout from './components/DashboardLayout';
import './globals.css';

export const metadata = {
  title: 'AlphaGPT Trading App',
  description: 'Advanced Trading Dashboard powered by AlphaGPT',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
