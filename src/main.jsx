import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrainCircuit, Upload, FileText, BriefcaseBusiness, ArrowRight,
  CheckCircle2, Mic, Send, Clock3, BarChart3, ShieldCheck,
  Sparkles, ChevronLeft, RotateCcw, Download, Code2, Users, FolderKanban
} from "lucide-react";
import "./index.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) throw new Error(`API error ${response.status}`);
  return response.json();
}

const mockQuestions = [
  {
    type: "Technical",
    difficulty: "Medium",
    text: "You mentioned using a binary search tree in your project. How does search complexity differ between a balanced and an unbalanced BST?"
  },
  {
    type: "Follow-up",
    difficulty: "Hard",
    text: "If the BST becomes highly unbalanced, what technique could you use to maintain efficient search performance?"
  },
  {
    type: "Behavioral",
    difficulty: "Medium",
    text: "Tell me about a technical challenge you faced in a project and how you solved it."
  }
];

function App() {
  const [page, setPage] = useState("home");
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState("");
  const [mode, setMode] = useState("Technical");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  const currentQuestion = mockQuestions[questionIndex % mockQuestions.length];

  function reset() {
    setPage("home");
    setResume(null);
    setJd("");
    setAnswers([]);
    setAnswer("");
    setQuestionIndex(0);
    setScore(null);
    setAnalysis(null);
    setError("");
  }

  async function analyzeProfile() {
    setError("");
    setAnalysis({
      skills: ["Python", "Machine Learning", "React", "SQL"],
      role: "Software / AI Engineer",
      gaps: ["Advanced data structures", "System design"],
      experience: "Candidate profile extracted from resume"
    });
    setPage("setup");
  }

  async function submitAnswer() {
    if (!answer.trim()) return;
    const newAnswers = [...answers, { question: currentQuestion.text, answer }];
    setAnswers(newAnswers);
    setAnswer("");

    if (questionIndex >= 2) {
      setScore({
        overall: 82,
        technical: 84,
        communication: 79,
        relevance: 86
      });
      setPage("report");
      return;
    }
    setQuestionIndex((v) => v + 1);
  }

  return (
    <div className="min-h-screen grid-bg">
      <Navbar onHome={() => setPage("home")} onReset={reset} />

      {page === "home" && (
        <Home
          resume={resume}
          setResume={setResume}
          jd={jd}
          setJd={setJd}
          mode={mode}
          setMode={setMode}
          onStart={analyzeProfile}
          error={error}
          setError={setError}
        />
      )}

      {page === "setup" && (
        <Setup
          analysis={analysis}
          mode={mode}
          setMode={setMode}
          onBack={() => setPage("home")}
          onStart={() => setPage("interview")}
        />
      )}

      {page === "interview" && (
        <Interview
          question={currentQuestion}
          questionNumber={questionIndex + 1}
          answer={answer}
          setAnswer={setAnswer}
          onSubmit={submitAnswer}
          onBack={() => setPage("setup")}
        />
      )}

      {page === "report" && (
        <Report
          score={score}
          answers={answers}
          onRestart={reset}
        />
      )}
    </div>
  );
}

function Navbar({ onHome, onReset }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070b14]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <button onClick={onHome} className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/15 p-2 text-blue-300">
            <BrainCircuit size={24} />
          </div>
          <div className="text-left">
            <div className="font-bold text-white">AI Interview Agent</div>
            <div className="text-xs text-slate-400">Adaptive • Personalized • Intelligent</div>
          </div>
        </button>
        <button onClick={onReset} className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
          New Interview
        </button>
      </div>
    </header>
  );
}

