import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

const quote = '“A place to dip your toes into research—and find the people who will wade in with you.”'

function VisualQuote({ wet = false }: { wet?: boolean }) {
  return (
    <div className="ashiyu-quote-position">
      <div className="ashiyu-quote-motion">
        <p className={`ashiyu-quote-text ${wet ? 'is-wet' : ''}`}>{quote}</p>
      </div>
    </div>
  )
}

export function AshiyuQuote() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (!root.current) return
    const scene = root.current
    const stage = scene.querySelector<HTMLElement>('.ashiyu-stage')
    const surface = scene.querySelector<HTMLElement>('.ashiyu-meniscus')
    const basinWall = scene.querySelector<HTMLElement>('.ashiyu-basin-wall')
    const quoteText = scene.querySelector<HTMLElement>('.ashiyu-quote-text:not(.is-wet)')
    if (!stage || !surface || !basinWall || !quoteText) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const userAgent = window.navigator.userAgent
    const isSafari = /Safari/i.test(userAgent) && !/(Chrome|Chromium|CriOS|FxiOS|EdgiOS|OPiOS|Android)/i.test(userAgent)
    const isFirefox = /(Firefox|FxiOS)/i.test(userAgent)
    const usesLightweightWater = isSafari || isFirefox
    scene.classList.toggle('is-safari', isSafari)
    scene.classList.toggle('is-firefox', isFirefox)
    let active = true
    let scrollTimeline: gsap.core.Timeline | undefined
    let causticTimeline: gsap.core.Timeline | undefined
    const context = gsap.context(() => {
      const motions = gsap.utils.toArray<HTMLElement>('.ashiyu-quote-motion')
      const quoteStart = () => stage.clientHeight * (window.innerWidth <= 600 ? .14 : .18)
      const waterline = () => surface.offsetTop
      const submergedY = () => {
        const quoteHeight = quoteText.getBoundingClientRect().height
        const surfaceClearance = 14
        const wallClearance = 16
        const belowSurface = waterline() + surfaceClearance
        const aboveBasinWall = stage.clientHeight - basinWall.offsetHeight - wallClearance - quoteHeight

        return Math.min(belowSurface, aboveBasinWall) - quoteStart()
      }
      const surfaceMoment = () => {
        const quoteHeight = quoteText.getBoundingClientRect().height
        const travel = submergedY()
        if (travel <= 0) return .55

        return gsap.utils.clamp(.34, .8, (waterline() - quoteStart() - quoteHeight * .98) / travel)
      }

      if (reducedMotion) {
        const straddleY = () => waterline() - quoteStart() - quoteText.getBoundingClientRect().height * .5
        gsap.set(motions, { y: straddleY })
        return
      }

      if (!usesLightweightWater) {
        causticTimeline = gsap.timeline({ repeat: -1, yoyo: true })
          .to('.ashiyu-caustic-layer-one', { xPercent: 4, yPercent: 2.5, duration: 11, ease: 'sine.inOut' }, 0)
          .to('.ashiyu-caustic-layer-two', { xPercent: -3, yPercent: -1.5, duration: 13, ease: 'sine.inOut' }, 0)
          .to('.ashiyu-surface-glint', { xPercent: 30, duration: 10, ease: 'sine.inOut' }, 0)
      }

      const crossing = surfaceMoment()
      scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: '+=100%',
          pin: stage,
          pinSpacing: true,
          scrub: usesLightweightWater ? true : .65,
          anticipatePin: 1,
          pinType: 'fixed',
          invalidateOnRefresh: true,
        },
      })

      scrollTimeline
        .to(motions, { y: submergedY, duration: 1, ease: 'none' }, 0)
        .to('.ashiyu-steam-path', { y: -30, opacity: 0, duration: .58, stagger: .04, ease: 'sine.in' }, .04)
        .to('.ashiyu-caustics', { opacity: .34, duration: 1, ease: 'none' }, 0)
        .fromTo('.ashiyu-surface-disturbance', { opacity: 0 }, { opacity: .72, duration: .14, ease: 'sine.out' }, crossing)
        .to('.ashiyu-surface-disturbance', { opacity: 0, duration: .2, ease: 'sine.in' }, crossing + .14)
        .fromTo('.ashiyu-bubble', { y: 14, scale: .6, opacity: 0 }, { y: -7, scale: 1, opacity: .46, duration: .13, stagger: .018, ease: 'sine.out' }, crossing + .05)
        .to('.ashiyu-bubble', { y: -24, opacity: 0, duration: .16, stagger: .014, ease: 'sine.in' }, crossing + .17)

      document.fonts?.ready.then(() => {
        if (active) ScrollTrigger.refresh()
      })
      requestAnimationFrame(() => {
        if (active) ScrollTrigger.refresh()
      })
    }, scene)

    return () => {
      active = false
      scrollTimeline?.scrollTrigger?.kill()
      scrollTimeline?.kill()
      causticTimeline?.kill()
      context.revert()
      scene.classList.remove('is-safari')
      scene.classList.remove('is-firefox')
    }
  }, [])

  return (
    <section className="ashiyu-scene" ref={root} aria-label="A quote dipping into an ashiyu footbath">
      <blockquote className="sr-only">{quote}</blockquote>
      <div className="ashiyu-stage">
        <span className="ashiyu-caption" aria-hidden>ASHIYU · FOOTBATH</span>

        <div className="ashiyu-pavilion" aria-hidden>
          <svg className="ashiyu-timber-frame" viewBox="0 0 1180 620" preserveAspectRatio="none">
            <defs>
              <linearGradient id="ashiyu-timber" x1="0" y1="0" x2="1" y2=".2">
                <stop stopColor="var(--palette-cedar)" />
                <stop offset=".48" stopColor="var(--palette-cedar-light)" />
                <stop offset="1" stopColor="var(--palette-cedar-dark)" />
              </linearGradient>
            </defs>
            <path className="timber-post" d="M210 70 L242 74 L258 620 L219 620 Z" />
            <path className="timber-post" d="M938 74 L970 70 L961 620 L922 620 Z" />
            <path className="timber-lintel timber-lintel-top" d="M-35 50 Q590 104 1215 50 L1209 64 Q590 118 -29 64 Z" />
            <path className="timber-lintel timber-lintel-lower" d="M68 132 Q590 150 1112 132 L1112 140 Q590 158 68 140 Z" />
            <path className="timber-seam" d="M194 66 L239 82 M942 81 L987 64 M324 82 L348 93 M832 93 L857 82" />
          </svg>
          <span className="ashiyu-foliage ashiyu-foliage-left" />
          <span className="ashiyu-foliage ashiyu-foliage-right" />
        </div>

        <svg className="ashiyu-lantern" viewBox="0 0 100 220" aria-hidden>
          <path className="lantern-stone lantern-base" d="M18 216 L25 197 L76 197 L84 216 Z" />
          <path className="lantern-stone lantern-pedestal" d="M39 198 L43 121 L59 121 L63 198 Z" />
          <path className="lantern-stone lantern-platform" d="M25 128 L31 113 L72 113 L79 128 Z" />
          <path className="lantern-stone lantern-house" d="M31 112 L34 69 L69 69 L72 112 Z" />
          <path className="lantern-opening" d="M43 80 L60 80 L60 101 L43 101 Z" />
          <path className="lantern-stone lantern-roof" d="M15 73 L28 54 L74 54 L88 73 Z" />
          <path className="lantern-stone lantern-cap" d="M42 55 L46 38 L56 38 L61 55 Z" />
          <path className="lantern-stone lantern-finial" d="M47 39 L51 27 L56 39 Z" />
          <path className="lantern-moss" d="M29 118 C36 113 43 116 47 121 C40 125 34 126 29 118 Z" />
        </svg>

        <svg className="ashiyu-filter-defs" width="0" height="0" aria-hidden>
          <filter id="ashiyu-refraction" x="-4%" y="-5%" width="108%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.055" numOctaves="1" seed="8" result="waterNoise" />
            <feDisplacementMap in="SourceGraphic" in2="waterNoise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        <svg className="ashiyu-steam" viewBox="0 0 1180 240" preserveAspectRatio="none" aria-hidden>
          <path className="ashiyu-steam-path" d="M310 205 C270 170 350 135 307 92 C280 65 306 37 335 20" />
          <path className="ashiyu-steam-path" d="M575 216 C620 176 545 145 590 104 C619 78 600 49 574 24" />
          <path className="ashiyu-steam-path" d="M845 205 C805 166 881 135 842 98 C813 70 836 43 865 20" />
        </svg>

        <div className="ashiyu-air" aria-hidden>
          <VisualQuote />
        </div>

        <div className="ashiyu-water" aria-hidden>
          <div className="ashiyu-basin-wall" />
          <div className="ashiyu-caustics">
            <span className="ashiyu-caustic-layer ashiyu-caustic-layer-one" />
            <span className="ashiyu-caustic-layer ashiyu-caustic-layer-two" />
          </div>
          <VisualQuote wet />
        </div>

        <svg className="ashiyu-stones" viewBox="0 400 1180 180" preserveAspectRatio="none" aria-hidden>
          <g className="stone-cluster stone-cluster-left">
            <g className="ashiyu-rock rock-one">
              <path className="stone-body" d="M-34 514 L-7 472 L28 430 L55 447 L105 483 L87 522 L17 530 Z" />
              <path className="stone-facet" d="M-7 472 L28 430 L55 447 L38 486 L-18 500 Z" />
              <path className="stone-facet stone-facet-soft" d="M55 447 L105 483 L87 522 L38 486 Z" />
            </g>
            <g className="ashiyu-rock rock-two">
              <path className="stone-body" d="M62 520 L79 488 L121 474 L168 482 L202 505 L176 526 L99 532 Z" />
              <path className="stone-facet" d="M79 488 L121 474 L168 482 L147 508 L98 515 Z" />
            </g>
            <g className="ashiyu-rock rock-three stone-detail">
              <path className="stone-body" d="M160 518 L179 476 L214 437 L238 465 L268 507 L232 527 L184 528 Z" />
              <path className="stone-facet" d="M179 476 L214 437 L221 486 L188 505 Z" />
              <path className="stone-facet stone-facet-soft" d="M214 437 L238 465 L268 507 L221 486 Z" />
            </g>
          </g>
          <g className="stone-cluster stone-cluster-right">
            <g className="ashiyu-rock rock-four">
              <path className="stone-body" d="M1071 516 L1090 480 L1121 465 L1149 427 L1173 454 L1208 470 L1234 512 L1196 531 L1114 528 Z" />
              <path className="stone-facet" d="M1090 480 L1121 465 L1149 427 L1157 487 L1110 506 Z" />
              <path className="stone-facet stone-facet-soft" d="M1149 427 L1173 454 L1208 470 L1157 487 Z" />
            </g>
            <g className="ashiyu-rock rock-five">
              <path className="stone-body" d="M975 522 L991 494 L1027 462 L1071 469 L1098 499 L1082 525 L1016 532 Z" />
              <path className="stone-facet" d="M991 494 L1027 462 L1044 505 L1007 517 Z" />
            </g>
            <g className="ashiyu-rock rock-six stone-detail">
              <path className="stone-body" d="M899 519 L918 490 L944 482 L958 445 L981 471 L1011 478 L1026 514 L990 528 L933 529 Z" />
              <path className="stone-facet" d="M918 490 L944 482 L958 445 L970 496 L933 513 Z" />
              <path className="stone-facet stone-facet-soft" d="M958 445 L981 471 L1011 478 L970 496 Z" />
            </g>
          </g>
        </svg>

        <div className="ashiyu-bubbles" aria-hidden>
          <span className="ashiyu-bubble bubble-one" />
          <span className="ashiyu-bubble bubble-two" />
          <span className="ashiyu-bubble bubble-three" />
          <span className="ashiyu-bubble bubble-four" />
          <span className="ashiyu-bubble bubble-five" />
        </div>

        <div className="ashiyu-meniscus" aria-hidden>
          <span className="ashiyu-surface-glint" />
          <span className="ashiyu-surface-disturbance" />
        </div>
        <div className="ashiyu-rim" aria-hidden><span /></div>
      </div>
    </section>
  )
}
