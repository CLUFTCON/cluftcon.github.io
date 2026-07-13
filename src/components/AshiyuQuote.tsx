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
    const rim = scene.querySelector<HTMLElement>('.ashiyu-rim')
    const basinWall = scene.querySelector<HTMLElement>('.ashiyu-basin-wall')
    const quoteText = scene.querySelector<HTMLElement>('.ashiyu-quote-text:not(.is-wet)')
    if (!stage || !rim || !basinWall || !quoteText) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let active = true
    let scrollTimeline: gsap.core.Timeline | undefined
    let causticTimeline: gsap.core.Timeline | undefined
    const context = gsap.context(() => {
      const motions = gsap.utils.toArray<HTMLElement>('.ashiyu-quote-motion')
      const quoteStart = () => stage.clientHeight * (window.innerWidth <= 600 ? .14 : .18)
      const waterline = () => rim.offsetTop + rim.offsetHeight / 2
      const submergedY = () => {
        const quoteHeight = quoteText.getBoundingClientRect().height
        const surfaceClearance = 14
        const wallClearance = 16
        const belowSurface = waterline() + surfaceClearance
        const aboveBasinWall = stage.clientHeight - basinWall.offsetHeight - wallClearance - quoteHeight

        return Math.min(belowSurface, aboveBasinWall) - quoteStart()
      }

      if (reducedMotion) {
        const straddleY = () => waterline() - quoteStart() - quoteText.getBoundingClientRect().height * .5
        gsap.set(motions, { y: straddleY })
        return
      }

      causticTimeline = gsap.timeline({ repeat: -1, yoyo: true })
        .to('.ashiyu-caustic-field', { xPercent: 4, yPercent: 2.5, scale: 1.035, duration: 8, ease: 'sine.inOut' }, 0)
        .to('.ashiyu-caustic-noise', { attr: { baseFrequency: '.016 .034' }, duration: 8, ease: 'sine.inOut' }, 0)

      scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: '+=100%',
          pin: stage,
          pinSpacing: true,
          scrub: .65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      scrollTimeline
        .to(motions, { y: submergedY, duration: 1, ease: 'none' }, 0)
        .to('.ashiyu-steam-path', { y: -30, opacity: 0, duration: .58, stagger: .04, ease: 'sine.in' }, .04)
        .to('.ashiyu-caustics', { opacity: .29, duration: 1, ease: 'none' }, 0)
        .fromTo('.ripple-one', { attr: { rx: 52 }, opacity: 0 }, { attr: { rx: 285 }, opacity: .5, duration: .3, ease: 'sine.out' }, .38)
        .to('.ripple-one', { opacity: 0, duration: .2, ease: 'sine.in' }, .62)
        .fromTo('.ripple-two', { attr: { rx: 34 }, opacity: 0 }, { attr: { rx: 220 }, opacity: .36, duration: .3, ease: 'sine.out' }, .44)
        .to('.ripple-two', { opacity: 0, duration: .2, ease: 'sine.in' }, .68)

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
    }
  }, [])

  return (
    <section className="ashiyu-scene" ref={root} aria-label="A quote dipping into an ashiyu footbath">
      <blockquote className="sr-only">{quote}</blockquote>
      <div className="ashiyu-stage">
        <span className="ashiyu-caption" aria-hidden>ASHIYU · FOOTBATH</span>

        <div className="ashiyu-pavilion" aria-hidden>
          <i className="ashiyu-beam ashiyu-beam-top" />
          <i className="ashiyu-beam ashiyu-beam-left" />
          <i className="ashiyu-beam ashiyu-beam-right" />
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
          <filter id="ashiyu-caustic-light" x="-18%" y="-18%" width="136%" height="136%" colorInterpolationFilters="sRGB">
            <feTurbulence className="ashiyu-caustic-noise" type="fractalNoise" baseFrequency=".012 .028" numOctaves="2" seed="14" result="causticNoise" />
            <feSpecularLighting in="causticNoise" surfaceScale="5" specularConstant="1.1" specularExponent="30" lightingColor="#fff1cf" result="causticSpecular">
              <feDistantLight azimuth="228" elevation="56" />
            </feSpecularLighting>
            <feComponentTransfer in="causticSpecular" result="causticHighlights">
              <feFuncR type="gamma" amplitude="1.1" exponent="2.1" offset="0" />
              <feFuncG type="gamma" amplitude="1.05" exponent="2.2" offset="0" />
              <feFuncB type="gamma" amplitude=".92" exponent="2.3" offset="0" />
              <feFuncA type="gamma" amplitude="1" exponent="2.8" offset="0" />
            </feComponentTransfer>
            <feComposite in="causticHighlights" in2="SourceGraphic" operator="in" />
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
          <svg className="ashiyu-caustics" viewBox="0 0 1180 900" preserveAspectRatio="none">
            <rect className="ashiyu-caustic-field" x="-120" y="-100" width="1420" height="1100" rx="80" filter="url(#ashiyu-caustic-light)" />
          </svg>
          <VisualQuote wet />
        </div>

        <svg className="ashiyu-stones" viewBox="0 400 1180 180" preserveAspectRatio="none" aria-hidden>
          <g className="stone-cluster stone-cluster-left">
            <g className="ashiyu-rock rock-one">
              <path className="stone-body" d="M-23 503 L8 457 L63 431 L109 469 L92 512 L38 528 Z" />
              <path className="stone-facet" d="M8 457 L63 431 L50 480 L-8 492 Z" />
            </g>
            <g className="ashiyu-rock rock-two">
              <path className="stone-body" d="M66 511 L88 472 L136 454 L181 478 L194 507 L144 532 L94 527 Z" />
              <path className="stone-facet" d="M88 472 L136 454 L151 493 L112 506 Z" />
            </g>
            <g className="ashiyu-rock rock-three stone-detail">
              <path className="stone-body" d="M159 501 L172 466 L211 448 L252 469 L261 497 L224 514 L184 512 Z" />
              <path className="stone-facet" d="M172 466 L211 448 L221 483 L190 493 Z" />
            </g>
          </g>
          <g className="stone-cluster stone-cluster-right">
            <g className="ashiyu-rock rock-four">
              <path className="stone-body" d="M1080 502 L1099 463 L1151 432 L1204 461 L1230 498 L1191 526 L1129 523 Z" />
              <path className="stone-facet" d="M1099 463 L1151 432 L1167 483 L1120 496 Z" />
            </g>
            <g className="ashiyu-rock rock-five">
              <path className="stone-body" d="M992 510 L1015 474 L1060 457 L1108 476 L1124 510 L1078 533 L1028 527 Z" />
              <path className="stone-facet" d="M1015 474 L1060 457 L1075 494 L1039 505 Z" />
            </g>
            <g className="ashiyu-rock rock-six stone-detail">
              <path className="stone-body" d="M918 500 L937 467 L976 450 L1015 470 L1027 499 L990 516 L950 513 Z" />
              <path className="stone-facet" d="M937 467 L976 450 L988 484 L955 494 Z" />
            </g>
          </g>
        </svg>

        <svg className="ashiyu-ripples" viewBox="0 0 1180 100" preserveAspectRatio="none" aria-hidden>
          <ellipse className="ripple-one" cx="590" cy="50" rx="285" ry="18" />
          <ellipse className="ripple-two" cx="590" cy="52" rx="220" ry="11" />
        </svg>

        <div className="ashiyu-rim" aria-hidden><span /></div>
      </div>
    </section>
  )
}
