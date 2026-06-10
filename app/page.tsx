'use client'

import { useState, useRef, useEffect } from 'react'

type Roast = { comment: string; angle: string }
type Intensity = 'subtle' | 'medium' | 'nuclear'
type Persona = 'colleague' | 'consultant' | 'thought_leader' | 'hr'| 'heidegger'

const LOADING_MSGS = [
  'シナジーを最大化中...',
  'Disrupting the hustle paradigm...',
  'Circling back to your humiliation...',
  'コーポレートスピークを生成中...',
  'Moving the needle on cringe...',
  'Taking this offline... then bringing it back hotter.',
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

const boxTitle = (color = '#003399'): React.CSSProperties => ({ background: color, color: '#fff', fontSize: 10, fontWeight: 'bold', padding: '3px 6px', letterSpacing: 0.5 })
const sectionBox = (borderColor = '#ccc'): React.CSSProperties => ({ border: `1px solid ${borderColor}`, margin: 6 })
const intBtn = (active: boolean): React.CSSProperties => ({ fontSize: 10, padding: '3px 0', border: active ? '1px solid #003399' : '1px solid #999', background: active ? '#003399' : '#f5f5f5', color: active ? '#fff' : '#333', cursor: 'pointer', fontFamily: 'inherit', flex: 1, textAlign: 'center' })

const s: Record<string, React.CSSProperties> = {
  topbar: { background: '#CC0000', color: '#fff', padding: '3px 8px', fontSize: 11, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #990000', flexWrap: 'wrap', gap: 4 },
  pill: { background: '#ffcc00', color: '#000', padding: '1px 6px', borderRadius: 2, fontWeight: 'bold', fontSize: 10 },
  ticker: { background: '#000', color: '#ffcc00', fontSize: 10, padding: '3px 0', overflow: 'hidden', whiteSpace: 'nowrap', borderBottom: '1px solid #333' },
  header: { background: '#003399', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '3px solid #ffcc00', flexWrap: 'wrap' },
  logo: { background: '#ffcc00', color: '#000', fontWeight: 'bold', fontSize: 14, padding: '4px 10px', border: '2px solid #000', letterSpacing: 1, flexShrink: 0 },
  nav: { background: '#eeeeee', borderBottom: '1px solid #999', display: 'flex', flexWrap: 'wrap' },
  navItem: { padding: '4px 12px', fontSize: 11, borderRight: '1px solid #999', cursor: 'pointer', whiteSpace: 'nowrap' },
  navActive: { padding: '4px 12px', fontSize: 11, borderRight: '1px solid #999', cursor: 'pointer', whiteSpace: 'nowrap', background: '#003399', color: '#fff' },
  body: { display: 'grid', gridTemplateColumns: '148px 1fr 140px', borderTop: '1px solid #ccc', alignItems: 'start' },
  sideL: { borderRight: '1px solid #ccc' },
  sideR: { borderLeft: '1px solid #ccc' },
  sideContent: { padding: '5px 6px', fontSize: 11, lineHeight: 1.6 },
  rankItem: { display: 'flex', gap: 4, alignItems: 'baseline', padding: '2px 0', borderBottom: '1px dotted #ccc', fontSize: 11 },
  formRow: { display: 'flex', alignItems: 'flex-start', gap: 6, padding: '5px 8px', borderBottom: '1px solid #eee' },
  formLabel: { fontSize: 11, color: '#333', minWidth: 70, paddingTop: 3, flexShrink: 0 },
  req: { color: '#CC0000', fontSize: 9 },
  textarea: { fontFamily: 'inherit', fontSize: 11, border: '1px solid #999', padding: 4, width: '100%', resize: 'vertical', background: '#fffef8', color: '#000', outline: 'none' },
  select: { fontFamily: 'inherit', fontSize: 11, border: '1px solid #999', padding: '3px 4px', background: '#fff', color: '#000', width: '100%' },
  submitArea: { padding: 8, background: '#f0f4ff', borderTop: '2px solid #003399', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  submitBtn: { background: '#CC0000', color: '#fff', fontSize: 13, fontWeight: 'bold', border: '2px solid #990000', padding: '7px 20px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 },
  resultCard: { border: '1px solid #ccc', margin: 6 },
  resultMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 9px', background: '#f5f5f5', borderTop: '1px solid #ddd', fontSize: 10, color: '#666', flexWrap: 'wrap', gap: 4 },
  copyBtn: { fontSize: 10, border: '1px solid #999', background: '#fff', padding: '2px 8px', cursor: 'pointer', color: '#003399', fontFamily: 'inherit' },
  angleTag: { fontSize: 10, fontWeight: 'bold', color: '#CC0000', marginBottom: 4 },
  newBadge: { background: '#CC0000', color: '#fff', fontSize: 9, fontWeight: 'bold', padding: '1px 4px' },
  dot: { width: 7, height: 7, borderRadius: '50%', background: '#00cc00', display: 'inline-block', animation: 'blink 1.2s step-start infinite', flexShrink: 0 as const },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#ccc', margin: 6, border: '1px solid #ccc' },
  stat: { background: '#fff', padding: '5px 6px' },
  adBox: { background: '#fffbe6', border: '1px dashed #cc9900', padding: 5, margin: '5px 6px', textAlign: 'center' as const, fontSize: 10, color: '#996600' },
  footer: { background: '#003399', color: '#ccc', fontSize: 10, padding: '6px 10px', display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' as const, borderTop: '3px solid #ffcc00' },
  step: { display: 'flex', gap: 5, alignItems: 'flex-start', padding: '3px 0', fontSize: 11 },
  stepNum: { background: '#003399', color: '#fff', fontSize: 9, fontWeight: 'bold' as const, minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 as const },
}

export default function Home() {
  const [post, setPost] = useState('')
  const [intensity, setIntensity] = useState<Intensity>('medium')
  const [persona, setPersona] = useState<Persona>('colleague')
  const [roasts, setRoasts] = useState<Roast[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MSGS[0])
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<number | null>(null)
  const [counter, setCounter] = useState(847)
  const msgTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const t = setInterval(() => setCounter(c => c + Math.floor(Math.random() * 3)), 4000)
    return () => clearInterval(t)
  }, [])

  async function handleRoast() {
    if (!post.trim()) { setError('Please paste a hustle bro post first.'); return }
    setError(''); setRoasts([]); setLoading(true); setLoadingMsg(LOADING_MSGS[0])
    let idx = 0
    msgTimerRef.current = setInterval(() => { idx = (idx + 1) % LOADING_MSGS.length; setLoadingMsg(LOADING_MSGS[idx]) }, 1800)
    try {
      const res = await fetch('/api/roast', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ post, intensity, persona }) })
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
    navigator.clipboard.writeText(text).then(() => { setCopied(idx); setTimeout(() => setCopied(null), 1600) })
  }

  const intensityOpts: { value: Intensity; label: string }[] = [
    { value: 'subtle', label: 'Subtle' },
    { value: 'medium', label: 'Medium' },
    { value: 'nuclear', label: 'Nuclear 🔥' },
  ]

  const personaOpts: { value: Persona; label: string }[] = [
    { value: 'colleague', label: 'Supportive colleague' },
    { value: 'consultant', label: 'Management consultant' },
    { value: 'thought_leader', label: 'Fellow thought leader' },
    { value: 'hr', label: 'HR professional' },
    { value: 'heidegger', label: 'Heidegger (miserable)' },
  ]

  return (
    <div>
      {/* Topbar */}
      <div style={s.topbar}>
        <span>🇯🇵 ハッスルブロ・ローストマシン™ | HUSTLE BRO ROAST MACHINE™ OFFICIAL</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span>2026年6月8日 月曜日</span>
          <span style={s.pill}>NEW!</span>
          <span style={{ ...s.pill, background: '#00cc66' }}>FREE</span>
          <span>会員登録 | ログイン | ヘルプ</span>
        </div>
      </div>

      {/* Ticker */}
      <div style={s.ticker}>
        <span style={{ display: 'inline-block', animation: 'marquee 28s linear infinite', paddingLeft: '100%' }}>
          ★ 本日の新着ローストコメント 1,204件 ★ 「昨日より今日、今日より明日」という精神で働く人々を応援します ★ ROAST INTENSITY: NUCLEAR が人気 NO.1 ★ 今すぐ無料登録してポイントをゲット！ ★ ハッスル文化を撲滅しましょう ★ CAT OF THE DAY: にゃー ★ 本日の訪問者数が過去最高を更新中 ★
        </span>
      </div>

      {/* Header */}
      <div style={s.header}>
        <div style={s.logo}>HBRM™</div>
        <div>
          <div style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', lineHeight: 1.3 }}>
            ハッスルブロ・ローストマシン™<br />
            <span style={{ fontSize: 11, fontWeight: 'normal' }}>Hustle Bro Roast Machine — Corporate Speak Edition</span>
          </div>
          <div style={{ color: '#99ccff', fontSize: 10 }}>AIが生成したビジネス系投稿を優雅に破壊するサービス</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ background: '#000', color: '#00ff00', fontFamily: 'monospace', fontSize: 11, padding: '2px 6px', border: '1px solid #00ff00' }}>
            本日の訪問者: {String(counter).padStart(5, '0')}
          </div>
          <div style={{ color: '#ffcc00', fontSize: 10, marginTop: 2 }}>総ローストカウント: 48,291</div>
        </div>
      </div>

      {/* Nav */}
      <div style={s.nav}>
        <div style={s.navActive}>ホーム</div>
        {['ローストする','ランキング','みんなのコメント','使い方','よくある質問','お問い合わせ'].map(n => (
          <div key={n} style={s.navItem}>{n}</div>
        ))}
        <div style={{ ...s.navItem, marginLeft: 'auto', background: '#ffcc00', color: '#000', fontWeight: 'bold' }}>★ 会員登録無料</div>
      </div>

      {/* Body */}
      <div style={s.body}>

        {/* Left sidebar */}
        <div style={s.sideL}>
          <div style={{ borderBottom: '1px solid #ccc' }}>
            <div style={boxTitle()}>📊 本日のランキング</div>
            <div style={s.sideContent}>
              <div style={{ fontSize: 10, color: '#666', marginBottom: 3 }}>人気ローストトップ5</div>
              {['Hollow validation','Weaponised empathy','Nuclear persona','Accidental self-own','Consultant mode'].map((t, i) => (
                <div key={t} style={s.rankItem}><span style={{ color: '#CC0000', fontWeight: 'bold', minWidth: 14 }}>{i+1}.</span><span>{t}</span></div>
              ))}
            </div>
          </div>

          <div style={{ borderBottom: '1px solid #ccc' }}>
            <div style={boxTitle('#CC0000')}>🔥 人気タグ</div>
            <div style={s.sideContent}>
              {['#コールドプランジ','#7figures','#grind','#3am','#mindset','#disruption','#hustle'].map(tag => (
                <span key={tag} style={{ fontSize: 10, background: '#ffe0e0', padding: '1px 5px', margin: '2px', display: 'inline-block', border: '1px solid #ffaaaa' }}>{tag}</span>
              ))}
            </div>
          </div>

          <div style={{ borderBottom: '1px solid #ccc' }}>
            <div style={boxTitle('#006600')}>🐱 今日のネコ</div>
            <div style={{ border: '2px solid #ff69b4', background: '#fff0f8', padding: 5, margin: 6, textAlign: 'center' }}>
              <img src="/cat.gif" alt="今日のネコ" style={{ width: '100%', display: 'block', imageRendering: 'pixelated' }} />
              <div style={{ fontSize: 9, color: '#ff69b4', marginTop: 3 }}>作業中のネコ ♥<br /><span style={{ color: '#999' }}>「私もローストしてあげる」</span></div>
            </div>
          </div>

          <div style={{ borderBottom: '1px solid #ccc' }}>
            <div style={s.statsGrid}>
              {[['3','コメント/回'],['∞','cringe耐性'],['99%','破壊率'],['0円','費用']].map(([num, label], i) => (
                <div key={label} style={s.stat}>
                  <div style={{ fontSize: 18, fontWeight: 'bold', color: ['#CC0000','#003399','#006600','#660099'][i] }}>{num}</div>
                  <div style={{ fontSize: 9, color: '#666' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={s.adBox}>
            【PR】LinkedIn疲れに効く！<br />
            <strong style={{ color: '#cc0000' }}>ローストで心をリフレッシュ♪</strong><br />
            <span style={{ textDecoration: 'underline', color: '#003399', cursor: 'pointer' }}>詳細はこちら</span>
          </div>

          <div style={{ borderBottom: '1px solid #ccc' }}>
            <div style={boxTitle('#660099')}>🌤 今日の格言</div>
            <div style={{ ...s.sideContent, fontSize: 10, color: '#444', fontStyle: 'italic' }}>
              &ldquo;The best roast is the one they read twice before realising.&rdquo;<br />
              <span style={{ color: '#999' }}>— 匿名ユーザー #4821</span>
            </div>
          </div>
        </div>

        {/* Main */}
        <div>
          <div style={{ background: '#fff9e6', borderBottom: '2px solid #ffcc00', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, color: '#666' }}>ホーム &gt; ローストする &gt; 新規投稿</span>
            <span style={s.newBadge}>NEW</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
              <span style={s.dot} /><span style={{ color: '#006600' }}>現在 <strong>247人</strong> がローストを作成中</span>
            </div>
          </div>

          <div style={{ background: '#ffcc00', border: '2px solid #CC0000', padding: '4px 8px', margin: 6, fontSize: 11, fontWeight: 'bold', textAlign: 'center', color: '#CC0000' }}>
            ⚡ 期間限定！NUCLEAR モードが今なら無料！今すぐお試しください ⚡
          </div>

          {/* How to use */}
          <div style={sectionBox('#003399')}>
            <div style={boxTitle()}>📋 How to use</div>
            <div style={{ padding: '7px 9px', background: '#f0f4ff' }}>
              {[
                'Paste an AI-generated hustle bro LinkedIn post into the box below',
                'Choose your roast intensity and persona',
                'Click Generate roast and wait ~3 seconds',
                'Copy your favourite comment and paste it on LinkedIn. Walk away.',
              ].map((text, i) => (
                <div key={i} style={s.step}>
                  <div style={s.stepNum}>{i+1}</div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Input */}
          <div style={sectionBox()}>
            <div style={boxTitle()}>✏️ Paste the offending post here <span style={{ fontWeight: 'normal', fontSize: 9 }}>（必須 / required）</span></div>
            <div style={s.formRow}>
              <div style={s.formLabel}>Post content <span style={s.req}>★</span></div>
              <div style={{ flex: 1 }}>
                <textarea
                  style={s.textarea}
                  rows={6}
                  value={post}
                  onChange={e => setPost(e.target.value)}
                  maxLength={2000}
                  placeholder="e.g. I woke up at 3:47am. Not because I had to. But because winners don't sleep..."
                />
                <div style={{ fontSize: 10, color: '#999', marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Max 2,000 characters | <span style={{ color: '#003399', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { setPost(EXAMPLE_POST); setRoasts([]); setError('') }}>Load example post</span></span>
                  <span>{post.length} / 2000</span>
                </div>
              </div>
            </div>

            <div style={s.formRow}>
              <div style={s.formLabel}>Roast intensity <span style={s.req}>★</span></div>
              <div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {intensityOpts.map(opt => (
                    <button key={opt.value} onClick={() => setIntensity(opt.value)} style={intBtn(intensity === opt.value)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 9, color: '#666', marginTop: 3 }}>※ Nuclear contains extremely devastating content. Proceed with caution.</div>
              </div>
            </div>

            <div style={s.formRow}>
              <div style={s.formLabel}>Persona <span style={s.req}>★</span></div>
              <select style={{ ...s.select, width: 220 }} value={persona} onChange={e => setPersona(e.target.value as Persona)}>
                {personaOpts.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            <div style={{ ...s.formRow, borderBottom: 'none' }}>
              <div style={s.formLabel}>Options</div>
              <div style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <label><input type="checkbox" defaultChecked style={{ marginRight: 4 }} /> Earn points (+10pt) per roast</label>
                <label><input type="checkbox" style={{ marginRight: 4 }} /> Share to community hall of fame</label>
                <label><input type="checkbox" style={{ marginRight: 4 }} /> Email me the results</label>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ margin: 6, padding: '8px 10px', background: '#fff0f0', border: '1px solid #CC0000', fontSize: 12, color: '#CC0000' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <div style={s.submitArea}>
            <button style={s.submitBtn} onClick={handleRoast} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  {loadingMsg}
                </span>
              ) : '▶ Generate roast'}
            </button>
            <div style={{ fontSize: 10, color: '#666', lineHeight: 1.5 }}>
              By clicking you agree to the <a href="#">terms of service</a>.<br />
              Generation takes ~3–5 seconds. Please wait.
            </div>
            <div style={{ marginLeft: 'auto', background: '#006600', color: '#fff', fontSize: 10, padding: '2px 6px' }}>🎁 +10pt</div>
          </div>

          {/* Results */}
          {roasts.length > 0 && (
            <div style={sectionBox('#006600')}>
              <div style={boxTitle('#006600')}>✅ Results — 3 comments generated</div>
              {roasts.map((r, i) => (
                <div key={i} style={{ ...s.resultCard, animationDelay: `${i * 80}ms` }} className="fade-in">
                  <div style={{ background: '#f9fff9', padding: '6px 8px', borderBottom: '1px solid #ddd' }}>
                    <div style={s.angleTag}>【No.{i+1}】 {r.angle.toUpperCase()}</div>
                    <div style={{ fontSize: 12, color: '#111', lineHeight: 1.65 }}>{r.comment}</div>
                  </div>
                  <div style={s.resultMeta}>
                    <span>Intensity: {intensity} | Persona: {persona.replace('_', ' ')} | {new Date().toLocaleTimeString()}</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button style={s.copyBtn} onClick={() => copyComment(i, r.comment)}>
                        {copied === i ? '✓ Copied!' : 'Copy'}
                      </button>
                      <button style={{ ...s.copyBtn, color: '#CC0000' }}>Report</button>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ padding: '6px 8px', background: '#fffbe6', borderTop: '1px solid #ddd', fontSize: 10, color: '#666', display: 'flex', justifyContent: 'space-between' }}>
                <span>生成完了。3件のコメントを保存しました。</span>
                <span style={{ color: '#006600', fontWeight: 'bold' }}>+10ポイント獲得！</span>
              </div>
            </div>
          )}

          {roasts.length > 0 && (
            <div style={{ margin: 6, border: '1px solid #ffcc00', background: '#fffbe6', padding: '6px 8px', fontSize: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>💡</span>
              <span><strong>Tip:</strong> Copy the comment and paste it directly into LinkedIn. Consider adding a 😊 emoji to maximise plausible deniability.</span>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={s.sideR}>
          <div style={{ borderBottom: '1px solid #ccc' }}>
            <div style={boxTitle('#cc6600')}>📰 最新ニュース</div>
            <div style={{ ...s.sideContent, fontSize: 10, lineHeight: 1.7 }}>
              {[
                { badge: true, text: 'LinkedInで話題の「4am club」投稿が急増中' },
                { text: 'コールドプランジ関連投稿が前月比340%増' },
                { text: '「7 figures」が今週最多使用ワードに' },
                { text: 'ハッスルブロ撲滅委員会が設立' },
              ].map((item, i) => (
                <div key={i} style={{ borderBottom: '1px dotted #ccc', paddingBottom: 4, marginBottom: 4 }}>
                  {item.badge && <span style={s.newBadge}>NEW </span>}{item.text}
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderBottom: '1px solid #ccc' }}>
            <div style={boxTitle('#222')}>👥 コミュニティ</div>
            <div style={{ ...s.sideContent, fontSize: 10, lineHeight: 1.7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <span style={s.dot} /> 247人がオンライン中
              </div>
              <div>会員数: <strong>12,847人</strong></div>
              <div>本日の投稿: <strong>1,204件</strong></div>
              <div>最高ロースト評価:<br /><span style={{ color: '#CC0000' }}>★★★★★ (4,821pt)</span></div>
              <div style={{ marginTop: 5, paddingTop: 5, borderTop: '1px dotted #ccc' }}>
                <span style={{ background: '#003399', color: '#fff', fontSize: 9, padding: '1px 4px' }}>TOP USER</span> user_4821
              </div>
            </div>
          </div>

          <div style={{ borderBottom: '1px solid #ccc' }}>
            <div style={boxTitle('#CC0000')}>⚠️ 注意事項</div>
            <div style={{ ...s.sideContent, fontSize: 10, color: '#444', lineHeight: 1.6 }}>
              ・実名での投稿はお控えください<br />
              ・誹謗中傷はNGです<br />
              ・18歳未満はご利用になれません<br />
              ・利用規約をよくお読みください
            </div>
          </div>

          <div style={{ borderBottom: '1px solid #ccc' }}>
            <div style={boxTitle('#006600')}>🏆 今週のMVP</div>
            <div style={{ ...s.sideContent, fontSize: 10, textAlign: 'center', padding: 8 }}>
              <div style={{ fontSize: 24 }}>🥇</div>
              <div style={{ fontWeight: 'bold', color: '#CC0000' }}>linkedinkiller_99</div>
              <div style={{ color: '#666' }}>ロースト数: 892件</div>
              <div style={{ color: '#006600' }}>獲得ポイント: 8,920pt</div>
            </div>
          </div>

          <div style={{ ...s.adBox, borderColor: '#cc0000', background: '#fff0f0', margin: '5px 6px' }}>
            <strong style={{ color: '#cc0000' }}>▶ 有料プランで<br />無制限にロースト！</strong><br />
            <span style={{ fontSize: 9 }}>月額980円（税込）〜</span><br />
            <span style={{ textDecoration: 'underline', color: '#003399', cursor: 'pointer', fontSize: 10 }}>今すぐ申し込む</span>
          </div>

          <div style={{ borderBottom: '1px solid #ccc' }}>
            <div style={boxTitle('#660099')}>📅 今日のできごと</div>
            <div style={{ ...s.sideContent, fontSize: 10, lineHeight: 1.7 }}>
              <div>2026年6月8日 月</div>
              <div style={{ color: '#CC0000', fontWeight: 'bold' }}>ローストの日</div>
              <div style={{ marginTop: 4 }}>☁ 東京: 23°C</div>
              <div>💼 ハッスル指数: 高</div>
              <div>😤 cringe警戒度: 最大</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={s.footer}>
        <div>
          <strong style={{ color: '#fff' }}>ハッスルブロ・ローストマシン™</strong><br />
          © 2026 Roast Machine Inc. All rights reserved.<br />
          運営会社 | プライバシーポリシー | 特定商取引法に基づく表記
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['お問い合わせ','採用情報','広告掲載','サイトマップ'].map(t => <a key={t} href="#" style={{ color: '#99ccff' }}>{t}</a>)}
        </div>
        <div style={{ color: '#ffcc00', fontSize: 10 }}>
          推奨環境: Internet Explorer 11以上<br />
          画面解像度: 1024×768以上
        </div>
      </div>
    </div>
  )
}