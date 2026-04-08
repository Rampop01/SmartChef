'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Utensils, Hexagon, Loader2, Plus } from 'lucide-react';
import axios from 'axios';

interface RecipeHistory {
  id: string;
  date: string;
  ingredients: string;
  recipe: string;
  imageUrl?: string;
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
];

export default function Generate() {
  const [ingredients, setIngredients] = useState('');
  const [dietary, setDietary] = useState('');
  const [goals, setGoals] = useState('');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pantryItems, setPantryItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedPantry = localStorage.getItem('userPantry');
      if (savedPantry) setPantryItems(JSON.parse(savedPantry));
    } catch(e) {}
  }, []);

  const addPantryItemToInput = (item: string) => {
    if (ingredients.toLowerCase().includes(item.toLowerCase())) return;
    const separator = ingredients.trim() === '' || ingredients.endsWith(',') ? ' ' : ', ';
    setIngredients((prev) => (prev.trim() + separator + item).trim());
  };

  const saveToHistory = (newRecipeContent: string, currentIngredients: string) => {
    const randomImg = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    
    const newItem: RecipeHistory = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      ingredients: currentIngredients,
      recipe: newRecipeContent,
      imageUrl: randomImg
    };

    try {
      const existing = localStorage.getItem('recipeHistory');
      const history = existing ? JSON.parse(existing) : [];
      const updatedHistory = [newItem, ...history].slice(0, 50);
      localStorage.setItem('recipeHistory', JSON.stringify(updatedHistory));
    } catch (err) {}
  };

  const generateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) {
      setError('Please tell me what ingredients you have in your kitchen.');
      return;
    }
    
    setLoading(true);
    setError('');
    setRecipe(''); 

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, dietary, goals }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipe');
      }

      setRecipe(data.recipe);
      saveToHistory(data.recipe, ingredients);

      setTimeout(() => {
        window.scrollBy({ top: 500, behavior: 'smooth' });
      }, 100);

    } catch (err: any) {
      setError(err.message || 'An error occurred while connecting to Oxlo AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="ambient-glow top-left" />
      <div className="ambient-glow bottom-right" />

      <main className="container" style={{ maxWidth: '900px', paddingTop: '2rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="title" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Recipe Studio</h1>
          <p className="subtitle" style={{ margin: '0 auto' }}>
            Combine your ingredients dynamically and let Oxlo shape them into your next meal.
          </p>
        </div>

        <div className="glass-panel" style={{ width: '100%', margin: '0 auto' }}>
          <form onSubmit={generateRecipe}>
            <div className="input-group">
              <label className="label" htmlFor="ingredients">Your Ingredients</label>
              
              {pantryItems.length > 0 && (
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {pantryItems.map((item) => (
                    <button 
                      key={item} 
                      type="button" 
                      onClick={() => addPantryItemToInput(item)}
                      className="pantry-chip"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    >
                      <Plus size={12} /> {item}
                    </button>
                  ))}
                </div>
              )}

              <textarea 
                id="ingredients" 
                className="textarea"
                placeholder="e.g. 2 large chicken breasts, half a broccoli head, some garlic, basmati rice..."
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </div>

            <div className="row">
              <div className="input-group">
                <label className="label" htmlFor="dietary">Dietary Pattern</label>
                <div style={{position: 'relative'}}>
                  <select 
                    id="dietary" 
                    className="select"
                    style={{appearance: 'none'}}
                    value={dietary} 
                    onChange={(e) => setDietary(e.target.value)}
                  >
                    <option value="">Anything Goes</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                    <option value="gluten-free">Gluten Free</option>
                  </select>
                  <Hexagon size={16} strokeWidth={2} style={{position: 'absolute', right: '1rem', top: '1rem', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none'}} />
                </div>
              </div>

              <div className="input-group">
                <label className="label" htmlFor="goals">Target Macros</label>
                <input 
                  id="goals" 
                  type="text" 
                  className="input"
                  placeholder="e.g. High protein, Under 500 kcal"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div style={{ color: '#ff4d4f', marginTop: '1rem', padding: '1rem', background: 'rgba(255, 77, 79, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 77, 79, 0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div style={{width: '6px', height: '6px', borderRadius: '50%', background: '#ff4d4f'}} />
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="spinner" size={20} />
                  Analyzing Ingredients...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Masterpiece
                </>
              )}
            </button>
          </form>

          {recipe && (
            <div className="recipe-result-wrapper">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
                <div style={{ background: 'linear-gradient(135deg, #7928CA, #FF0080)', padding: '0.6rem', borderRadius: '12px' }}>
                  <Utensils size={24} color="white" />
                </div>
                <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 700, margin: 0 }}>Your Recipe</h2>
              </div>
              
              <div className="recipe-content">
                {recipe.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) return <h1 key={index}>{line.replace('# ', '')}</h1>;
                  if (line.startsWith('## ')) return <h2 key={index}>{line.replace('## ', '')}</h2>;
                  if (line.startsWith('### ')) return <h3 key={index}>{line.replace('### ', '')}</h3>;
                  if (line.startsWith('- ')) return <li key={index}>{line.replace('- ', '')}</li>;
                  if (line.match(/^\d+\.\s/)) return <li key={index}>{line}</li>;
                  if (line.trim() === '') return <br key={index} />;
                  return <p key={index}>{line}</p>;
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
