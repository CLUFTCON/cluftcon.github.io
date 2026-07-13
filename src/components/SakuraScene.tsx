import gsap from 'gsap'
import { useLayoutEffect, useRef } from 'react'

export type SceneMode = 'bloom' | 'parse'

type Point = readonly [number, number]
type BranchSpline = {
  start: Point
  control1: Point
  control2: Point
  end: Point
  startWidth: number
  endWidth: number
  level: 0 | 1 | 2
}

type Bloom = {
  x: number
  y: number
  scale: number
  rotation: number
  tone: 1 | 2 | 3
  form: 'full' | 'partial' | 'bud'
  level: 0 | 1 | 2
}

type ParseToken = {
  id: number
  word: string
  pos: string
  head: number
  relation: string
  x: number
  y: number
  labelX?: number
  labelY?: number
}

const parseTokens: ParseToken[] = [
  { id: 1, word: 'Pink', pos: 'ADJ', head: 2, relation: 'amod', x: 500, y: 310, labelX: -14 },
  { id: 2, word: 'petals', pos: 'NOUN', head: 9, relation: 'nsubj', x: 630, y: 420, labelX: -14 },
  { id: 3, word: 'drifting', pos: 'VERB', head: 2, relation: 'acl', x: 710, y: 295, labelX: 14 },
  { id: 4, word: 'through', pos: 'ADP', head: 6, relation: 'case', x: 530, y: 75, labelX: -10 },
  { id: 5, word: 'the', pos: 'DET', head: 6, relation: 'det', x: 650, y: 65, labelX: -8 },
  { id: 6, word: 'branches', pos: 'NOUN', head: 3, relation: 'obl', x: 680, y: 180, labelX: -12 },
  { id: 7, word: 'of', pos: 'ADP', head: 8, relation: 'case', x: 790, y: 55, labelX: -8 },
  { id: 8, word: 'language', pos: 'NOUN', head: 6, relation: 'nmod', x: 850, y: 150, labelX: 15 },
  { id: 9, word: 'carry', pos: 'VERB', head: 0, relation: 'root', x: 820, y: 540 },
  { id: 10, word: 'meanings', pos: 'NOUN', head: 9, relation: 'obj', x: 950, y: 420, labelX: 8 },
  { id: 11, word: 'home', pos: 'ADV', head: 9, relation: 'advmod', x: 1090, y: 445, labelX: 15 },
  { id: 12, word: '.', pos: 'PUNCT', head: 9, relation: 'punct', x: 1140, y: 520, labelX: 10, labelY: 8 },
]

const desktopParseTokens = parseTokens.map((token) => ({ ...token, x: token.x - 45 }))

const compactParseTokens = parseTokens.map((token) => ({
  ...token,
  x: token.x * .65 + 20 + (token.id === 4 ? -30 : token.id === 11 ? 30 : 0),
  y: token.y * .65 + 280,
  labelX: (token.labelX ?? 0) * .65,
  labelY: (token.labelY ?? -4) * .65,
}))

const mobileParseTokens: ParseToken[] = [
  { id: 1, word: 'Pink', pos: 'ADJ', head: 2, relation: 'amod', x: 360, y: 504, labelX: -10 },
  { id: 2, word: 'petals', pos: 'NOUN', head: 9, relation: 'nsubj', x: 470, y: 600, labelX: -8 },
  { id: 3, word: 'drifting', pos: 'VERB', head: 2, relation: 'acl', x: 520, y: 480, labelX: 10 },
  { id: 4, word: 'through', pos: 'ADP', head: 6, relation: 'case', x: 330, y: 264, labelX: -8 },
  { id: 5, word: 'the', pos: 'DET', head: 6, relation: 'det', x: 470, y: 252, labelX: -6 },
  { id: 6, word: 'branches', pos: 'NOUN', head: 3, relation: 'obl', x: 520, y: 378, labelX: -8 },
  { id: 7, word: 'of', pos: 'ADP', head: 8, relation: 'case', x: 620, y: 240, labelX: -6 },
  { id: 8, word: 'language', pos: 'NOUN', head: 6, relation: 'nmod', x: 650, y: 336, labelX: 10 },
  { id: 9, word: 'carry', pos: 'VERB', head: 0, relation: 'root', x: 570, y: 720 },
  { id: 10, word: 'meanings', pos: 'NOUN', head: 9, relation: 'obj', x: 620, y: 588, labelX: 6 },
  { id: 11, word: 'home', pos: 'ADV', head: 9, relation: 'advmod', x: 680, y: 642, labelX: 8 },
  { id: 12, word: '.', pos: 'PUNCT', head: 9, relation: 'punct', x: 680, y: 702, labelX: -8, labelY: 5 },
]

