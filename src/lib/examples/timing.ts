/** 인위적인 지연. 스트리밍과 pending 상태를 눈으로 확인하기 위한 용도입니다. */
export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/**
 * 로케일과 타임존을 고정해 포맷합니다.
 * 고정하지 않으면 서버(UTC)와 브라우저(로컬)의 출력이 달라 하이드레이션 불일치가 발생합니다.
 */
export function formatServerTime(date: Date = new Date()) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date)
}

/**
 * ms만큼 기다린 뒤 실제로 걸린 시간을 돌려줍니다.
 *
 * Date.now()를 컴포넌트 본문에서 직접 부르면 react-hooks/purity 규칙에 걸립니다.
 * 렌더가 멱등해야 한다는 규칙이라, 시간 측정 같은 불순한 호출은 이렇게 밖으로 빼냅니다.
 */
export async function measuredSleep(ms: number) {
  const startedAt = Date.now()
  await sleep(ms)
  return Date.now() - startedAt
}
