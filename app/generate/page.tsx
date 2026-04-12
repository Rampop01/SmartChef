'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Utensils, Hexagon, Loader2, Plus, Download, RefreshCw, Printer, Globe } from 'lucide-react';
import axios from 'axios';
import RecipeRenderer from '../components/RecipeRenderer';

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
  const [language, setLanguage] = useState('English');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [displayedImage, setDisplayedImage] = useState('');
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

  const saveToHistory = (newRecipeContent: string, currentIngredients: string, imgUrl: string) => {
    const randomImg = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    
    const newItem: RecipeHistory = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      ingredients: currentIngredients,
      recipe: newRecipeContent,
      imageUrl: imgUrl || randomImg
    };

    try {
      const existing = localStorage.getItem('recipeHistory');
      const history = existing ? JSON.parse(existing) : [];
      const updatedHistory = [newItem, ...history].slice(0, 50);
      localStorage.setItem('recipeHistory', JSON.stringify(updatedHistory));
    } catch (err) {}
  };

  const downloadRecipe = () => {
    const titleMatch = recipe.match(/#\s+(.*)/);
    const fileName = titleMatch ? `${titleMatch[1].replace(/\s+/g, '_').toLowerCase()}.txt` : 'recipe.txt';
    const element = document.createElement("a");
    const file = new Blob([recipe], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  const generateRecipe = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        body: JSON.stringify({ ingredients, dietary, goals, language }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipe');
      }

      setRecipe(data.recipe);
      setDisplayedImage(data.imageUrl);
      saveToHistory(data.recipe, ingredients, data.imageUrl);

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

            <div className="input-group" style={{ marginTop: '1.5rem' }}>
              <label className="label" htmlFor="language">Preferred Language</label>
              <div style={{position: 'relative'}}>
                <select 
                  id="language" 
                  className="select"
                  style={{appearance: 'none'}}
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Español (Spanish)</option>
                  <option value="French">Français (French)</option>
                  <option value="German">Deutsch (German)</option>
                  <option value="Italian">Italiano (Italian)</option>
                  <option value="Portuguese">Português (Portuguese)</option>
                  <option value="Arabic">العربية (Arabic)</option>
                  <option value="Chinese">中文 (Chinese)</option>
                  <option value="Japanese">日本語 (Japanese)</option>
                  <option value="Russian">Русский (Russian)</option>
                </select>
                <Globe size={16} strokeWidth={2} style={{position: 'absolute', right: '1rem', top: '1rem', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none'}} />
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, #7928CA, #FF0080)', padding: '0.6rem', borderRadius: '12px' }}>
                      <Utensils size={24} color="white" />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 700, margin: 0 }}>Your Recipe</h2>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      onClick={() => generateRecipe()} 
                      className="pantry-chip" 
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                      title="Generate a different version"
                    >
                      <RefreshCw size={16} /> Suggest Another
                    </button>
                    <button 
                      onClick={downloadRecipe} 
                      className="pantry-chip"
                      title="Download as Text"
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      onClick={handlePrint} 
                      className="pantry-chip"
                      title="Print Recipe"
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                </div>
                
                <div style={{ width: '100%', height: '400px', borderRadius: '24px', overflow: 'hidden', marginBottom: '2.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                  <img 
                    src={displayedImage || FALLBACK_IMAGES[0]} 
                    alt="Delicious AI-generated meal" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                
                <div className="recipe-content">
                  <RecipeRenderer content={recipe} />
                </div>
              </div>
          )}
        </div>
      </main>
    </>
  );
}