const branches: BranchSpline[] = [
  { start: [786, 770], control1: [760, 638], control2: [790, 516], end: [842, 424], startWidth: 66, endWidth: 27, level: 0 },
  { start: [826, 474], control1: [742, 443], control2: [665, 365], end: [608, 244], startWidth: 29, endWidth: 8, level: 0 },
  { start: [809, 534], control1: [704, 514], control2: [603, 473], end: [510, 390], startWidth: 35, endWidth: 7, level: 0 },
  { start: [835, 442], control1: [896, 381], control2: [973, 316], end: [1088, 250], startWidth: 26, endWidth: 7, level: 0 },
  { start: [849, 427], control1: [876, 330], control2: [899, 232], end: [886, 128], startWidth: 25, endWidth: 6, level: 0 },
  { start: [674, 382], control1: [620, 329], control2: [578, 272], end: [557, 193], startWidth: 15, endWidth: 4, level: 0 },
  { start: [704, 405], control1: [673, 320], control2: [682, 230], end: [731, 145], startWidth: 16, endWidth: 4, level: 0 },
  { start: [604, 448], control1: [551, 425], control2: [497, 379], end: [466, 318], startWidth: 13, endWidth: 3, level: 1 },
  { start: [621, 356], control1: [570, 325], control2: [530, 294], end: [493, 246], startWidth: 10, endWidth: 3, level: 1 },
  { start: [885, 366], control1: [956, 350], control2: [1027, 300], end: [1148, 282], startWidth: 15, endWidth: 3, level: 1 },
  { start: [943, 333], control1: [1003, 280], control2: [1053, 221], end: [1092, 162], startWidth: 11, endWidth: 3, level: 1 },
  { start: [883, 287], control1: [834, 230], control2: [812, 174], end: [818, 100], startWidth: 10, endWidth: 3, level: 1 },
  { start: [876, 256], control1: [929, 206], control2: [974, 164], end: [1014, 108], startWidth: 9, endWidth: 2, level: 1 },
  { start: [548, 411], control1: [499, 414], control2: [453, 398], end: [411, 363], startWidth: 7, endWidth: 2, level: 2 },
  { start: [558, 302], control1: [520, 270], control2: [485, 218], end: [472, 167], startWidth: 6, endWidth: 2, level: 2 },
  { start: [650, 294], control1: [622, 226], control2: [624, 170], end: [649, 112], startWidth: 7, endWidth: 2, level: 2 },
  { start: [733, 247], control1: [748, 198], control2: [771, 151], end: [793, 114], startWidth: 6, endWidth: 2, level: 2 },
  { start: [970, 316], control1: [1042, 341], control2: [1109, 333], end: [1181, 308], startWidth: 7, endWidth: 2, level: 2 },
  { start: [1000, 282], control1: [1057, 250], control2: [1121, 230], end: [1190, 235], startWidth: 6, endWidth: 2, level: 2 },
  { start: [917, 214], control1: [953, 174], control2: [987, 137], end: [1040, 121], startWidth: 6, endWidth: 2, level: 2 },
]

