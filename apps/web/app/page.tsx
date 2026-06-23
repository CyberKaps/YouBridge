import Link from "next/link";
import { Sparkles, MonitorPlay, UploadCloud, CheckCircle2, Send } from "lucide-react";

const features = [
  {
    icon: <UploadCloud size={24} color="var(--accent-primary)" />,
    title: "Editors upload",
    desc: "Drop finished cuts with title and description. No more messy Drive links or email attachments.",
  },
  {
    icon: <CheckCircle2 size={24} color="var(--status-approved)" />,
    title: "YouTubers review",
    desc: "Approve or reject from a single queue. Full transparency on every video's status.",
  },
  {
    icon: <Send size={24} color="#ff0000" />,
    title: "Auto-publish",
    desc: "Approved videos upload straight to the creator's YouTube channel via secure OAuth.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="hero">
        <span className="hero-badge">
          <Sparkles size={15} /> Editor &amp; YouTuber collaboration
        </span>

        <h1 className="hero-title">
          Ship videos faster with <br />
          <span className="gradient-text">YouBridge</span>
        </h1>

        <p className="hero-subtitle">
          The collaboration bridge between editors and creators. Upload, review, and publish
          to YouTube — all in one streamlined workflow.
        </p>

        <div className="hero-cta">
          <Link href="/auth?role=EDITOR" className="btn btn-primary">
            <Sparkles size={20} /> I&apos;m an Editor
          </Link>
          <Link href="/auth?role=YOUTUBER" className="btn btn-secondary">
            <MonitorPlay size={20} color="#ff0000" /> I&apos;m a YouTuber
          </Link>
        </div>
      </section>

      <section className="feature-grid">
        {features.map((f) => (
          <div key={f.title} className="card card-hover feature-card">
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
