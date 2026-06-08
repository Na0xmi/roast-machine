'use client'

import { useState, useRef } from 'react'

type Roast = {
  comment: string
  angle: string
}

type Intensity = 'subtle' | 'medium' | 'nuclear'
type Persona = 'colleague' | 'consultant' | 'thought_leader' | 'hr'

const LOADING_MSGS = [
  'Synergizing the snark...',
  'Disrupting the hustle paradigm...',
  'Circling back to your humiliation...',
  'Scaling the corporate speak...',
  'Moving the needle on cringe...',
  'Taking this offline... then bringing it back hotter.',
  'Leveraging AI to roast at scale...',
]

const INTENSITY_OPTIONS: { value: Intensity; label: string; desc: string }[] = [
  { value: 'subtle', label: 'Subtle', desc: 'Plausible deniability' },
  { value: 'medium', label: 'Medium', desc: "They'll know" },
  { value: 'nuclear', label: 'Nuclear', desc: 'No survivors' },
]

const PERSONA_OPTIONS: { value: Persona; label: string }[] = [
  { value: 'colleague', label: 'Supportive colleague' },
  { value: 'consultant', label: 'Management consultant' },
  { value: 'thought_leader', label: 'Fellow thought leader' },
  { value: 'hr', label: 'HR professional' },
]

const EXAMPLE_POST = `I woke up at 3:47am. Not because I had to. But because winners don't sleep. 🚀

While you were dreaming, I was building. While you were comfortable, I was getting UNCOMFORTABLE.

My 7-figure morning routine:
• Cold plunge (4°C)
• 90 min deep work block
• Gratitude journal (3 things)
• Visualize my future self

The gap between you and your goals? It's called discipline.

Drop a 🔥 if you're committed to the grind.`

export default function Home() {
  const [post, setPost] = useState('')
  const [intensity, setIntensity] = useState<Intensity>('medium')
  const [persona, setPersona] = useState<Persona>('colleague')
  const [roasts, setRoasts] = useState<Roast[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MSGS[0])
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<number | null>(null)
  const msgTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function handleRoast() {
    if (!post.trim()) {
      setError('Paste a hustle bro post first. There is no shortage of material out there.')
      return
    }
    setError('')
    setRoasts([])
    setLoading(true)
    setLoadingMsg(LOADING_MSGS[0])

    let idx = 0
    msgTimerRef.current = setInterval(() => {
      idx = (idx + 1) % LOADING_MSGS.length
      setLoadingMsg(LOADING_MSGS[idx])
    }, 1800)

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post, intensity, persona }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Unknown error')
      setRoasts(data.roasts)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      if (msgTimerRef.current) clearInterval(msgTimerRef.current)
      setLoading(false)
    }
  }

  function copyComment(idx: number, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx)
      setTimeout(() => setCopied(null), 1600)
    })
  }

  function loadExample() {
    setPost(EXAMPLE_POST)
    setRoasts([])
    setError('')
  }

  return (
    <main className="content" style={{ minHeight: '100vh', padding: '0 16px 80px' }}>

      <header style={{ maxWidth: 640, margin: '0 auto', paddingTop: '56px', paddingBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span className="stamp">Beta</span>
          <span style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            v0.1 — Free while it lasts
          </span>
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(36px, 7vw, 58px)', lineHeight: 1.05, marginBottom: 12, color: 'var(--ink)' }}>
          Hustle Bro<br />Roast Machine™
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-muted)', lineHeight: 1.6, maxWidth: 460 }}>
          Paste any AI-generated hustle post. Receive a devastatingly polite corporate-speak comment.
          Paste. Deploy. Walk away.
        </p>
      </header>

      <section style={{ maxWidth: 640, margin: '0 auto' }}>

        <div style={{ borderTop: '1px solid var(--border)', marginBottom: 28 }} />

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: 500 }}>
              The offending post
            </label>
            <button
              onClick={loadExample}
              style={{ fontSize: 11, color: 'var(--gold-dark)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em', textDecoration: 'underline', textDecorationStyle: 'dotted', fontFamily: 'var(--font-mono)' }}
            >
              load example
            </button>
          </div>
          <textarea
            value={post}
            onChange={e => setPost(e.target.value)}
            placeholder="I woke up at 3:47am. Not because I had to. But because winners don't sleep..."
            rows={7}
            maxLength={2000}
          />
          <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--ink-faint)', marginTop: 4 }}>
            {post.length} / 2000
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: 500, display: 'block', marginBottom: 8 }}>
              Intensity
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {INTENSITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setIntensity(opt.value)}
                  style={{
                    flex: 1,
                    padding: '7px 4px',
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: intensity === opt.value ? 500 : 400,
                    border: `1px solid ${intensity === opt.value ? 'var(--gold)' : 'var(--border-strong)'}`,
                    borderRadius: 'var(--radius)',
                    background: intensity === opt.value ? 'var(--gold-light)' : 'var(--bg-card)',
                    color: intensity === opt.value ? 'var(--gold-dark)' : 'var(--ink-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'center',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: 500, display: 'block', marginBottom: 8 }}>
              Persona
            </label>
            <select value={persona} onChange={e => setPersona(e.target.value as Persona)}>
              {PERSONA_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--red-light)', border: '1px solid var(--red)', borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--red)' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleRoast}
          disabled={loading}
          style={{
            width: '100%',
            padding: '13px 24px',
            fontSize: 13,
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
            letterSpacing: '0.05em',
            background: loading ? 'var(--border)' : 'var(--ink)',
            color: loading ? 'var(--ink-muted)' : 'var(--bg)',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              {loadingMsg}
            </>
          ) : (
            <>Generate roast →</>
          )}
        </button>

        {roasts.length > 0 && (
          <div style={{ marginTop: 36 }}>
            <div style={{ borderTop: '1px solid var(--border)', marginBottom: 24 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: 500 }}>
                Ready to deploy
              </span>
              <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>3 comments generated</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {roasts.map((r, i) => (
                <div
                  key={i}
                  className="fade-slide-in"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px 18px',
                    animationDelay: `${i * 80}ms`,
                    opacity: 0,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <span style={{
                        display: 'inline-block',
                        fontSize: 10,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--gold-dark)',
                        background: 'var(--gold-light)',
                        padding: '2px 8px',
                        borderRadius: 2,
                        marginBottom: 10,
                        fontWeight: 500,
                      }}>
                        {r.angle}
                      </span>
                      <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
                        {r.comment}
                      </p>
                    </div>
                    <button
                      onClick={() => copyComment(i, r.comment)}
                      title="Copy to clipboard"
                      style={{
                        flexShrink: 0,
                        padding: '6px 10px',
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                        background: copied === i ? 'var(--gold-light)' : 'transparent',
                        border: `1px solid ${copied === i ? 'var(--gold)' : 'var(--border-strong)'}`,
                        borderRadius: 'var(--radius)',
                        color: copied === i ? 'var(--gold-dark)' : 'var(--ink-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {copied === i ? '✓ copied' : 'copy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>

      <footer style={{ maxWidth: 640, margin: '60px auto 0', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
        <p style={{ fontSize: 11, color: 'var(--ink-faint)', lineHeight: 1.6 }}>
          Hustle Bro Roast Machine™ — not affiliated with LinkedIn, hustle culture, or anyone who wakes up before 7am voluntarily.
        </p>
      </footer>

    </main>
  )
}