const blooms: Bloom[] = [
  { x: 459, y: 314, scale: .72, rotation: -18, tone: 2, form: 'full', level: 0 },
  { x: 510, y: 382, scale: .6, rotation: 16, tone: 1, form: 'partial', level: 0 },
  { x: 552, y: 232, scale: .76, rotation: -8, tone: 3, form: 'full', level: 0 },
  { x: 606, y: 270, scale: .58, rotation: 21, tone: 1, form: 'partial', level: 0 },
  { x: 648, y: 126, scale: .66, rotation: -12, tone: 2, form: 'full', level: 0 },
  { x: 721, y: 157, scale: .8, rotation: 10, tone: 1, form: 'full', level: 0 },
  { x: 817, y: 105, scale: .6, rotation: -17, tone: 3, form: 'partial', level: 0 },
  { x: 889, y: 139, scale: .75, rotation: 8, tone: 2, form: 'full', level: 0 },
  { x: 1007, y: 122, scale: .7, rotation: 18, tone: 1, form: 'full', level: 0 },
  { x: 1087, y: 170, scale: .8, rotation: -4, tone: 3, form: 'full', level: 0 },
  { x: 1151, y: 250, scale: .64, rotation: 18, tone: 2, form: 'partial', level: 0 },
  { x: 1187, y: 307, scale: .74, rotation: -14, tone: 1, form: 'full', level: 0 },
  { x: 494, y: 244, scale: .5, rotation: 5, tone: 1, form: 'bud', level: 1 },
  { x: 568, y: 191, scale: .46, rotation: 23, tone: 2, form: 'partial', level: 1 },
  { x: 625, y: 337, scale: .55, rotation: -13, tone: 3, form: 'full', level: 1 },
  { x: 682, y: 223, scale: .47, rotation: 24, tone: 1, form: 'bud', level: 1 },
  { x: 760, y: 123, scale: .48, rotation: 0, tone: 2, form: 'partial', level: 1 },
  { x: 850, y: 188, scale: .56, rotation: -24, tone: 1, form: 'full', level: 1 },
  { x: 941, y: 169, scale: .46, rotation: 7, tone: 3, form: 'bud', level: 1 },
  { x: 1017, y: 239, scale: .58, rotation: -14, tone: 2, form: 'full', level: 1 },
  { x: 1096, y: 274, scale: .49, rotation: 19, tone: 1, form: 'partial', level: 1 },
  { x: 1139, y: 331, scale: .46, rotation: -8, tone: 3, form: 'bud', level: 1 },
  { x: 414, y: 360, scale: .39, rotation: 20, tone: 3, form: 'bud', level: 2 },
  { x: 476, y: 166, scale: .45, rotation: -15, tone: 1, form: 'full', level: 2 },
  { x: 531, y: 288, scale: .38, rotation: 17, tone: 2, form: 'bud', level: 2 },
  { x: 650, y: 102, scale: .42, rotation: -5, tone: 3, form: 'partial', level: 2 },
  { x: 788, y: 174, scale: .4, rotation: 20, tone: 1, form: 'full', level: 2 },
  { x: 870, y: 94, scale: .43, rotation: -18, tone: 2, form: 'bud', level: 2 },
  { x: 967, y: 109, scale: .42, rotation: 14, tone: 1, form: 'partial', level: 2 },
  { x: 1041, y: 120, scale: .38, rotation: -10, tone: 3, form: 'bud', level: 2 },
  { x: 1117, y: 216, scale: .43, rotation: 13, tone: 1, form: 'full', level: 2 },
  { x: 1202, y: 235, scale: .36, rotation: -20, tone: 2, form: 'bud', level: 2 },
]

function normal(a: Point, b: Point, width: number): Point {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const length = Math.hypot(dx, dy) || 1
  return [(-dy / length) * width, (dx / length) * width]
}

function branchPath(branch: BranchSpline) {
  const sn = normal(branch.start, branch.control1, branch.startWidth / 2)
  const en = normal(branch.control2, branch.end, branch.endWidth / 2)
  const upperStart: Point = [branch.start[0] + sn[0], branch.start[1] + sn[1]]
  const lowerStart: Point = [branch.start[0] - sn[0], branch.start[1] - sn[1]]
  const upperEnd: Point = [branch.end[0] + en[0], branch.end[1] + en[1]]
  const lowerEnd: Point = [branch.end[0] - en[0], branch.end[1] - en[1]]
  const scaleStart = branch.startWidth / Math.max(branch.startWidth, 1)
  const scaleEnd = branch.endWidth / Math.max(branch.startWidth, 1)
  const c1n = normal(branch.start, branch.control1, branch.startWidth * .42 * scaleStart)
  const c2n = normal(branch.control2, branch.end, branch.startWidth * .42 * scaleEnd)
  return `M${upperStart[0]},${upperStart[1]} C${branch.control1[0] + c1n[0]},${branch.control1[1] + c1n[1]} ${branch.control2[0] + c2n[0]},${branch.control2[1] + c2n[1]} ${upperEnd[0]},${upperEnd[1]} L${lowerEnd[0]},${lowerEnd[1]} C${branch.control2[0] - c2n[0]},${branch.control2[1] - c2n[1]} ${branch.control1[0] - c1n[0]},${branch.control1[1] - c1n[1]} ${lowerStart[0]},${lowerStart[1]} Z`
}

