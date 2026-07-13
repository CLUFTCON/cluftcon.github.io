import { ArrowDown, ArrowRight, CalendarDays, Mail, MapPin, Sprout, Users } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { AshiyuQuote } from '@/components/AshiyuQuote'
import { Header } from '@/components/Header'
import { InterestFormDrawer } from '@/components/InterestFormDrawer'
import { LanguageTreeScene, type SceneMode } from '@/components/SakuraScene'

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
      <div className="mode-segmented" role="group" aria-label="Read the tree">
        <span>Read the tree</span>
        <button type="button" aria-pressed={mode === 'bloom'} onClick={() => onChange('bloom')}>Bloom</button>
        <button className="parse-option" type="button" aria-pressed={mode === 'parse'} onClick={() => onChange('parse')}>Parse</button>
      </div>
    </div>
  )
}

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sceneMode, setSceneMode] = useState<SceneMode>('bloom')
  const [showTreeCue, setShowTreeCue] = useState(false)
  const [treeCueDismissed, setTreeCueDismissed] = useState(false)
  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  useEffect(() => {
    if (treeCueDismissed) return
    const cueTimer = window.setTimeout(() => setShowTreeCue(true), 3500)
    return () => window.clearTimeout(cueTimer)
  }, [treeCueDismissed])

  const changeSceneMode = useCallback((mode: SceneMode) => {
    setSceneMode(mode)
    setShowTreeCue(false)
    setTreeCueDismissed(true)
  }, [])

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
          <div className={`hero-art ${sceneMode === 'parse' ? 'is-parse' : ''}`}>
            <LanguageTreeScene mode={sceneMode} />
          </div>
          <TreeModeControl mode={sceneMode} showCue={showTreeCue} onChange={changeSceneMode} />
          <span className="sr-only" aria-live="polite">{sceneMode === 'bloom' ? 'Bloom view: animated sakura tree.' : 'Parse view: Universal Dependencies tree for the haiku.'}</span>
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
            <article className="volunteer-card"><span>VOLUNTEERS · COMING SOON</span><h3>Help the day bloom.</h3><p>We’ll soon recruit volunteers for guest welcome, poster support, photography, and room operations.</p><div>Signups opening later this year</div></article>
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
    </div>
  )
}
