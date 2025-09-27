# 🎬 Editor–YouTuber Collaboration Platform  

This project is a role-based platform designed to streamline the workflow between **Editors** and **YouTubers**.  
Editors can upload videos, and YouTubers can review, approve, or reject them. Once approved, the server uploads the video directly to the YouTuber’s YouTube channel using Google OAuth2.0.  

---

## ❓ Why this project?

Managing collaboration between video editors and YouTubers is often messy and time-consuming:  
- Editors share video files via drives, emails, or links → prone to errors, version conflicts, and delays.  
- YouTubers must manually download, review, and upload videos to YouTube → repetitive and inefficient.  
- There’s no single **workflow system** that handles editing, approval, and publishing seamlessly.  

This platform solves these problems by:  
- Providing a **centralized workflow** where editors upload and YouTubers approve in one place.  
- Enforcing **clear roles** (Editor uploads, YouTuber approves/publishes).  
- Automating the **publishing process** directly to YouTube once a video is approved.  
- Improving **collaboration, transparency, and productivity** in the content creation pipeline.  

---


## 🚀 Features (Work in Progress)

- **Authentication**
  - Email/Password (JWT-based)
  - Google OAuth2.0 (for YouTubers, with YouTube upload scope)

- **Roles**
  - **Editor** → Uploads videos (metadata + file path/S3 key)
  - **YouTuber** → Reviews videos (Approve/Reject)

- **Video Lifecycle**
  - `PENDING` → Uploaded by Editor  
  - `APPROVED` → Approved by YouTuber  
  - `PUBLISHED` → Uploaded to YouTube automatically  
  - `REJECTED` → Sent back for rework  

- **Secure Role-Based Access**
  - Middleware to protect routes and enforce role checks  

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript  
- **Database**: PostgreSQL + Prisma ORM  
- **Auth**: JWT + Google OAuth2.0  
- **Cloud Storage**: (Planned) AWS S3 for video storage  
- **Video Upload**: YouTube Data API (via OAuth tokens)  

---

## 📌 Current Progress

- ✅ User signup/signin with JWT  
- ✅ Google OAuth2.0 integration for YouTubers  
- ✅ Role-based middleware (Editor / YouTuber)  
- ✅ Video upload route (Editor → DB)  
- ⏳ Approve/Reject routes for YouTubers  
- ⏳ YouTube video publishing integration  
- ⏳ Frontend UI  

⚠️ **Development in progress** – This is an active WIP project. Expect frequent updates and changes.  

---

## 🚧 Setup (For Developers)

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/editor-youtuber-platform.git
   cd editor-youtuber-platform
