"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, X, CheckCircle, XCircle, PlayCircle, MonitorPlay } from "lucide-react";

export default function YoutuberDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // Also check URL for token from Google OAuth redirect
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');

    if (urlToken) {
        localStorage.setItem("token", urlToken);
        token = urlToken;
        window.history.replaceState({}, document.title, "/youtuber");
    }

    if (!token) {
      router.push("/auth?role=YOUTUBER");
      return;
    }

    if (storedUser) {
        setUser(JSON.parse(storedUser));
        fetchVideos(token);
    } else {
        // Fetch user from /me
        fetch("http://localhost:4000/api/v1/me", {
            headers: { "Authorization": `Bearer ${token}` }
        }).then(res => res.json()).then(data => {
            if (data.error) throw new Error(data.error);
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            fetchVideos(token!);
        }).catch(err => {
            console.error(err);
            router.push("/auth?role=YOUTUBER");
        });
    }
  }, [router]);

  const fetchVideos = async (token: string) => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/youtuber", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (videoId: string, action: 'approve' | 'reject') => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:4000/api/v1/${videoId}/${action}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        // Refresh video list
        fetchVideos(token!);
      } else {
        const data = await res.json();
        alert(`Failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="mt-8 text-center">Loading...</div>;

  const pendingVideos = videos.filter(v => v.status === 'PENDING');
  const otherVideos = videos.filter(v => v.status !== 'PENDING');

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MonitorPlay color="#ff0000" size={32}/> YouTuber Dashboard
        </h1>
        <p className="page-subtitle">Welcome, {user?.email || "YouTuber"}</p>
      </div>

      <div className="mb-12">
        <h2 className="section-title" style={{ color: 'var(--status-pending)' }}>
          Review Queue ({pendingVideos.length})
        </h2>
        {pendingVideos.length === 0 ? (
          <div className="empty-state">
            You&apos;re all caught up! No pending videos.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pendingVideos.map(video => (
              <div key={video.id} className="card p-6 flex justify-between items-center">
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>{video.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    Uploaded by Editor: {video.author?.email || video.authorId}
                  </p>
                  <p style={{ color: 'var(--text-secondary)' }}>{video.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(video.id, 'approve')}
                    className="btn btn-success"
                  >
                    <Check size={18} /> Approve &amp; Upload
                  </button>
                  <button
                    onClick={() => handleAction(video.id, 'reject')}
                    className="btn btn-danger"
                  >
                    <X size={18} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="section-title">History</h2>
        {otherVideos.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No history available.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {otherVideos.map(video => (
              <div key={video.id} className="card card-hover p-4 flex justify-between items-center">
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{video.title}</h3>
                </div>
                <div className={`status-badge status-${video.status}`}>
                  {video.status === 'APPROVED' && <CheckCircle size={14} style={{ marginRight: '4px' }}/>}
                  {video.status === 'REJECTED' && <XCircle size={14} style={{ marginRight: '4px' }}/>}
                  {video.status === 'PUBLISHED' && <PlayCircle size={14} style={{ marginRight: '4px' }}/>}
                  {video.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
