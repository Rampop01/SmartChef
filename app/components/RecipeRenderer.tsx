'use client';

import React from 'react';

interface RecipeRendererProps {
  content: string;
}

export default function RecipeRenderer({ content }: RecipeRendererProps) {
  if (!content) return null;

  // Helper to parse double asterisks for bold and single for italics
  const parseInline = (text: string) => {
    // Split by **bold** or *italic*
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: '#FFF', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} style={{ fontStyle: 'italic', opacity: 0.9 }}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let currentListType: 'ul' | 'ol' | null = null;

  const flushList = (key: number) => {
    if (currentList.length > 0) {
      if (currentListType === 'ol') {
        elements.push(
          <ol key={`list-${key}`} style={{ marginLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'decimal' }}>
            {currentList}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`list-${key}`} style={{ marginLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
            {currentList}
          </ul>
        );
      }
      currentList = [];
      currentListType = null;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    
    // Handle empty lines
    if (!trimmed) {
      if (currentList.length > 0) {
        flushList(idx);
      } else {
        elements.push(<br key={`br-${idx}`} />);
      }
      return;
    }

    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      flushList(idx);
      const level = headerMatch[1].length;
      const text = headerMatch[2];
      
      if (level === 1) elements.push(<h1 key={idx} style={{ fontSize: '2.2rem', color: '#FFF', marginTop: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{parseInline(text)}</h1>);
      else if (level === 2) elements.push(<h2 key={idx} style={{ fontSize: '1.7rem', color: '#FFF', marginTop: '1.8rem', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.4rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>{parseInline(text)}</h2>);
      else if (level === 3) elements.push(<h3 key={idx} style={{ fontSize: '1.3rem', color: '#FF0080', marginTop: '1.5rem', marginBottom: '0.6rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>{parseInline(text)}</h3>);
      else elements.push(<h4 key={idx} style={{ fontSize: '1.1rem', color: '#FFF', marginTop: '1.2rem', fontWeight: 600 }}>{parseInline(text)}</h4>);
      return;
    }

    // Unordered list
    const ulMatch = line.match(/^[-*+]\s+(.*)$/);
    if (ulMatch) {
      if (currentListType === 'ol') flushList(idx);
      currentListType = 'ul';
      currentList.push(<li key={idx} style={{ marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>{parseInline(ulMatch[1])}</li>);
      return;
    }

    // Ordered list
    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (currentListType === 'ul') flushList(idx);
      currentListType = 'ol';
      currentList.push(<li key={idx} style={{ marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>{parseInline(olMatch[2])}</li>);
      return;
    }

    // Regular paragraph
    flushList(idx);
    elements.push(<p key={idx} style={{ marginBottom: '1.2rem', lineHeight: '1.7', color: '#CCC' }}>{parseInline(line)}</p>);
  });

  flushList(lines.length);

  return (
    <div className="recipe-renderer">
      {elements}
    </div>
  );
}
