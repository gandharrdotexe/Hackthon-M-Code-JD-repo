import './globals.css';
import BottomNav from '@/components/BottomNav';

export const metadata = {
  title: 'Beat the Sugar Spike',
  description: 'Track sugar. Get instant insights. Build streaks.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen pb-20 bg-cream-100">
        <main className="max-w-5xl mx-auto px-6">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}