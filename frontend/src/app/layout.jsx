import './globals.css';
import BottomNav from '@/components/BottomNav';

export const metadata = {
  title: 'Beat the Sugar Spike',
  description: 'Track sugar. Get instant insights. Build streaks.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen pb-20">
        <main className="max-w-md mx-auto">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}