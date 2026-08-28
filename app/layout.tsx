import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Aurora Vault - Knowledge & Intelligence Workspace',
  description: 'Advanced Knowledge, Research & Digital Intelligence Workspace. Capture, connect, and explore your notes, documents, bookmarks, and knowledge graphs.',
  openGraph: {
    title: 'Aurora Vault - Knowledge & Intelligence Workspace',
    description: 'Advanced Knowledge, Research & Digital Intelligence Workspace. Capture, connect, and explore your notes, documents, bookmarks, and knowledge graphs.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aurora Vault - Knowledge & Intelligence Workspace',
    description: 'Advanced Knowledge, Research & Digital Intelligence Workspace. Capture, connect, and explore your notes, documents, bookmarks, and knowledge graphs.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
