"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Video, LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string; role?: string } | null>(null);

  // Re-read auth state whenever the route changes (covers login/logout transitions).
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    } catch {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/");
  };

  const dashboardHref = user?.role === "YOUTUBER" ? "/youtuber" : "/editor";

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href={user ? dashboardHref : "/"} className="brand">
          <Video size={26} color="var(--accent-primary)" />
          <span>YouBridge</span>
        </Link>

        {user ? (
          <div className="navbar-actions">
            <span className="navbar-user">
              <span className={`role-pill role-${user.role}`}>{user.role}</span>
              <span className="navbar-email">{user.email}</span>
            </span>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          pathname !== "/auth" && (
            <Link href="/auth" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          )
        )}
      </div>
    </header>
  );
}
