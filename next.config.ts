import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Next.js 16부터 quality는 allowlist 방식입니다. 기본값이 [75]라서 설정하지 않으면
     * <Image quality={20} />처럼 목록에 없는 값은 그냥 75로 처리됩니다.
     * (dev에서는 콘솔 경고가 나고, 프로덕션 빌드에서는 경고 없이 무시됩니다.)
     *
     * /examples/assets의 quality 비교 데모가 실제로 동작해야 하므로 여기에 등록해 둡니다.
     * 목록을 늘릴수록 생성되는 변환 조합이 늘어나니 필요한 값만 남기세요.
     */
    qualities: [20, 50, 75, 90],
  },
};

export default nextConfig;
