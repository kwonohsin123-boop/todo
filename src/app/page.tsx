/**
 * 홈 — 빈 앱 셸입니다. 도메인 로직은 아직 없습니다.
 *
 * 이 파일은 Server Component로 유지합니다 (PRD §7.2).
 * 인터랙션이 필요한 조각(진행률 갱신, DnD, 완료 체크)은 각각 "use client" 파일로
 * 분리한 뒤 여기서 조립하세요.
 *
 * 시각 규칙 (PRD §9.6): MIT 강조는 색이 아니라 배치·굵기·섹션 서피스(bg-muted)로 냅니다.
 * 앱 화면에서는 shadow-*를 쓰지 않습니다 (PRD §9.4).
 */
export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="flex flex-col gap-2">
        {/*
          TODO(nextjs-app-router): PRD §9.3의 페이지 타이틀은 32px/700입니다.
          Tailwind 기본 스텝에 32px가 없어 text-3xl(30px)로 두었습니다.
          text-[2rem] 또는 @theme의 --text-title 추가 중 하나로 확정하세요.
        */}
        <h1 className="text-3xl font-bold tracking-tight">오늘의 MIT</h1>
        {/* TODO(nextjs-app-router): todayKey()로 오늘 날짜를 ko-KR/Asia/Seoul 포맷으로 표시.
            todayKey()는 인자 없이 부르면 내부에서 new Date()를 호출하므로
            컴포넌트 본문이 아니라 서버 경계(page의 async 본문 밖 또는 Server Action)에서 호출하세요. */}
        <p className="text-muted-foreground">
          하루에 세 가지만. 가장 중요한 일부터 끝냅니다.
        </p>
      </header>

      {/* 진행률 바 자리 — Must-have */}
      <section aria-labelledby="progress-heading" className="mt-8">
        <h2 id="progress-heading" className="sr-only">
          오늘의 진행률
        </h2>
        {/* TODO(nextjs-app-router): 완료/전체 비율 바. 채움색은 --primary(검정), 트랙은 --muted. */}
        <div className="h-2 w-full rounded-full bg-muted" aria-hidden />
      </section>

      {/* MIT 3개 — 상단 고정, 큰 글자, 굵은 weight, 페일그레이 서피스 */}
      <section aria-labelledby="mit-heading" className="mt-8 rounded-lg bg-muted p-6">
        <h2 id="mit-heading" className="text-2xl font-bold tracking-tight">
          오늘의 핵심 업무 3가지
        </h2>
        {/* TODO(nextjs-app-router): MIT_SLOTS(0·1·2)를 순회해 슬롯 카드를 렌더.
            비어 있는 슬롯은 '지정하기' 입력으로, 채워진 슬롯은 완료 체크 + 제목으로.
            순서 재배치는 @dnd-kit/sortable — 클라이언트 조각으로 분리해야 합니다. */}
        <ol className="mt-4 space-y-3">
          {[0, 1, 2].map((slot) => (
            <li
              key={slot}
              className="flex min-h-14 items-center gap-3 rounded-md border border-border bg-background px-4 text-muted-foreground"
            >
              <span className="text-sm font-semibold tabular-nums">{slot + 1}</span>
              <span className="text-sm">아직 지정되지 않았습니다</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* 타임라인 — 타임블록 배치 대상 */}
        <section aria-labelledby="timeline-heading">
          <h2 id="timeline-heading" className="text-2xl font-bold tracking-tight">
            타임라인
          </h2>
          {/* TODO(nextjs-app-router): 자정 기준 분(start_min)을 격자에 매핑.
              드롭 영역은 @dnd-kit/core의 useDroppable, 격자 스냅은 @dnd-kit/modifiers.
              클라이언트 전용이므로 이 섹션 본문만 "use client" 파일로 분리하세요. */}
          <div className="mt-4 rounded-lg border border-border p-6 text-sm text-muted-foreground">
            타임블록 격자가 들어갈 자리입니다.
          </div>
        </section>

        {/* 할 일 목록 — MIT로 승격되기 전의 대기열 */}
        <section aria-labelledby="backlog-heading">
          <h2 id="backlog-heading" className="text-2xl font-bold tracking-tight">
            할 일
          </h2>
          {/* TODO(nextjs-app-router): 빠른 등록 폼(useActionState) + 목록.
              등록/수정은 src/app/actions.ts의 Server Action, 조회는
              listTasksByDate()를 이 서버 컴포넌트에서 직접 호출합니다 (PRD §8.4). */}
          <div className="mt-4 rounded-lg border border-border p-6 text-sm text-muted-foreground">
            빠른 등록 폼과 할 일 목록이 들어갈 자리입니다.
          </div>
        </section>
      </div>
    </div>
  )
}
