import { ArrowDown, ArrowRight, CalendarDays, ChevronDown, ChevronUp, Mail, MapPin, Sprout, Users } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { AshiyuQuote } from '@/components/AshiyuQuote'
import { Header } from '@/components/Header'
import { InterestFormDrawer } from '@/components/InterestFormDrawer'
import { LanguageTreeScene, type SceneMode } from '@/components/SakuraScene'
import { VolunteerFormDrawer } from '@/components/VolunteerFormDrawer'

const program = [
  { index: '01', title: 'Faculty keynotes', copy: 'Two to three invited talks opening new lines of inquiry.', state: 'Speakers forthcoming' },
  { index: '02', title: 'Presenter lunch', copy: 'A dedicated table for students, faculty, and founding partners.', state: 'Within 12–3 PM' },
  { index: '03', title: 'Poster showcase', copy: 'Undergraduate research in NLP, cognition, formal linguistics, and AI.', state: 'Bahen atrium' },
] as const

const sponsorBenefits = [
  ['01', 'Fund the first edition', 'Help establish a lasting Ontario home for undergraduate research.'],
  ['02', 'Meet emerging researchers', 'Connect with ambitious students at the beginning of their research careers.'],
  ['03', 'Make the room possible', 'Support poster printing, catering, merchandise, and speaker honorariums.'],
] as const

function SectionHeading({ eyebrow, title, copy, light = false }: { eyebrow: string; title: string; copy?: string; light?: boolean }) {
  return <header className={`section-heading ${light ? 'is-light' : ''}`}><span className="mono-kicker">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</header>
}

function TreeModeControl({ mode, showCue, onChange }: { mode: SceneMode; showCue: boolean; onChange: (value: SceneMode) => void }) {
  return (
    <div className={`tree-view-control ${showCue ? 'show-cue' : ''}`}>
      <div className="tree-view-cue" aria-hidden="true">
        <span>Two ways to read a tree</span>
        <svg viewBox="0 0 58 18"><path d="M1 4 C20 3 31 7 50 13"/><path d="M43 14 L51 13 L48 7"/></svg>
      </div>
      <TreeModeButtons mode={mode} onChange={onChange} />
    </div>
  )
}

function TreeModeButtons({ mode, onChange }: { mode: SceneMode; onChange: (value: SceneMode) => void }) {
  return (
    <div className="mode-segmented" role="group" aria-label="Read the tree">
      <span>Read the tree</span>
      <button type="button" aria-pressed={mode === 'bloom'} onClick={() => onChange('bloom')}>Bloom</button>
      <button className="parse-option" type="button" aria-pressed={mode === 'parse'} onClick={() => onChange('parse')}>Parse</button>
    </div>
  )
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const updateMatch = (event: MediaQueryListEvent) => setMatches(event.matches)
    mediaQuery.addEventListener('change', updateMatch)
    return () => mediaQuery.removeEventListener('change', updateMatch)
  }, [query])

  return matches
}

const teaserBlooms = [
  [52, 80, .7, -12],
  [83, 97, .54, 18],
  [110, 59, .64, 8],
  [137, 82, .48, -18],
  [164, 48, .6, 14],
  [187, 75, .46, -9],
  [213, 38, .55, 21],
] as const