function Flower({ bloom }: { bloom: Bloom }) {
  const petals = bloom.form === 'full' ? 5 : bloom.form === 'partial' ? 3 : 2
  return (
    <g className={`canopy-bloom tone-${bloom.tone} level-${bloom.level}`} transform={`translate(${bloom.x} ${bloom.y}) rotate(${bloom.rotation}) scale(${bloom.scale})`} aria-hidden>
      {Array.from({ length: petals }, (_, index) => (
        <use key={index} href={`#petal-${(index + bloom.tone) % 4}`} transform={`rotate(${index * (360 / Math.max(petals, 5))}) translate(0 -5)`} />
      ))}
      {bloom.form !== 'bud' && <circle r="4.5" />}
    </g>
  )
}

function LoosePetal({ index, plane }: { index: number; plane: 'background' | 'midground' }) {
  return (
    <g className={`loose-petal petal-${plane}`} data-index={index} aria-hidden>
      <g className="petal-face"><use href={`#petal-${index % 4}`} /></g>
    </g>
  )
}

function dependencyPath(head: ParseToken, dependent: ParseToken) {
  const startY = head.y - 27
  const endY = dependent.y + 29
  const middleY = (startY + endY) / 2
  return `M${head.x},${startY} C${head.x},${middleY} ${dependent.x},${middleY} ${dependent.x},${endY}`
}

function arrowheadPath(x: number, y: number) {
  return `M${x - 4},${y + 7} L${x},${y} L${x + 4},${y + 7}`
}

function tokenDepth(token: ParseToken, tokenMap: Map<number, ParseToken>) {
  let depth = 0
  let head = token.head
  while (head !== 0 && depth < tokenMap.size) {
    depth += 1
    head = tokenMap.get(head)?.head ?? 0
  }
  return depth
}

function DependencyTree({ tokens, layout }: { tokens: ParseToken[]; layout: 'desktop' | 'tablet' | 'mobile' }) {
  const tokenMap = new Map(tokens.map((token) => [token.id, token]))
  const rootToken = tokenMap.get(9)!
  const haikuX = layout === 'desktop' ? 805 : layout === 'tablet' ? 573 : 525
  const haikuY = layout === 'desktop' ? 632 : layout === 'tablet' ? 691 : 780
  return (
    <g className={`parse-tree parse-tree-${layout}`} aria-hidden>
      <g className="parse-root-edge">
        <path className="dependency-branch" d={`M${rootToken.x} ${rootToken.y + 50} C${rootToken.x} ${rootToken.y + 38} ${rootToken.x} ${rootToken.y + 24} ${rootToken.x} ${rootToken.y + 12}`} />
        <path className="dependency-arrowhead" d={arrowheadPath(rootToken.x, rootToken.y + 12)} />
        <text x={rootToken.x + 19} y={rootToken.y + 42}>root</text>
      </g>
      <g className="dependency-edges">
        {tokens.filter((token) => token.head !== 0).map((token) => {
          const head = tokenMap.get(token.head)
          if (!head) return null
          const labelX = (head.x + token.x) / 2 + (token.labelX ?? 0)
          const labelY = (head.y + token.y) / 2 + (token.labelY ?? -4)
          return (
            <g className="dependency-edge" data-depth={tokenDepth(token, tokenMap)} key={token.id}>
              <path className="dependency-branch" d={dependencyPath(head, token)} />
              <path className="dependency-arrowhead" d={arrowheadPath(token.x, token.y + 29)} />
              <text x={labelX} y={labelY}>{token.relation}</text>
            </g>
          )
        })}
      </g>
      <g className="dependency-nodes">
        {tokens.map((token) => (
          <g className={`dependency-node token-${token.id}`} data-depth={tokenDepth(token, tokenMap)} transform={`translate(${token.x} ${token.y})`} key={token.id}>
            <text className="dependency-word">{token.word}</text>
            <text className="dependency-pos" y="19">{token.pos}</text>
          </g>
        ))}
      </g>
      <g className="parse-haiku" transform={`translate(${haikuX} ${haikuY})`}>
        <text className="parse-kicker" y="-17">HAIKU_01 · UNIVERSAL DEPENDENCIES</text>
        <text className="haiku-line" y="12">Pink petals drifting</text>
        <text className="haiku-line" y="42">through the branches of language</text>
        <text className="haiku-line" y="72">carry meanings home.</text>
      </g>
    </g>
  )
}

