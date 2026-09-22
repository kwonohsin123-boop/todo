import { Skeleton } from "@/components/ui/skeleton"

/**
 * 세그먼트 로딩 UI입니다. Next가 page.tsx와 그 하위를 <Suspense>로 자동 감쌉니다.
 * 같은 세그먼트의 layout.tsx · template.tsx · error.tsx는 감싸지 않습니다.
 * props를 받지 않습니다.
 */
export default function StreamingLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-14">
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
