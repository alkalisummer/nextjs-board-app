import Link from 'next/link';
import '../../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <div className='post_area'>{children}</div>;
}
