/**
 * /examples/assets 의 next/image 최적화 검증용 래스터 이미지를 만듭니다.
 *
 * public/ 에는 create-next-app이 넣어 준 SVG만 있고, SVG는 Next의 이미지 최적화
 * 파이프라인을 우회해 원본 그대로 서빙됩니다. 그래서 srcset·AVIF 변환·blur 플레이스홀더가
 * 전혀 생기지 않아 최적화 동작을 검증할 수 없습니다. 래스터 한 장이 필요합니다.
 *
 * 실행: npm run gen:sample-image
 * sharp는 Next.js의 의존성으로 이미 설치되어 있어 추가 설치가 필요하지 않습니다.
 */
import { mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import sharp from "sharp"

const WIDTH = 1600
const HEIGHT = 900
const OUTPUT = resolve(import.meta.dirname, "..", "public", "examples", "sample.jpg")

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f172a" />
      <stop offset="0.55" stop-color="#475569" />
      <stop offset="1" stop-color="#cbd5e1" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <g fill="none" stroke="#ffffff" stroke-opacity="0.16" stroke-width="2">
    ${Array.from({ length: 16 }, (_, i) => `<circle cx="${140 + i * 96}" cy="${HEIGHT / 2}" r="${40 + i * 26}" />`).join("\n    ")}
  </g>
  <text x="96" y="${HEIGHT - 160}" font-family="sans-serif" font-size="104" font-weight="700" fill="#ffffff">
    sample ${WIDTH}x${HEIGHT}
  </text>
  <text x="96" y="${HEIGHT - 84}" font-family="monospace" font-size="44" fill="#ffffff" fill-opacity="0.75">
    next/image optimization test asset
  </text>
</svg>`

await mkdir(dirname(OUTPUT), { recursive: true })

const info = await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(OUTPUT)

console.log(`생성 완료: ${OUTPUT}`)
console.log(`  ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB`)
