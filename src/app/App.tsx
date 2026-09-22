import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload, X, Play, Image as ImageIcon, Linkedin, Mail,
  ChevronDown, Plus, Tag, Film, Layers, Send, CheckCircle,
  Lock, Camera, Download, FileText, File, Save
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const YOUR_EMAIL = "asantechristabel32@gmail.com";
const YOUR_LINKEDIN = "https://www.linkedin.com/in/christabel-asante-appiah";
const ADMIN_PASSWORD = "@Paulina0512";

// ─── Types ────────────────────────────────────────────────────────────────────

type FileCategory = "image" | "video" | "document";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  fileCategory: FileCategory;
  mediaUrl: string;
  fileName: string;
  date: string;
  tools: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const readAsDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getFileCategory = (file: File): FileCategory => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "document";
};

const FILE_TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  pdf:  { label: "PDF",      color: "#e53e3e", bg: "#fff5f5" },
  doc:  { label: "Word",     color: "#2b6cb0", bg: "#ebf8ff" },
  docx: { label: "Word",     color: "#2b6cb0", bg: "#ebf8ff" },
  xls:  { label: "Excel",    color: "#276749", bg: "#f0fff4" },
  xlsx: { label: "Excel",    color: "#276749", bg: "#f0fff4" },
  ppt:  { label: "PPT",      color: "#c05621", bg: "#fffaf0" },
  pptx: { label: "PPT",      color: "#c05621", bg: "#fffaf0" },
  pbix: { label: "Power BI", color: "#f6c000", bg: "#fffff0" },
  zip:  { label: "ZIP",      color: "#6b46c1", bg: "#faf5ff" },
};

const getFileMeta = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return FILE_TYPE_META[ext] ?? { label: ext.toUpperCase() || "FILE", color: "#d4608a", bg: "#fff5f8" };
};

const saveToStorage = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
};
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};

// ─── Skills / Tags ────────────────────────────────────────────────────────────

const ALL_TAGS = [
  "All", "Machine Learning", "Data Analytics", "Banking", "Marketing",
  "Telecommunications", "Python", "SQL", "Dashboards", "NLP",
  "Forecasting", "Visualization",
];

const SKILLS = [
  { name: "Machine Learning",    level: 90 },
  { name: "Data Analytics",      level: 93 },
  { name: "Python / Pandas",     level: 92 },
  { name: "SQL & Databases",     level: 95 },
  { name: "Data Visualization",  level: 87 },
  { name: "Statistical Modelling", level: 80 },
];

// ─── Skill Bar ────────────────────────────────────────────────────────────────

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className="text-xs text-primary font-mono">{level}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#f9b8cf,#d4608a)" }}
          initial={{ width: 0 }} animate={{ width: animated ? `${level}%` : 0 }}
          transition={{ duration: 1, delay, ease: "easeOut" }} />
      </div>
    </div>
  );
}

function StatCounter({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-primary" style={{ fontFamily: "Playfair Display, serif" }}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-mono">{label}</div>
    </div>
  );
}

// ─── Admin Modal ──────────────────────────────────────────────────────────────

function AdminModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const attempt = () => {
    if (pw === ADMIN_PASSWORD) { onSuccess(); onClose(); }
    else { setError(true); setPw(""); }
  };
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative bg-card border border-border rounded-2xl p-8 w-full max-w-sm shadow-xl"
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={16} /></button>
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center"><Lock size={18} className="text-primary" /></div>
          <h2 className="text-base font-bold" style={{ fontFamily: "Playfair Display, serif" }}>Admin Access</h2>
          <p className="text-xs text-muted-foreground text-center">Enter your password to manage content</p>
        </div>
        <input type="password" className="w-full bg-muted text-foreground rounded-xl px-4 py-3 text-sm border border-border focus:outline-none focus:border-primary transition-colors mb-2"
          placeholder="Password" value={pw} onChange={e => { setPw(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && attempt()} autoFocus />
        {error && <p className="text-xs text-destructive mb-2">Incorrect password. Try again.</p>}
        <button onClick={attempt} className="w-full py-3 rounded-xl font-semibold text-sm text-white mt-1 hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg,#f9b8cf,#d4608a)" }}>Enter</button>
      </motion.div>
    </motion.div>
  );
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────

