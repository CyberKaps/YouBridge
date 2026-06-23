"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileVideo, Clock, CheckCircle, XCircle, PlayCircle } from "lucide-react";

export default function EditorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [youtubers, setYoutubers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtuberId, setYoutuberId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (!token || !storedUser) {
      router.push("/auth");
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "EDITOR") {
      router.push("/youtuber");
      return;
    }

    setUser(parsedUser);
    fetchVideos(token);
    fetchYoutubers(token);
  }, [router]);

  const fetchVideos = async (token: string) => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/editor", {
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

  const fetchYoutubers = async (token: string) => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/youtubers", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setYoutubers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const token = localStorage.getItem("token");
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("youtuberId", youtuberId);
    formData.append("videoFile", file);

    try {
      const res = await fetch("http://localhost:4000/api/v1/uploads", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      
      if (res.ok) {
        setTitle("");
        setDescription("");
        setYoutuberId("");
        setFile(null);
        fetchVideos(token!);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="mt-8 text-center">Loading...</div>;

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title">Editor Dashboard</h1>
        <p className="page-subtitle">Welcome, {user?.email}</p>
      </div>

      <div className="dashboard-grid">
        {/* Upload Form */}
        <div className="card p-6">
          <h2 className="section-title">
            <Upload size={20} color="var(--accent-primary)" /> Upload New Video
          </h2>
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Video Title" 
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea 
              placeholder="Description" 
              className="input-field"
              style={{ minHeight: '100px', resize: 'vertical' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className="input-field"
              value={youtuberId}
              onChange={(e) => setYoutuberId(e.target.value)}
              required
            >
              <option value="" disabled>
                {youtubers.length === 0 ? "No YouTubers available" : "Select a YouTuber"}
              </option>
              {youtubers.map((yt) => (
                <option key={yt.id} value={yt.id}>
                  {yt.email}
                </option>
              ))}
            </select>
            <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', transition: 'var(--transition-fast)' }}>
              <input 
                type="file" 
                accept="video/*" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                style={{ display: 'none' }}
                id="video-upload"
              />
              <label htmlFor="video-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <FileVideo size={48} color="var(--text-secondary)" />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {file ? file.name : "Click to select a video file"}
                </span>
              </label>
            </div>
            <button type="submit" className="btn btn-primary mt-2" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Video"}
            </button>
          </form>
        </div>

        {/* Video List */}
        <div>
          <h2 className="section-title">Your Videos</h2>
          {videos.length === 0 ? (
            <div className="empty-state">
              <FileVideo size={36} color="var(--text-secondary)" style={{ marginBottom: '0.75rem' }} />
              <p>No videos uploaded yet. Upload your first one to get started.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {videos.map(video => (
                <div key={video.id} className="card card-hover p-4 flex justify-between items-center">
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{video.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      For: {video.youtuber?.email || video.youtuberId}
                    </p>
                  </div>
                  <div className={`status-badge status-${video.status}`}>
                    {video.status === 'PENDING' && <Clock size={14} style={{ marginRight: '4px' }}/>}
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
    </div>
  );
}
