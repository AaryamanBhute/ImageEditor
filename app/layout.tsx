import '@/static/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import {Providers} from "./providers";
import AuthenticationModal from '@/components/authenticationModal';
import { SessionProvider } from "next-auth/react"

config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'File Editor',
  description: 'In Browser File Editor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  {}
  return (
    
      <html lang="en">
        <body className={inter.className}>
          <Providers>{children}</Providers>
        </body>
      </html>
    
  )
}
