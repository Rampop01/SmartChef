'use client';

import { useState, useEffect } from 'react';
import { Clock, Search, Trash2, ArrowLeft, Download, Printer } from 'lucide-react';
import RecipeRenderer from '../components/RecipeRenderer';

interface RecipeHistory {
  id: string;
  date: string;
  ingredients: string;
  recipe: string;
  imageUrl?: string;
}

export default function Vault() {
  const [history, setHistory] = useState<RecipeHistory[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeHistory | null>(null);

  const deleteRecipe = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this recipe from your vault?')) {
      const updated = history.filter(item => item.id !== id);
      setHistory(updated);
      localStorage.setItem('recipeHistory', JSON.stringify(updated));
      if (selectedRecipe?.id === id) setSelectedRecipe(null);
    }
  };

  const downloadRecipe = (recipeData: RecipeHistory) => {
    const titleMatch = recipeData.recipe.match(/#\s+(.*)/);
    const fileName = titleMatch ? `${titleMatch[1].replace(/\s+/g, '_').toLowerCase()}.txt` : 'recipe.txt';
    const element = document.createElement("a");
    const file = new Blob([recipeData.recipe], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('recipeHistory');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (err) {}
  }, []);

  if (selectedRecipe) {
    return (
      <main className="container" style={{ paddingTop: '2rem' }}>
        <button 
          onClick={() => setSelectedRecipe(null)}
          style={{ background: 'transparent', border: 'none', color: '#7928CA', cursor: 'pointer', fontSize: '1.2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          <ArrowLeft size={20} /> Back to Vault
        </button>
        
        {/* Beautiful Image header for the recipe */}
        {selectedRecipe.imageUrl && (
          <div style={{ width: '100%', height: '300px', borderRadius: '24px', overflow: 'hidden', marginBottom: '2rem', position: 'relative' }}>
            <img src={selectedRecipe.imageUrl} alt="Generated Dish" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent, rgba(5,5,5,1))' }} />
          </div>
        )}

        <div className="glass-panel" style={{ width: '100%', maxWidth: '1000px', margin: '0', marginTop: '-100px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} color="#FF0080" />
              <span style={{ color: '#FF0080', fontWeight: 600, letterSpacing: '1px' }}>{selectedRecipe.date}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => downloadRecipe(selectedRecipe)} 
                className="pantry-chip"
                title="Download as Text"
                style={{ height: '40px', padding: '0 1rem' }}
              >
                <Download size={18} />
              </button>
              <button 
                onClick={handlePrint} 
                className="pantry-chip"
                title="Print Recipe"
                style={{ height: '40px', padding: '0 1rem' }}
              >
                <Printer size={18} />
              </button>
              <button 
                onClick={(e) => deleteRecipe(e, selectedRecipe.id)}
                style={{ background: 'rgba(255, 77, 79, 0.1)', border: '1px solid rgba(255, 77, 79, 0.2)', color: '#ff4d4f', padding: '0 1rem', borderRadius: '100px', cursor: 'pointer', height: '40px' }}
                title="Delete Recipe"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <p style={{ color: '#888', marginBottom: '3rem', fontSize: '1.1rem' }}>
            Based on: {selectedRecipe.ingredients}
          </p>

          <div className="recipe-content">
            <RecipeRenderer content={selectedRecipe.recipe} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <div className="ambient-glow top-left" />
      <main className="container">
        <h1 className="title" style={{ fontSize: '4.5rem', marginBottom: '0.5rem' }}>Recipe Vault</h1>
        <p className="subtitle" style={{ marginBottom: '4rem' }}>
          Your personal library of AI-generated culinary masterpieces.
        </p>

        {history.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '4rem' }}>
            <Search size={48} opacity={0.2} style={{ margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>No Recipes Found</h3>
            <p>Generate some recipes on the Home tab to see them here.</p>
          </div>
        ) : (
          <div className="history-grid" style={{ width: '100%' }}>
            {history.map((histItem) => (
              <div 
                key={histItem.id} 
                className="history-card"
                onClick={() => setSelectedRecipe(histItem)}
                style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                {/* Vault Card Header Image */}
                <div style={{ width: '100%', height: '140px', background: '#111' }}>
                  <img 
                    src={histItem.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=400'} 
                    alt="Recipe Image" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                  />
                </div>
                
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Clock size={14} color="#7928CA" />
                    <span className="history-date">{histItem.date}</span>
                  </div>
                  <p className="history-ingredients" style={{ fontSize: '1rem', color: '#CCC' }}>
                    {histItem.ingredients}
                  </p>
                  <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#FF0080', fontSize: '0.95rem', fontWeight: 600 }}>
                      View Recipe →
                    </div>
                    <button 
                      onClick={(e) => deleteRecipe(e, histItem.id)}
                      style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', padding: '0.5rem' }}
                      className="trash-btn"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
