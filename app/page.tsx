'use client';

import Link from 'next/link';
import { ChefHat, ArrowRight, Bot, History } from 'lucide-react';

export default function LandingPage() {
  return (
    <main style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Massive Background Image with Dark Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        backgroundImage: 'url(https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=2400)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.7) 100%)'
        }} />
      </div>

      <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', maxWidth: '1000px', paddingBottom: '10rem' }}>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0.5rem 1.5rem',
          borderRadius: '100px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '2.5rem',
          color: '#E0E0E0',
          fontSize: '0.95rem',
          animation: 'fadeInDown 0.8s ease-out'
        }}>
          <Bot size={16} color="#FF0080" /> Built with Intelligence by Oxlo.ai
        </div>

        <h1 
          className="title" 
          style={{ 
            fontSize: 'max(5rem, 8vw)', 
            marginBottom: '1.5rem',
            lineHeight: 1.1,
            animation: 'scaleUp 1s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          Master the <br /> <span style={{ background: 'linear-gradient(90deg, #7928CA, #FF0080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Art of AI Cooking</span>
        </h1>
        
        <p 
          className="subtitle" 
          style={{ 
            fontSize: '1.4rem', 
            maxWidth: '650px', 
            marginBottom: '4rem',
            color: '#BDBDBD',
            animation: 'fadeInDown 1.2s ease-out'
          }}
        >
          Stop wondering what to make for dinner. Tell us what's in your fridge, your macros, and your dietary needs. We'll generate a world-class recipe in seconds.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', animation: 'fadeInDown 1.4s ease-out' }}>
          <Link href="/generate" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', borderRadius: '100px', marginTop: 0 }}>
              <ChefHat size={22} />
              Start Cooking Free
            </button>
          </Link>
          <Link href="/vault" style={{ textDecoration: 'none' }}>
            <button 
              className="btn-primary" 
              style={{ 
                padding: '1.2rem 3rem', 
                fontSize: '1.2rem', 
                borderRadius: '100px', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)',
                marginTop: 0 
              }}
            >
              <History size={22} color="#FFF" />
              <span style={{ color: 'white' }}>View Vault</span>
            </button>
          </Link>
        </div>

      </div>
    </main>
  );
}