function MobileTreeTeaser({ showCue, open, onOpen }: { showCue: boolean; open: boolean; onOpen: () => void }) {
  return (
    <button
      className={`mobile-tree-trigger ${showCue ? 'show-cue' : ''}`}
      type="button"
      onClick={onOpen}
      aria-label="Open the language tree"
      aria-expanded={open}
      aria-controls="mobile-tree-drawer"
    >
      <svg className="mobile-tree-teaser-art" viewBox="0 0 270 225" aria-hidden>
        <defs>
          <linearGradient id="mobile-teaser-branch" x1="1" y1="1" x2=".12" y2=".12">
            <stop stopColor="var(--palette-plum-625)" />
            <stop offset=".58" stopColor="var(--palette-plum-475)" />
            <stop offset="1" stopColor="var(--palette-plum-325)" />
          </linearGradient>
          <radialGradient id="mobile-teaser-bloom">
            <stop stopColor="var(--palette-rose-225)" />
            <stop offset=".55" stopColor="var(--palette-rose-425)" />
            <stop offset="1" stopColor="var(--palette-rose-850)" />
          </radialGradient>
          <path id="mobile-teaser-petal" d="M0 1 C-8 -5 -11 -17 -7 -27 C-4 -35 0 -39 0 -44 C4 -38 8 -33 10 -26 C14 -16 10 -5 0 1Z" />
        </defs>
        <g className="mobile-tree-teaser-canopy">
          <path className="mobile-tree-teaser-branch" d="M282 211 C239 197 220 174 199 143 C174 108 140 92 91 88 L94 99 C139 105 166 120 185 151 C207 187 235 214 276 224Z" />
          <path className="mobile-tree-teaser-branch branch-fine" d="M205 155 C183 118 178 79 211 36 L218 42 C190 82 193 116 214 150Z" />
          <path className="mobile-tree-teaser-branch branch-fine" d="M175 119 C151 91 125 74 98 58 L102 65 C128 83 148 99 168 126Z" />
          <path className="mobile-tree-teaser-branch branch-fine" d="M141 101 C113 101 82 90 54 69 L58 78 C83 99 111 110 142 109Z" />
          {teaserBlooms.map(([x, y, scale, rotation], bloomIndex) => (
            <g className="mobile-tree-teaser-bloom" transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`} key={bloomIndex}>
              {Array.from({ length: 5 }, (_, petalIndex) => (
                <use href="#mobile-teaser-petal" transform={`rotate(${petalIndex * 72}) translate(0 -4)`} key={petalIndex} />
              ))}
              <circle r="3.5" />
            </g>
          ))}
          <use className="mobile-tree-teaser-loose-petal" href="#mobile-teaser-petal" transform="translate(117 145) rotate(54) scale(.42)" />
          <use className="mobile-tree-teaser-loose-petal second" href="#mobile-teaser-petal" transform="translate(59 132) rotate(-28) scale(.32)" />
        </g>
      </svg>
      <span className="mobile-tree-teaser-action" aria-hidden>
        <small>Bloom / Parse</small>
        <i><ChevronUp /></i>
      </span>
    </button>
  )
}

function MobileTreeDrawer({
  open,
  mode,
  onChange,
  onClose,
}: {
  open: boolean
  mode: SceneMode
  onChange: (value: SceneMode) => void
  onClose: () => void
}) {
  const sheet = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !sheet.current) return
      const focusable = Array.from(sheet.current.querySelectorAll<HTMLElement>('button:not([disabled])'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose, open])

  if (!open) return null

  return (
    <div className="mobile-tree-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="mobile-tree-sheet" ref={sheet} role="dialog" aria-modal="true" aria-labelledby="mobile-tree-title">
        <div className="mobile-tree-sheet-head">
          <div>
            <span>Two ways to read a tree</span>
            <h2 id="mobile-tree-title">{mode === 'bloom' ? 'Sakura in bloom' : 'Haiku, parsed'}</h2>
          </div>
          <button ref={closeButton} className="mobile-tree-close" type="button" onClick={onClose} aria-label="Close tree drawer">
            <ChevronDown />
          </button>
        </div>
        <TreeModeButtons mode={mode} onChange={onChange} />
        <div className="mobile-tree-canvas">
          <LanguageTreeScene mode={mode} presentation="drawer" />
        </div>
        <p className="mobile-tree-caption">
          {mode === 'bloom'
            ? 'A botanical tree shaped by language.'
            : 'An original haiku arranged by Universal Dependencies.'}
        </p>
        <span className="sr-only" aria-live="polite">
          {mode === 'bloom' ? 'Bloom view: animated sakura tree.' : 'Parse view: Universal Dependencies tree for the haiku.'}
        </span>
      </div>
    </div>
  )
}

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [volunteerDrawerOpen, setVolunteerDrawerOpen] = useState(false)
  const [mobileTreeOpen, setMobileTreeOpen] = useState(false)
  const [sceneMode, setSceneMode] = useState<SceneMode>('bloom')
  const [showTreeCue, setShowTreeCue] = useState(false)
  const [treeCueDismissed, setTreeCueDismissed] = useState(() => {
    try {
      return window.localStorage.getItem('cluftcon-tree-discovered') === 'true'
    } catch {
      return false
    }
  })
  const isMobile = useMediaQuery('(max-width: 600px)')
  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])
  const openVolunteerDrawer = useCallback(() => setVolunteerDrawerOpen(true), [])
  const closeVolunteerDrawer = useCallback(() => setVolunteerDrawerOpen(false), [])

  useEffect(() => {
    if (treeCueDismissed) return
    const cueTimer = window.setTimeout(() => setShowTreeCue(true), 3500)
    return () => window.clearTimeout(cueTimer)
  }, [treeCueDismissed])

  const changeSceneMode = useCallback((mode: SceneMode) => {
    setSceneMode(mode)
    setShowTreeCue(false)
    setTreeCueDismissed(true)
    try {
      window.localStorage.setItem('cluftcon-tree-discovered', 'true')
    } catch {
      // Discovery persistence is supplementary.
    }
  }, [])

  const openMobileTree = useCallback(() => {
    setMobileTreeOpen(true)
    setShowTreeCue(false)
    setTreeCueDismissed(true)
    try {
      window.localStorage.setItem('cluftcon-tree-discovered', 'true')
    } catch {
      // The drawer remains fully usable when storage is unavailable.
    }
  }, [])

  const closeMobileTree = useCallback(() => setMobileTreeOpen(false), [])

  return (
    <div className="site-frame" id="top">
      <Header onJoin={openDrawer} />
      <main>
        <section className={`hero ${sceneMode === 'parse' ? 'is-parse' : ''}`}>
          <div className="hero-grain" aria-hidden />
          <div className="hero-copy">
            <span className="hero-eyebrow">University of Toronto <i /> Inaugural edition</span>
            <h1>Where language<br /><em>takes root.</em></h1>
            <p>Ontario’s first undergraduate research conference devoted to computational linguistics.</p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={openDrawer}>Join the interest list <ArrowRight /></button>
              <a className="button button-quiet" href="#story">Explore the conference <ArrowDown /></a>
            </div>
            <dl className="hero-colophon">
              <div><dt>Date</dt><dd>24 September 2026<br />12–3 PM EST</dd></div>
              <div><dt>Place</dt><dd>Bahen Centre atrium<br />U of T, St. George</dd></div>
            </dl>
          </div>
          {isMobile ? (
            <MobileTreeTeaser showCue={showTreeCue} open={mobileTreeOpen} onOpen={openMobileTree} />
          ) : (
            <>
              <div className={`hero-art ${sceneMode === 'parse' ? 'is-parse' : ''}`}>
                <LanguageTreeScene mode={sceneMode} />
              </div>
              <TreeModeControl mode={sceneMode} showCue={showTreeCue} onChange={changeSceneMode} />
              <span className="sr-only" aria-live="polite">{sceneMode === 'bloom' ? 'Bloom view: animated sakura tree.' : 'Parse view: Universal Dependencies tree for the haiku.'}</span>
            </>
          )}
          <div className="scroll-note"><span>Scroll to trace the sentence</span></div>
        </section>

        <section className="story paper-section" id="story">
          <div className="section-number">01 <span>THE STORY</span></div>
          <div className="story-grid">
            <SectionHeading eyebrow="A conference for first research" title="Ideas need somewhere to begin." />
            <div className="story-copy">
              <p className="lead"><strong>CLUFTCON</strong> <span>/ˈkləft.kɑn/</span> is a first-of-its-kind undergraduate research conference organized by CLCUOFT and UTMCLS.</p>
              <p>Major conferences show us where the field is going. CLUFTCON creates room for the earlier moment: the first question, the first experiment, the first poster, and the conversation that makes a student feel they belong in research.</p>
              <p>Students across Ontario may bring work from a class, a lab, or an independent project spanning NLP, cognitive science, formal linguistics, AI, and adjacent fields.</p>
            </div>
          </div>
          <AshiyuQuote />
          <div className="facts-rail">
            <article><CalendarDays /><span>WHEN</span><strong>September 24</strong><p>2026 · 12–3 PM EST</p></article>
            <article><MapPin /><span>WHERE</span><strong>Bahen Centre</strong><p>University of Toronto</p></article>
            <article><Users /><span>WHO</span><strong>Undergraduates</strong><p>From across Ontario</p></article>
          </div>
        </section>

        <section className="growth-section">
          <div className="growth-intro"><span className="mono-kicker">THE SENTENCE, ANNOTATED</span><h2>What grows here</h2><p>One afternoon, three ways to find your place in computational linguistics.</p></div>
          <div className="growth-grid">
            <article><span className="token">PRESENT <i>NOUN</i></span><h3>Give your work a voice.</h3><p>Translate an experiment, paper, or course project into a poster others can question and build upon.</p><div className="arc" aria-hidden>nsubj</div></article>
            <article><span className="token">LISTEN <i>VERB</i></span><h3>Follow a new branch.</h3><p>Hear faculty share the questions shaping NLP, language science, and the systems between them.</p><div className="arc" aria-hidden>root</div></article>
            <article><span className="token">CONNECT <i>VERB</i></span><h3>Meet your next collaborator.</h3><p>Trade ideas over lunch with students, researchers, and organizations investing in the field.</p><div className="arc" aria-hidden>conj</div></article>
          </div>
        </section>

        <section className="program paper-section" id="program">
          <div className="section-number">02 <span>THE PROGRAM</span></div>
          <SectionHeading eyebrow="24 · 09 · 26 / 12:00–15:00" title="An afternoon in three movements." copy="The full running order is still taking shape. These are the parts already rooted in the program." />
          <div className="program-list">
            {program.map((item) => <article key={item.index}><div className="bud"><span>{item.index}</span></div><div><h3>{item.title}</h3><p>{item.copy}</p></div><span className="program-state">{item.state}</span></article>)}
          </div>
        </section>

        <section className="speakers" id="speakers">
          <div className="section-number">03 <span>THE SPEAKERS</span></div>
          <SectionHeading eyebrow="Faculty voices · forthcoming" title="Three voices. New questions." copy="Invited faculty will bring distinct perspectives on language, computation, and cognition." light />
          <div className="speaker-grid">
            {[1, 2, 3].map((speaker) => <article key={speaker}><div className="portrait-placeholder"><span>0{speaker}</span><div className="botanical-mark">✣</div></div><p>SPEAKER_0{speaker}</p><h3>To be announced</h3><span>Faculty keynote · CLUFTCON 2026</span></article>)}
          </div>
        </section>

        <section className="attend" id="attend">
          <div className="attend-copy"><SectionHeading eyebrow="04 · ATTEND" title="Come curious. Leave connected." copy="Whether you present or simply want to listen, add your name and we’ll send the next announcement." light /><p className="eligibility">Open to undergraduate students across Ontario.</p></div>
          <div className="attend-cards">
            <article className="join-card"><span>INTEREST LIST · OPEN</span><Sprout /><h3>Be first to know.</h3><p>This is not formal registration. Tell us where to reach you when tickets and submissions open.</p><button onClick={openDrawer}>Join the list <ArrowRight /></button></article>
            <article className="volunteer-card"><span>VOLUNTEERS · OPEN</span><h3>Help the day bloom.</h3><p>Join the team for guest welcome, presenter support, poster setup, photography, and room operations.</p><button onClick={openVolunteerDrawer}>Volunteer with us <ArrowRight /></button></article>
          </div>
        </section>

        <section className="sponsors paper-section" id="sponsors">
          <div className="section-number">05 <span>FOUNDING PARTNERS</span></div>
          <div className="sponsor-top"><SectionHeading eyebrow="Help cultivate the first edition" title="Make room for the next generation." /><p>CLUFTCON is an ambitious student-led undertaking. Founding partners directly help us give undergraduate research the audience—and the future—it deserves.</p></div>
          <div className="sponsor-grid">{sponsorBenefits.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
          <div className="funding-line"><span>YOUR SUPPORT BECOMES</span><div><i>POSTERS</i><i>LUNCH</i><i>MERCH</i><i>HONORARIUMS</i></div></div>
          <a className="sponsor-cta" href="mailto:complanggroupuoft@gmail.com"><Mail /> Become a founding partner <span>complanggroupuoft@gmail.com</span></a>
        </section>
      </main>

      <footer><div><strong>CLUFTCON</strong><span>/ˈkləft.kɑn/</span></div><p>University of Toronto · September 24, 2026<br />Organized by CLCUOFT and UTMCLS</p><nav><a href="#story">Story</a><a href="#program">Program</a><a href="#attend">Attend</a><a href="#sponsors">Sponsors</a></nav><code>[ROOT → CLUFTCON_2026]</code></footer>
      <InterestFormDrawer open={drawerOpen} onClose={closeDrawer} />
      <VolunteerFormDrawer open={volunteerDrawerOpen} onClose={closeVolunteerDrawer} />
      {isMobile && <div id="mobile-tree-drawer"><MobileTreeDrawer open={mobileTreeOpen} mode={sceneMode} onChange={changeSceneMode} onClose={closeMobileTree} /></div>}
    </div>
  )
}
