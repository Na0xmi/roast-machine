import { NextRequest, NextResponse } from 'next/server'

const intensityDesc: Record<string, string> = {
  subtle: 'so subtle it could almost be sincere — they will only feel the burn on re-read',
  medium: 'clearly a roast but wrapped in corporate warmth — they know, we know',
  nuclear: 'devastating, no mercy — the corporate speak makes it even more brutal',
}

const personaDesc: Record<string, string> = {
  colleague: 'a well-meaning supportive LinkedIn colleague who is just a bit too enthusiastic and slightly too perceptive',
  consultant: 'a McKinsey-type management consultant who cannot help dropping frameworks and jargon into everything',
  thought_leader: 'a fellow thought leader who is clearly threatened and competing for engagement while pretending to be supportive',
  hr: 'an HR professional who is professionally concerned, deeply supportive, and somehow makes every compliment sound like a performance review',
 heidegger: 'Martin Heidegger, the perpetually miserable German existentialist philosopher, who sees the hustle bro\'s post as a profound symptom of das Man — the inauthentic they-self lost in idle talk, fallenness, and the dictatorship of the public. He responds with dense, gloomy philosophical language, randomly dropping untranslated German words and concepts such as Dasein, Weltanschauung, Angst, Zeitgeist, Sein, Geworfenheit, Verfallenheit, Eigentlichkeit into his sentences without explanation, as if the reader should already know. He sees every productivity hack as a flight from Being and a refusal to confront one\'s own thrownness and mortality. He is not impressed. He is never impressed.',
}

export async function POST(req: NextRequest) {
  try {
    const { post, intensity, persona } = await req.json()

    if (!post || typeof post !== 'string' || post.trim().length === 0) {
      return NextResponse.json({ error: 'Post content is required.' }, { status: 400 })
    }
    if (post.length > 2000) {
      return NextResponse.json({ error: 'Post is too long. Even hustle bros have limits.' }, { status: 400 })
    }

    const prompt = `You are a master of LinkedIn corporate-speak satire. Generate exactly 3 snarky LinkedIn comment roasts for the following hustle bro post.

The comments should be written in the voice of: ${personaDesc[persona] ?? personaDesc.colleague}

Roast intensity: ${intensityDesc[intensity] ?? intensityDesc.medium}

The comments must:
- Sound like genuine LinkedIn engagement on the surface
- Use corporate buzzwords, jargon, and hustle culture language ironically
- Be devastating in their implication but plausibly deniable
- Never use obvious insults — the snark lives in the subtext
- Be 1-3 sentences max each
- Each take a slightly different angle on why this post is ridiculous

Post to roast:
"${post.trim()}"

Respond ONLY with a JSON array of exactly 3 objects. Each object has:
- "comment": the roast comment text (no emojis unless they are deeply ironic)
- "angle": a 3-5 word label describing the approach (e.g. "Hollow validation", "Weaponized empathy", "Accidental self-own")

No markdown, no backticks, no preamble. Pure JSON array only.`

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message ?? 'Groq error')

    const text = data.choices[0].message.content.replace(/```json|```/g, '').trim()
    const roasts = JSON.parse(text)

    if (!Array.isArray(roasts) || roasts.length !== 3) {
      throw new Error('Unexpected response shape')
    }

    return NextResponse.json({ roasts })
  } catch (err) {
    console.error('Roast API error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Even the AI needed a break from the cringe.' },
      { status: 500 }
    )
  }
}
