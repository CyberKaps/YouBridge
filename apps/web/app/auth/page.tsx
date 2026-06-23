"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialRole = searchParams.get("role") || "EDITOR";
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/signin" : "/signup";
      const body = isLogin ? { email, password } : { email, password, role };
      
      const res = await fetch(`http://localhost:4000/api/v1${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "EDITOR") {
        router.push("/editor");
      } else {
        router.push("/youtuber");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:4000/api/v1/google";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto mt-8 animate-fade-in">
      <div className="glass-panel w-full p-8">
        <h2 className="text-center" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        
        {error && (
          <div style={{ color: 'var(--status-rejected)', background: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {!isLogin && (
            <select 
              className="input-field" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="EDITOR">Editor</option>
              <option value="YOUTUBER">YouTuber</option>
            </select>
          )}

          <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
            {isLogin ? <LogIn size={18}/> : <UserPlus size={18}/>}
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div className="mt-6 text-center" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>

        {role === "YOUTUBER" && (
          <>
            <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
            </div>

            <button onClick={handleGoogleAuth} className="btn w-full btn-secondary" style={{ background: '#fff', color: '#000' }}>
              <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '18px' }} />
              Continue with Google
            </button>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              Required to authorize YouTube uploads.
            </p>
          </>
        )}

      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