function UploadModal({ onClose, onAdd }: { onClose: () => void; onAdd: (p: Project) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [toolInput, setToolInput] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileCategory, setFileCategory] = useState<FileCategory>("image");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setSaving(true);
    try {
      const cat = getFileCategory(file);
      const dataUrl = await readAsDataURL(file);
      setFileCategory(cat);
      setMediaUrl(dataUrl);
      setFileName(file.name);
      setError("");
    } catch {
      setError("Failed to read file. Please try a smaller file.");
    }
    setSaving(false);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const addTag = () => { const t = tagInput.trim(); if (t && !tags.includes(t)) setTags([...tags, t]); setTagInput(""); };
  const addTool = () => { const t = toolInput.trim(); if (t && !tools.includes(t)) setTools([...tools, t]); setToolInput(""); };

  const handleSubmit = () => {
    if (!title.trim()) { setError("Title is required."); return; }
    if (!mediaUrl) { setError("Please upload a file."); return; }
    onAdd({ id: Date.now().toString(), title: title.trim(), description: description.trim(), tags, tools, fileCategory, mediaUrl, fileName, date: new Date().toISOString().slice(0, 7) });
    onClose();
  };

  const inputClass = "w-full bg-muted text-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground";
  const meta = fileName ? getFileMeta(fileName) : null;

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold" style={{ fontFamily: "Playfair Display, serif" }}>Add New Project</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[76vh] overflow-y-auto">

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-8 cursor-pointer transition-colors ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" className="hidden"
              accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pbix,.zip,.csv"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            {saving ? (
              <p className="text-sm text-primary font-mono animate-pulse">Reading file...</p>
            ) : mediaUrl ? (
              fileCategory === "image" ? (
                <img src={mediaUrl} alt="preview" className="max-h-36 rounded-lg object-cover" />
              ) : fileCategory === "video" ? (
                <video src={mediaUrl} className="max-h-36 rounded-lg object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: meta?.bg, color: meta?.color }}>
                    {meta?.label}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{fileName}</p>
                </div>
              )
            ) : (
              <>
                <div className="flex gap-3 text-primary/50"><ImageIcon size={24} /><Film size={24} /><FileText size={24} /></div>
                <p className="text-sm text-muted-foreground text-center">
                  Drag and drop or click to upload<br />
                  <span className="text-xs">Images, Videos, PDF, Word, Excel, PowerPoint, Power BI, and more</span>
                </p>
              </>
            )}
          </div>

          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider font-mono block mb-1.5">Project Title *</label>
            <input className={inputClass} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Customer Churn Model" />
          </div>

          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider font-mono block mb-1.5">Description</label>
            <textarea className={`${inputClass} resize-none`} rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="What did you build? What was the outcome?" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider font-mono block mb-1.5">Tags</label>
              <div className="flex gap-2">
                <input className={`${inputClass} flex-1`} value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="ML, SQL..." />
                <button onClick={addTag} className="bg-primary text-white px-3 rounded-xl text-sm hover:opacity-90">+</button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map(t => (
                  <span key={t} className="flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5">
                    {t} <button onClick={() => setTags(tags.filter(x => x !== t))}><X size={9} /></button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider font-mono block mb-1.5">Tools Used</label>
              <div className="flex gap-2">
                <input className={`${inputClass} flex-1`} value={toolInput} onChange={e => setToolInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTool())} placeholder="Python..." />
                <button onClick={addTool} className="bg-secondary text-foreground px-3 rounded-xl text-sm border border-border hover:opacity-90">+</button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {tools.map(t => (
                  <span key={t} className="flex items-center gap-1 text-xs bg-muted text-muted-foreground border border-border rounded-full px-2 py-0.5">
                    {t} <button onClick={() => setTools(tools.filter(x => x !== t))}><X size={9} /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-destructive text-xs">{error}</p>}

          <button onClick={handleSubmit}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#f9b8cf,#d4608a)" }}>
            <Save size={14} /> Save Project
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ project, onClose }: { project: Project; onClose: () => void }) {
  const meta = getFileMeta(project.fileName);
  const downloadFile = () => {
    const a = document.createElement("a");
    a.href = project.mediaUrl;
    a.download = project.fileName;
    a.click();
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} />
      <motion.div className="relative w-full max-w-4xl bg-card border border-border rounded-2xl overflow-hidden shadow-2xl"
        initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }} transition={{ duration: 0.22 }}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/80 text-foreground rounded-full p-1.5 hover:bg-white shadow-sm"><X size={15} /></button>

        {project.fileCategory === "image" ? (
          <img src={project.mediaUrl} alt={project.title} className="w-full aspect-video object-cover" />
        ) : project.fileCategory === "video" ? (
          <video src={project.mediaUrl} controls className="w-full aspect-video object-cover" />
        ) : (
          <div className="w-full aspect-video flex flex-col items-center justify-center gap-4" style={{ background: meta.bg }}>
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-2xl font-bold border" style={{ color: meta.color, borderColor: meta.color + "40", background: "#fff" }}>
              {meta.label}
            </div>
            <p className="text-sm font-mono text-muted-foreground">{project.fileName}</p>
            <button onClick={downloadFile}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#f9b8cf,#d4608a)" }}>
              <Download size={14} /> Download File
            </button>
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.map(t => <span key={t} className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-0.5">{t}</span>)}
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "Playfair Display, serif" }}>{project.title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">{project.description}</p>
          <div className="flex items-center gap-3 flex-wrap">
            {project.tools.length > 0 && (
              <>
                <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Stack:</span>
                {project.tools.map(t => <span key={t} className="text-xs bg-muted text-muted-foreground border border-border rounded-full px-2 py-0.5 font-mono">{t}</span>)}
              </>
            )}
            {project.fileCategory === "document" && (
              <button onClick={downloadFile}
                className="ml-auto flex items-center gap-1.5 text-xs text-primary border border-primary/30 rounded-full px-3 py-1.5 hover:bg-primary/10 transition-colors">
                <Download size={12} /> Download
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const meta = getFileMeta(project.fileName);
  return (
    <motion.div className="group bg-card border border-border rounded-2xl overflow-hidden cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(212,96,138,0.12)" }} transition={{ duration: 0.2 }}
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}>

      <div className="relative aspect-video overflow-hidden">
        {project.fileCategory === "image" ? (
          <>
            <img src={project.mediaUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : project.fileCategory === "video" ? (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <video src={project.mediaUrl} className="w-full h-full object-cover" muted />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 rounded-full p-3 shadow-md"><Play size={18} className="text-primary fill-primary" /></div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ background: meta.bg }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm border" style={{ color: meta.color, borderColor: meta.color + "30", background: "#fff" }}>
              {meta.label}
            </div>
            <p className="text-xs text-muted-foreground font-mono max-w-[80%] truncate text-center">{project.fileName}</p>
          </div>
        )}
        <div className="absolute top-3 right-3 text-xs text-white bg-black/30 rounded-full px-2 py-0.5 font-mono backdrop-blur-sm">{project.date}</div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {project.tags.slice(0, 2).map(t => <span key={t} className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5">{t}</span>)}
        </div>
        <h3 className="font-semibold text-base mb-1.5 group-hover:text-primary transition-colors" style={{ fontFamily: "Playfair Display, serif" }}>{project.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{project.description}</p>
        {project.tools.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-3">
            {project.tools.slice(0, 3).map(t => <span key={t} className="text-xs font-mono text-muted-foreground border border-border rounded-full px-2 py-0.5">{t}</span>)}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [f]: e.target.value }));
  const handleSend = () => {
    if (!form.name || !form.email || !form.message) return;
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    const subject = encodeURIComponent(form.subject || `Portfolio enquiry from ${form.name}`);
    window.location.href = `mailto:${YOUR_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true); setTimeout(() => setSent(false), 4000);
  };
  const ic = "w-full bg-muted text-foreground rounded-xl px-4 py-3 text-sm border border-border focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground";
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      {sent ? (
        <motion.div className="flex flex-col items-center justify-center gap-3 py-10 text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <CheckCircle size={40} className="text-primary" />
          <p className="font-semibold" style={{ fontFamily: "Playfair Display, serif" }}>Message sent!</p>
          <p className="text-muted-foreground text-sm">Your email client opened with the message ready to send.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">Name</label>
              <input className={ic} value={form.name} onChange={set("name")} placeholder="Jane Smith" />
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">Email</label>
              <input className={ic} type="email" value={form.email} onChange={set("email")} placeholder="jane@company.com" />
            </div>
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">Subject</label>
            <input className={ic} value={form.subject} onChange={set("subject")} placeholder="I would like to discuss..." />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">Message</label>
            <textarea className={`${ic} resize-none`} rows={4} value={form.message} onChange={set("message")} placeholder="Tell me about your project, role, or opportunity..." />
          </div>
          <button onClick={handleSend} disabled={!form.name || !form.email || !form.message}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ background: "linear-gradient(135deg,#f9b8cf,#d4608a)" }}>
            <Send size={15} /> Send Message
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Profile Picture ──────────────────────────────────────────────────────────

function ProfilePicture({ isAdmin, src, onUpload }: { isAdmin: boolean; src: string | null; onUpload: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const dataUrl = await readAsDataURL(file);
    onUpload(dataUrl);
  };
  return (
    <div className="relative inline-block mb-6">
      <div className={`w-28 h-28 rounded-full border-4 border-primary/30 overflow-hidden bg-secondary shadow-lg relative ${isAdmin ? "cursor-pointer" : ""}`}
        onClick={() => isAdmin && fileRef.current?.click()}>
        {src
          ? <img src={src} alt="Christabel Asante Appiah" className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
              <span className="text-3xl font-bold text-primary" style={{ fontFamily: "Playfair Display, serif" }}>CA</span>
            </div>}
        {isAdmin && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Camera size={20} className="text-white" />
          </div>
        )}
      </div>
      {isAdmin && (
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md border-2 border-background cursor-pointer"
          onClick={() => fileRef.current?.click()}>
          <Camera size={12} className="text-white" />
        </div>
      )}
      <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}

// ─── Soft blobs ───────────────────────────────────────────────────────────────

function SoftBlob() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-25" style={{ background: "radial-gradient(circle,#f9b8cf 0%,transparent 70%)", transform: "translate(30%,-30%)" }} />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full opacity-15" style={{ background: "radial-gradient(circle,#d4608a 0%,transparent 70%)", transform: "translate(-50%,-50%)" }} />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [projects, setProjects]       = useState<Project[]>(() => loadFromStorage("ca_projects", []));
  const [profilePic, setProfilePic]   = useState<string | null>("Image.jpg");
  const [cvUrl, setCvUrl]             = useState<string | null>("CHRISTABEL ASANTE APPIAH_DATA SCIENTIST.pdf");
  const [cvName, setCvName]           = useState<string>("CHRISTABEL ASANTE APPIAH_DATA SCIENTIST.pdf");
  // startYear drives the auto-calculated experience counter
  const [startYear, setStartYear]     = useState<number>(() => loadFromStorage("ca_start_year", 2024));
  const [editingYears, setEditingYears] = useState(false);
  const [yearInput, setYearInput]     = useState("");

  const yearsExp = new Date().getFullYear() - startYear;
  const yearsLabel = yearsExp <= 0 ? "<1" : yearsExp === 1 ? "1" : `${yearsExp}+`;
  const [activeTag, setActiveTag]     = useState("All");
  const [showUpload, setShowUpload]   = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAdmin, setIsAdmin]         = useState(false);
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [saveMsg, setSaveMsg]         = useState("");
  const cvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const notify = (msg: string) => { setSaveMsg(msg); setTimeout(() => setSaveMsg(""), 3000); };

  const handleSetProfilePic = (url: string) => {
    setProfilePic(url);
    const ok = saveToStorage("ca_profile_pic", url);
    notify(ok ? "Profile picture saved!" : "File too large to save. Try a smaller image.");
  };

  const handleAddProject = (p: Project) => {
    const updated = [p, ...projects];
    setProjects(updated);
    const ok = saveToStorage("ca_projects", updated);
    notify(ok ? "Project saved!" : "Storage full — try a smaller file or remove old projects.");
  };

  const handleCvUpload = async (file: File) => {
    if (file.type !== "application/pdf") { notify("Please upload a PDF file."); return; }
    const dataUrl = await readAsDataURL(file);
    setCvUrl(dataUrl);
    setCvName(file.name);
    saveToStorage("ca_cv_url", dataUrl);
    saveToStorage("ca_cv_name", file.name);
    notify("CV saved!");
  };

  const downloadCv = () => {
    if (!cvUrl) return;
    const a = document.createElement("a");
    a.href = cvUrl; a.download = cvName || "Christabel_Asante_Appiah_CV.pdf"; a.click();
  };

  const filtered = activeTag === "All" ? projects : projects.filter(p => p.tags.includes(activeTag));
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "DM Sans, sans-serif" }}>

      {/* Save notification toast */}
      <AnimatePresence>
        {saveMsg && (
          <motion.div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-xs font-mono px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <CheckCircle size={13} /> {saveMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navScrolled ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-lg font-bold" style={{ fontFamily: "Playfair Display, serif" }}>
            <span className="text-foreground">Christabel Asante </span><span className="text-primary">Appiah</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {["projects", "about", "contact"].map(s => (
              <button key={s} onClick={() => scrollTo(s)} className="hover:text-primary transition-colors capitalize">{s}</button>
            ))}
          </div>
          {isAdmin && (
            <button onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-all">
              <Plus size={13} /> Upload Project
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <SoftBlob />
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <ProfilePicture isAdmin={isAdmin} src={profilePic} onUpload={handleSetProfilePic} />
              </motion.div>

              <motion.div className="inline-flex items-center gap-2 text-xs font-mono text-primary border border-primary/30 rounded-full px-3 py-1.5 mb-6 bg-primary/5"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Open to opportunities
              </motion.div>

              <motion.h1 className="text-5xl md:text-6xl font-bold leading-tight mb-5"
                style={{ fontFamily: "Playfair Display, serif" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                Data Scientist<br />
                <span style={{ background: "linear-gradient(135deg,#f9b8cf,#d4608a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  &amp; ML Specialist
                </span>
              </motion.h1>

              <motion.p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                Transforming raw data into strategic decisions. With experience across banking, marketing, and telecommunications, I build ML models and analytics solutions that drive measurable impact.
              </motion.p>

              <motion.div className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                <button onClick={() => scrollTo("projects")}
                  className="px-6 py-3 rounded-full font-semibold text-sm text-white hover:opacity-90 transition-all"
                  style={{ background: "linear-gradient(135deg,#f9b8cf,#d4608a)" }}>
                  View My Work
                </button>
                <button onClick={() => scrollTo("contact")}
                  className="px-6 py-3 rounded-full font-semibold text-sm border border-border text-foreground hover:border-primary/50 hover:text-primary transition-all">
                  Hire Me
                </button>
                {cvUrl && (
                  <button onClick={downloadCv}
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border border-primary/40 text-primary hover:bg-primary/10 transition-all">
                    <Download size={14} /> Download CV
                  </button>
                )}
              </motion.div>
            </div>

            {/* Stats card */}
            <motion.div className="bg-card border border-border rounded-2xl p-8"
              style={{ boxShadow: "0 4px 60px rgba(212,96,138,0.08)" }}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
              <div className="font-mono text-xs text-muted-foreground mb-5 flex items-center gap-2">
                <Layers size={12} className="text-primary" />
                Experience &amp; Skills
              </div>
              <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-border">
                {/* Years — auto-calculated, editable by admin */}
                <div className="text-center">
                  {isAdmin && editingYears ? (
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-xs text-muted-foreground font-mono mb-1">Start year</p>
                      <input
                        type="number"
                        className="w-20 text-center bg-muted border border-primary rounded-lg px-2 py-1 text-sm font-mono text-foreground focus:outline-none"
                        value={yearInput}
                        onChange={e => setYearInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            const y = parseInt(yearInput);
                            if (y > 1990 && y <= new Date().getFullYear()) {
                              setStartYear(y);
                              saveToStorage("ca_start_year", y);
                              notify("Experience updated!");
                            }
                            setEditingYears(false);
                          }
                          if (e.key === "Escape") setEditingYears(false);
                        }}
                        autoFocus
                      />
                      <p className="text-xs text-muted-foreground/60">Press Enter to save</p>
                    </div>
                  ) : (
                    <div
                      className={`${isAdmin ? "cursor-pointer group" : ""}`}
                      onClick={() => { if (isAdmin) { setYearInput(String(startYear)); setEditingYears(true); } }}
                      title={isAdmin ? "Click to edit start year" : undefined}
                    >
                      <div className="text-3xl font-bold text-primary relative" style={{ fontFamily: "Playfair Display, serif" }}>
                        {yearsLabel}
                        {isAdmin && <span className="absolute -top-1 -right-3 text-xs text-primary/40 group-hover:text-primary transition-colors">✎</span>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-mono">Years Exp.</div>
                      {isAdmin && <div className="text-xs text-primary/40 font-mono mt-0.5">since {startYear}</div>}
                    </div>
                  )}
                </div>
                <StatCounter value="3" label="Industries" />
                <StatCounter value="100%" label="Committed" />
              </div>
              <div className="space-y-4">
                {SKILLS.map((s, i) => <SkillBar key={s.name} name={s.name} level={s.level} delay={i * 0.08} />)}
              </div>
            </motion.div>
          </div>

          <button onClick={() => scrollTo("projects")} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-bounce">
            <ChevronDown size={22} />
          </button>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">Portfolio</p>
              <h2 className="text-4xl font-bold" style={{ fontFamily: "Playfair Display, serif" }}>My Projects</h2>
            </div>
            {isAdmin && (
              <button onClick={() => setShowUpload(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/10 transition-all self-start md:self-auto">
                <Upload size={14} /> Add Project
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap mb-10">
            {ALL_TAGS.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)}
                className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${activeTag === tag ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"}`}>
                {tag}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <motion.div className="text-center py-28 flex flex-col items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                <Tag size={24} className="text-primary/40" />
              </div>
              <p className="text-muted-foreground text-sm">Projects coming soon.</p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(p => <ProjectCard key={p.id} project={p} onClick={() => setLightboxProject(p)} />)}
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 20% 60%,rgba(249,184,207,0.15) 0%,transparent 70%)" }} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">About Me</p>
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "Playfair Display, serif" }}>Data driven, impact focused</h2>
              <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                <p>I am a data scientist with 2 years of experience applying machine learning and advanced analytics to real business problems. My background spans three industries — banking, marketing, and telecommunications — giving me a sharp understanding of how data shapes customer behaviour, financial outcomes, and operational efficiency.</p>
                <p>In banking, I worked on predictive models for credit risk and customer segmentation. In marketing, I built campaign attribution models and churn prediction systems that directly influenced retention strategy. In telecommunications, I applied data analytics to network performance and subscriber behaviour analysis.</p>
                <p>I cover the full data stack: exploratory analysis, feature engineering, model development, visualisation, and communicating results to nontechnical stakeholders. I believe the best data scientist is also a great storyteller.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: "🏦", title: "Banking", desc: "Credit risk modelling, customer segmentation, churn prediction, fraud signals" },
                { emoji: "📣", title: "Marketing Analytics", desc: "Campaign attribution, A/B testing, funnel analysis, audience targeting" },
                { emoji: "📡", title: "Telecommunications", desc: "Subscriber behaviour analysis, network performance analytics, churn forecasting" },
                { emoji: "🤖", title: "Machine Learning", desc: "Classification, regression, clustering, NLP, time series forecasting, model deployment" },
              ].map(item => (
                <motion.div key={item.title} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-sm transition-all"
                  whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
                  <div className="text-2xl mb-3">{item.emoji}</div>
                  <h3 className="font-semibold text-sm mb-1" style={{ fontFamily: "Playfair Display, serif" }}>{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">Contact</p>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>Let us work together</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">Have a project, a dataset, or an open role? Fill in the form and I will get back to you.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Contact form */}
            <div className="md:col-span-2">
              <ContactForm />
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Connect card */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Connect</p>
                <a href={YOUR_LINKEDIN} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Linkedin size={15} className="text-primary" /></div>
                  <div>
                    <div className="text-sm font-medium group-hover:text-primary transition-colors">LinkedIn</div>
                    <div className="text-xs text-muted-foreground">Christabel Asante Appiah</div>
                  </div>
                </a>
                <a href={`mailto:${YOUR_EMAIL}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary transition-colors group mt-1">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Mail size={15} className="text-primary" /></div>
                  <div>
                    <div className="text-sm font-medium group-hover:text-primary transition-colors">Email</div>
                    <div className="text-xs text-muted-foreground font-mono">{YOUR_EMAIL}</div>
                  </div>
                </a>
              </div>

              {/* CV card */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Resume / CV</p>
                {cvUrl ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-primary/5 border border-primary/20">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><File size={15} className="text-primary" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-primary">CV Ready</div>
                        <div className="text-xs text-muted-foreground font-mono truncate">{cvName}</div>
                      </div>
                    </div>
                    <button onClick={downloadCv}
                      className="w-full py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                      style={{ background: "linear-gradient(135deg,#f9b8cf,#d4608a)" }}>
                      <Download size={14} /> Download CV
                    </button>
                    {isAdmin && (
                      <button onClick={() => cvInputRef.current?.click()}
                        className="w-full py-2 rounded-xl text-xs text-muted-foreground border border-border hover:border-primary/40 hover:text-primary transition-all">
                        Replace CV
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    {isAdmin ? (
                      <button onClick={() => cvInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-border rounded-xl py-6 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <FileText size={22} className="text-primary/40" />
                        <span className="text-xs text-muted-foreground">Click to upload your CV</span>
                        <span className="text-xs text-muted-foreground/60">PDF files only</span>
                      </button>
                    ) : (
                      <div className="text-center py-6 text-xs text-muted-foreground">CV coming soon.</div>
                    )}
                  </div>
                )}
                <input ref={cvInputRef} type="file" accept="application/pdf" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleCvUpload(f); }} />
              </div>

              {/* Availability */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="text-primary font-semibold">Available for freelance</span> consulting, full time roles, and contract projects in data science and analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <span className="text-sm font-bold" style={{ fontFamily: "Playfair Display, serif" }}>
            <span className="text-foreground">Christabel Asante </span><span className="text-primary">Appiah</span>
          </span>
          <span className="text-xs text-muted-foreground font-mono">© 2025 · Data Science &amp; ML Portfolio</span>
          <button onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)}
            className="flex items-center gap-1 text-xs text-muted-foreground/40 hover:text-primary transition-colors font-mono"
            title={isAdmin ? "Exit admin mode" : "Admin login"}>
            <Lock size={10} /> {isAdmin ? "exit admin" : "admin"}
          </button>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {showAdminModal && <AdminModal onClose={() => setShowAdminModal(false)} onSuccess={() => setIsAdmin(true)} />}
        {showUpload && isAdmin && <UploadModal onClose={() => setShowUpload(false)} onAdd={handleAddProject} />}
        {lightboxProject && <Lightbox project={lightboxProject} onClose={() => setLightboxProject(null)} />}
      </AnimatePresence>
    </div>
  );
}
