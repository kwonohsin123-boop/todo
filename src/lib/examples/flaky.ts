/**
 * 첫 호출은 실패하고 두 번째 호출은 성공합니다.
 * error.tsx의 retry()가 실제로 복구에 성공하는 모습을 보여주기 위한 장치입니다.
 * 모듈 스코프 상태이므로 서버 재시작과 HMR에 초기화됩니다.
 */
const armed = new Set<string>()

export function failOnce(key: string) {
  if (armed.has(key)) {
    armed.delete(key)
    return
  }
  armed.add(key)
  throw new Error(`일시적 오류(${key}). 다시 시도하면 성공합니다.`)
}
