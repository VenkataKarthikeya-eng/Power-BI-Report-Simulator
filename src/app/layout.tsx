import type { Metadata } from 'next';
import './globals.css';
import { OnboardingWizard } from '@/components/guided/OnboardingWizard';

export const metadata: Metadata = {
  title: {
    default: 'Power BI Report Simulator',
    template: '%s | Power BI Report Simulator',
  },
  description: 'Upload Power BI reports, explore dashboard layouts, and interact with simulated analytics.',
  openGraph: {
    title: 'Power BI Report Simulator',
    description: 'Upload Power BI reports, explore dashboard layouts, and interact with simulated analytics.',
    siteName: 'Power BI Report Simulator',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased flex flex-col">
        <OnboardingWizard />
        {children}
      </body>
    </html>
  );
}
