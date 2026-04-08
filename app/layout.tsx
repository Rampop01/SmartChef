import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { UtensilsCrossed, History, PackageOpen, Bot } from 'lucide-react'

export const metadata: Metadata = {
  title: 'OxBuild | Smart Chef',
  description: 'AI-powered custom recipe and meal planner powered by Oxlo.ai',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="nav-container">
            <Link href="/" className="nav-logo">
              <Bot size={24} color="#FF0080" />
              <span>Smart Chef</span>
            </Link>
            <div className="nav-links">
              <Link href="/generate" className="nav-item">
                <UtensilsCrossed size={18} /> Cook
              </Link>
              <Link href="/pantry" className="nav-item">
                <PackageOpen size={18} /> Pantry
              </Link>
              <Link href="/vault" className="nav-item">
                <History size={18} /> Vault
              </Link>
            </div>
          </div>
        </nav>
        
        <div style={{ paddingTop: '70px' }}>
          {children}
        </div>
      </body>
    </html>
  )
}
