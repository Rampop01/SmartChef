'use client';

import { useState, useEffect } from 'react';
import { PackageOpen, Plus, X, Trash2 } from 'lucide-react';

export default function Pantry() {
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    try {
      const savedPantry = localStorage.getItem('userPantry');
      if (savedPantry) {
        setPantryItems(JSON.parse(savedPantry));
      } else {
        // Pre-populate some defaults if empty
        const defaults = ['Olive Oil', 'Garlic', 'Onions', 'Salt', 'Black Pepper', 'Butter'];
        setPantryItems(defaults);
        localStorage.setItem('userPantry', JSON.stringify(defaults));
      }
    } catch (err) {}
  }, []);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim() || pantryItems.includes(newItem.trim())) return;
    
    const updated = [...pantryItems, newItem.trim()];
    setPantryItems(updated);
    localStorage.setItem('userPantry', JSON.stringify(updated));
    setNewItem('');
  };

  const removeItem = (itemToRemove: string) => {
    const updated = pantryItems.filter(item => item !== itemToRemove);
    setPantryItems(updated);
    localStorage.setItem('userPantry', JSON.stringify(updated));
  };

  const clearAll = () => {
    if(confirm('Clear entire pantry?')) {
      setPantryItems([]);
      localStorage.removeItem('userPantry');
    }
  };

  return (
    <>
      <div className="ambient-glow bottom-right" />
      <main className="container">
        
        <h1 className="title" style={{ fontSize: '4.5rem', marginBottom: '0.5rem' }}>Your Pantry</h1>
        <p className="subtitle" style={{ marginBottom: '4rem' }}>
          Manage the ingredients you always have standing by. We will use these as quick-add options 
          when generating new recipes!
        </p>

        <div className="glass-panel" style={{ maxWidth: '700px' }}>
          <form onSubmit={addItem} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="Add an ingredient (e.g. Flour, Eggs, Milk)" 
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ width: 'auto', marginTop: '0', padding: '0 2rem' }}>
              <Plus size={20} /> Add
            </button>
          </form>

          {pantryItems.length > 0 ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Saved Ingredients ({pantryItems.length})</h3>
                <button onClick={clearAll} style={{ background: 'transparent', border: 'none', color: '#ff4d4f', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <Trash2 size={16} /> Clear All
                </button>
              </div>

              <div className="pantry-grid">
                {pantryItems.map(item => (
                  <div key={item} className="pantry-chip">
                    {item}
                    <button onClick={() => removeItem(item)} className="pantry-chip-delete" aria-label="Remove item">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#666' }}>
              <PackageOpen size={48} opacity={0.3} style={{ margin: '0 auto 1rem' }} />
              <p>Your pantry is completely empty.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