export function LanguageTreeScene({ mode }: { mode: SceneMode }) {
  const root = useRef<SVGSVGElement>(null)
  const previousMode = useRef<SceneMode | null>(null)

  useLayoutEffect(() => {
    if (!root.current) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const parseLayout = window.matchMedia('(max-width: 600px)').matches ? '.parse-tree-mobile' : window.matchMedia('(max-width: 900px)').matches ? '.parse-tree-tablet' : '.parse-tree-desktop'
    const priorMode = previousMode.current
    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('.bloom-scene', { opacity: mode === 'bloom' ? 1 : 0 })
        gsap.set('.parse-tree', { opacity: mode === 'parse' ? 1 : 0 })
        gsap.set('.loose-petal', { opacity: 0 })
        return
      }

      if (mode === 'parse') {
        gsap.set('.bloom-scene', { opacity: 1 })
        gsap.set('.parse-tree', { opacity: 0 })
        const growth = gsap.timeline()
          .to('.bloom-scene', { opacity: 0, duration: .8, ease: 'power1.inOut' })
          .to('.parse-tree', { opacity: 1, duration: .8, ease: 'power1.inOut' }, '<')
          .from(`${parseLayout} .parse-root-edge .dependency-branch`, { strokeDasharray: 600, strokeDashoffset: 600, duration: .42, ease: 'power1.out' }, '<+.2')
          .from(`${parseLayout} .parse-root-edge .dependency-arrowhead`, { opacity: 0, duration: .16 }, '>-0.12')
          .from(`${parseLayout} .dependency-node[data-depth="0"]`, { opacity: 0, duration: .32, ease: 'power1.out' }, '>-0.04')
          .from(`${parseLayout} .parse-root-edge text`, { opacity: 0, duration: .22 }, '<')

        for (let depth = 1; depth <= 5; depth += 1) {
          growth
            .from(`${parseLayout} .dependency-edge[data-depth="${depth}"] .dependency-branch`, { strokeDasharray: 600, strokeDashoffset: 600, duration: .58, stagger: .07, ease: 'power1.out' }, '>')
            .from(`${parseLayout} .dependency-edge[data-depth="${depth}"] .dependency-arrowhead`, { opacity: 0, duration: .18, stagger: .07 }, '>-0.14')
            .from(`${parseLayout} .dependency-node[data-depth="${depth}"]`, { opacity: 0, duration: .32, stagger: .06, ease: 'power1.out' }, '<')
            .from(`${parseLayout} .dependency-edge[data-depth="${depth}"] text`, { opacity: 0, duration: .24, stagger: .06 }, '<')
        }

        growth.from(`${parseLayout} .parse-haiku`, { opacity: 0, duration: .65, ease: 'power2.out' }, '>-0.05')
        return
      }

      if (priorMode === 'parse') {
        gsap.set('.bloom-scene', { opacity: 0 })
        gsap.set('.parse-tree', { opacity: 1 })
        gsap.timeline()
          .to('.parse-tree', { opacity: 0, duration: .8, ease: 'power1.inOut' })
          .to('.bloom-scene', { opacity: 1, duration: .8, ease: 'power1.inOut' }, '<')
      } else {
        gsap.set('.bloom-scene', { opacity: 1 })
        gsap.set('.parse-tree', { opacity: 0 })
        gsap.from('.branch-shape', { opacity: 0, scaleY: .86, transformOrigin: 'bottom center', duration: 1.35, stagger: .035, ease: 'power2.out' })
        gsap.from('.canopy-bloom', { opacity: 0, scale: .55, transformOrigin: 'center', duration: .8, stagger: .025, delay: .35, ease: 'power2.out' })
      }

      gsap.to('.canopy', { rotation: 1, transformOrigin: '790px 490px', duration: 6.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })

      gsap.utils.toArray<SVGGElement>('.loose-petal').forEach((petal, index) => {
        const isBackground = petal.classList.contains('petal-background')
        const face = petal.querySelector('.petal-face')
        const startX = 360 + ((index * 223) % 850)
        const startY = 175 + ((index * 97) % 175)
        const westwardDrift = index % 3 === 0 ? 790 : 430 + (index % 4) * 55
        const flightDuration = (isBackground ? 14 : 10.5) + index * .38
        gsap.timeline({ repeat: -1, delay: index * .7 })
          .set(petal, { opacity: 0, x: startX, y: startY, rotation: index * 29, scale: isBackground ? .48 : .72, transformOrigin: 'center' })
          .to(petal, { opacity: isBackground ? .34 : .7, duration: .45 })
          .to(petal, { x: startX - westwardDrift, y: 890, rotation: 240 + index * 77, duration: flightDuration, ease: 'none' }, '<')
          .to(petal, { opacity: 0, x: startX - westwardDrift - 55, y: 980, duration: .8, ease: 'none' })

        gsap.fromTo(face,
          { scaleX: .22, scaleY: 1.06, skewX: -10, transformOrigin: 'center' },
          { scaleX: 1, scaleY: .86, skewX: 10, duration: 1.15 + (index % 4) * .24, repeat: -1, yoyo: true, ease: 'sine.inOut' },
        )
      })
    }, root)
    previousMode.current = mode
    return () => context.revert()
  }, [mode])

  return (
    <svg ref={root} className={`language-tree-scene mode-${mode}`} viewBox="0 0 1280 780" role="img" aria-labelledby="tree-title tree-description">
      <title id="tree-title">{mode === 'bloom' ? 'A flowering language tree' : 'A dependency tree for an original haiku'}</title>
      <desc id="tree-description">{mode === 'bloom' ? 'An elegant sakura tree with text-free blossoms and windblown petals.' : 'Pink petals drifting through the branches of language carry meanings home. The words are arranged as a Universal Dependencies tree rooted at carry.'}</desc>
      <defs>
        <linearGradient id="branch-gradient" x1="0" y1="1" x2=".72" y2="0"><stop stopColor="#231823"/><stop offset=".55" stopColor="#513442"/><stop offset="1" stopColor="#80606b"/></linearGradient>
        <linearGradient id="branch-light" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#c8a4ad" stopOpacity=".34"/><stop offset="1" stopColor="#c8a4ad" stopOpacity="0"/></linearGradient>
        <radialGradient id="bloom-one"><stop stopColor="#fff7f5"/><stop offset=".48" stopColor="#f8c6d0"/><stop offset="1" stopColor="#e88ca4"/></radialGradient>
        <radialGradient id="bloom-two"><stop stopColor="#fff8f6"/><stop offset=".55" stopColor="#f4a8ba"/><stop offset="1" stopColor="#cf6986"/></radialGradient>
        <radialGradient id="bloom-three"><stop stopColor="#fcecef"/><stop offset=".56" stopColor="#e994aa"/><stop offset="1" stopColor="#b95776"/></radialGradient>
        <filter id="moon-soft"><feGaussianBlur stdDeviation="22" /></filter>
        <path id="petal-0" d="M0 1 C-10 -7 -13 -23 -7 -35 C-3 -43 0 -49 0 -55 C4 -48 9 -42 12 -34 C17 -21 12 -7 0 1Z" />
        <path id="petal-1" d="M0 1 C-13 -6 -18 -20 -13 -33 C-9 -44 -3 -48 1 -57 C5 -49 14 -42 16 -31 C19 -18 12 -6 0 1Z" />
        <path id="petal-2" d="M0 1 C-9 -5 -15 -18 -11 -31 C-8 -42 -2 -47 0 -56 L4 -47 L9 -54 C11 -42 17 -36 16 -25 C15 -13 9 -4 0 1Z" />
        <path id="petal-3" d="M0 1 C-12 -5 -17 -17 -14 -29 C-11 -40 -4 -49 2 -55 C5 -46 14 -40 17 -30 C20 -19 14 -6 0 1Z" />
      </defs>
      <circle className="moon" cx="950" cy="212" r="205" />
      <circle className="moon-glow" cx="950" cy="212" r="238" filter="url(#moon-soft)" />

      <g className="bloom-scene">
        <g className="canopy">
          <g className="branch-system">{branches.slice().reverse().map((branch, index) => <path className={`branch-shape branch-level-${branch.level}`} d={branchPath(branch)} key={index} />)}<path className="trunk-highlight" d="M777 742 C770 620 800 522 832 452" /></g>
          <g className="bloom-system">{blooms.map((bloom, index) => <Flower bloom={bloom} key={index} />)}</g>
        </g>
        <g className="background-plane">{Array.from({ length: 9 }, (_, index) => <LoosePetal index={index} plane="background" key={index} />)}</g>
        <g className="midground-plane">{Array.from({ length: 7 }, (_, index) => <LoosePetal index={index + 9} plane="midground" key={index} />)}</g>
        <g className="root-lines" fill="none"><path d="M785 753 C671 740 575 747 472 773"/><path d="M789 753 C894 734 1010 746 1130 776"/></g>
      </g>
      <DependencyTree tokens={desktopParseTokens} layout="desktop" />
      <DependencyTree tokens={compactParseTokens} layout="tablet" />
      <DependencyTree tokens={mobileParseTokens} layout="mobile" />
    </svg>
  )
}