function Home({ resume, setResume, jd, setJd, mode, setMode, onStart, error, setError }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF resume.");
      return;
    }
    setResume(file);
    setError("");
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <section className="mb-10 text-center">
        <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-200">
          <Sparkles size={16} /> Agentic AI Interview Platform
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
          Your interview adapts to <span className="text-blue-400">you.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-slate-400">
          Upload your resume and job description. The agent analyzes your profile,
          asks adaptive questions, evaluates answers, and creates a structured report.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <UploadCard
          icon={<FileText />}
          title="Upload Resume"
          subtitle="PDF format"
          file={resume}
          accept=".pdf"
          onChange={handleFile}
        />
        <div className="glass rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/15 p-3 text-violet-300"><BriefcaseBusiness /></div>
            <div>
              <h2 className="font-semibold text-white">Job Description</h2>
              <p className="text-sm text-slate-400">Paste the target role requirements</p>
            </div>
          </div>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Example: Looking for a Python developer with SQL, REST API and machine learning knowledge..."
            className="h-52 w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-200 outline-none focus:border-blue-400/50"
          />
        </div>
      </div>

      <div className="glass mt-6 rounded-2xl p-6">
        <h2 className="mb-4 font-semibold text-white">Interview Mode</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {["Technical", "HR", "Project"].map((item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`rounded-xl border p-4 text-left transition ${
                mode === item ? "border-blue-400/50 bg-blue-500/10" : "border-white/10 bg-white/[.02] hover:bg-white/[.05]"
              }`}
            >
              <div className="mb-2 text-white">{item === "Technical" ? <Code2 /> : item === "HR" ? <Users /> : <FolderKanban />}</div>
              <div className="font-medium text-white">{item} Interview</div>
              <div className="mt-1 text-xs text-slate-400">Adaptive questions and follow-ups</div>
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

      <button
        onClick={onStart}
        disabled={!resume || !jd.trim()}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-4 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Analyze Profile & Continue <ArrowRight size={18} />
      </button>

      <FeatureStrip />
    </main>
  );
}

function UploadCard({ icon, title, subtitle, file, accept, onChange }) {
  return (
    <label className="glass block cursor-pointer rounded-2xl p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-blue-500/15 p-3 text-blue-300">{icon}</div>
        <div>
          <h2 className="font-semibold text-white">{title}</h2>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>
      <div className="flex h-52 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[.02]">
        {file ? (
          <>
            <CheckCircle2 className="mb-3 text-emerald-400" size={34} />
            <div className="max-w-[80%] truncate text-sm text-white">{file.name}</div>
            <div className="mt-1 text-xs text-slate-500">PDF selected</div>
          </>
        ) : (
          <>
            <Upload className="mb-3 text-slate-400" size={34} />
            <div className="text-sm text-slate-300">Click to choose your resume</div>
            <div className="mt-1 text-xs text-slate-500">PDF only</div>
          </>
        )}
      </div>
      <input type="file" accept={accept} className="hidden" onChange={onChange} />
    </label>
  );
}

function FeatureStrip() {
  const items = [
    ["Observe", "Reads resume, JD and previous responses"],
    ["Evaluate", "Scores accuracy, depth and relevance"],
    ["Decide", "Chooses the next topic and difficulty"],
    ["Act", "Asks the next adaptive question"]
  ];
  return (
    <div className="mt-10 grid gap-3 md:grid-cols-4">
      {items.map(([title, text], i) => (
        <div key={title} className="rounded-xl border border-white/10 bg-white/[.025] p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-300">0{i+1}</div>
          <div className="font-medium text-white">{title}</div>
          <div className="mt-1 text-xs leading-5 text-slate-500">{text}</div>
        </div>
      ))}
    </div>
  );
}

function Setup({ analysis, mode, setMode, onBack, onStart }) {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <ChevronLeft size={16} /> Back
      </button>
      <div className="mb-8">
        <div className="mb-2 text-sm text-blue-300">Step 2 of 4</div>
        <h1 className="text-3xl font-bold text-white">Profile & Role Analysis</h1>
        <p className="mt-2 text-slate-400">The agent has prepared the context used to personalize your interview.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 font-semibold text-white">Candidate Profile</h2>
          <div className="mb-4 rounded-xl bg-white/[.03] p-4 text-sm text-slate-300">{analysis?.experience}</div>
          <div className="text-xs uppercase tracking-wider text-slate-500">Detected skills</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis?.skills.map((s) => <span key={s} className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-200">{s}</span>)}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 font-semibold text-white">Role Analysis</h2>
          <div className="mb-4 text-lg text-white">{analysis?.role}</div>
          <div className="text-xs uppercase tracking-wider text-slate-500">Potential skill gaps to probe</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {analysis?.gaps.map((g) => <li key={g} className="flex gap-2"><span className="text-violet-300">•</span>{g}</li>)}
          </ul>
        </div>
      </div>

      <div className="glass mt-5 rounded-2xl p-6">
        <h2 className="mb-3 font-semibold text-white">Interview mode</h2>
        <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-slate-200 outline-none">
          <option>Technical</option>
          <option>HR</option>
          <option>Project</option>
        </select>
      </div>

      <button onClick={onStart} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-4 font-semibold hover:bg-blue-400">
        Start Adaptive Interview <ArrowRight size={18} />
      </button>
    </main>
  );
}

