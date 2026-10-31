import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = {title:'AVENIQ | Revenue Intelligence',description:'Intelligence That Moves Revenue Forward.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
