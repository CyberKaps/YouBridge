import Link from "next/link";
import { Video, Sparkles, MonitorPlay } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[80vh] text-center animate-fade-in mt-8">
      
      <div className="flex items-center gap-2 mb-6">
        <Video size={48} color="var(--accent-primary)" />
        <h1 style={{ fontSize: '3rem', fontWeight: 700, margin: 0 }}>YouBridge</h1>
      </div>
      
      <h2 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem' }}>
        The ultimate collaboration platform for <span style={{ color: 'white' }}>Editors</span> and <span style={{ color: 'white' }}>YouTubers</span>. 
        Upload, review, and publish seamlessly.
      </h2>
      
      <div className="flex gap-4 mb-8">
        <Link href="/auth?role=EDITOR" className="btn btn-primary glass-panel">
          <Sparkles size={20} /> I'm an Editor
        </Link>
        
        <Link href="/auth?role=YOUTUBER" className="btn btn-secondary glass-panel">
          <MonitorPlay size={20} color="#ff0000" /> I'm a YouTuber
        </Link>
      </div>

    </div>
  );
}