function Interview({ question, questionNumber, answer, setAnswer, onSubmit, onBack }) {
  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <ChevronLeft size={16} /> Exit interview
      </button>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-blue-300">Adaptive Interview</div>
          <h1 className="mt-1 text-2xl font-bold text-white">Question {questionNumber}</h1>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[.03] px-3 py-2 text-xs text-slate-300">
          <span className="text-blue-300">{question.type}</span> • {question.difficulty}
        </div>
      </div>

      <div className="glass rounded-3xl p-7">
        <div className="mb-7 flex gap-4">
          <div className="mt-1 rounded-xl bg-blue-500/15 p-3 text-blue-300"><BrainCircuit /></div>
          <div>
            <div className="mb-2 text-xs uppercase tracking-wider text-slate-500">AI Interviewer</div>
            <p className="text-xl leading-8 text-white">{question.text}</p>
          </div>
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="h-52 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-slate-200 outline-none focus:border-blue-400/50"
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-slate-300 hover:bg-white/5">
            <Mic size={18} /> Voice
          </button>
          <button onClick={onSubmit} disabled={!answer.trim()} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-semibold disabled:opacity-40">
            Submit Answer <Send size={18} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-4 text-sm text-emerald-200">
        <ShieldCheck size={18} />
        The next question can become easier or harder based on your response.
      </div>
    </main>
  );
}

function Report({ score, answers, onRestart }) {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="text-sm text-emerald-300">Interview completed</div>
          <h1 className="mt-1 text-3xl font-bold text-white">Performance Report</h1>
          <p className="mt-2 text-slate-400">Structured feedback generated from your interview responses.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/5">
          <Download size={17} /> Export Report
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <ScoreCard label="Overall" value={score.overall} />
        <ScoreCard label="Technical" value={score.technical} />
        <ScoreCard label="Communication" value={score.communication} />
        <ScoreCard label="Relevance" value={score.relevance} />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Insight title="Strengths" icon={<CheckCircle2 className="text-emerald-400" />} items={[
          "Good understanding of core concepts",
          "Answers were relevant to the question",
          "Able to explain project experience"
        ]} />
        <Insight title="Improvement Areas" icon={<BarChart3 className="text-violet-300" />} items={[
          "Practice advanced data structures",
          "Improve depth of technical explanations",
          "Use concrete examples when explaining solutions"
        ]} />
      </div>

      <div className="glass mt-6 rounded-2xl p-6">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-white"><Clock3 size={18} /> Interview Summary</h2>
        <div className="space-y-3">
          {answers.map((a, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[.02] p-4">
              <div className="text-sm text-slate-300"><span className="text-blue-300">Q{i + 1}.</span> {a.question}</div>
              <div className="mt-2 text-sm text-slate-500">{a.answer}</div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onRestart} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-4 font-semibold hover:bg-blue-400">
        <RotateCcw size={18} /> Start Another Interview
      </button>
    </main>
  );
}

function ScoreCard({ label, value }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-bold text-white">{value}<span className="text-base text-slate-500">/100</span></div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-blue-400" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Insight({ title, icon, items }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="mb-4 flex items-center gap-2 font-semibold text-white">{icon}{title}</h2>
      <ul className="space-y-3 text-sm text-slate-300">
        {items.map((item) => <li key={item} className="flex gap-2"><span className="text-slate-500">•</span>{item}</li>)}
      </ul>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
