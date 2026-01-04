/**
 * 동아리 데이터 타입 정의
 * - 백엔드 API 응답을 시뮬레이션하기 위한 공유 타입
 */
export interface ClubData {
    title: string;
    category: string;
    tags: string[];
    description: string;
    longDescription: string;
    activities: { id: number; title: string; image: string }[];
    recruitment: {
        status: string;
        period: string;
        target: string;
        process: string;
    };
}

/**
 * 동아리 지원 페이지에서 사용하는 축소된 타입
 * - ClubData에서 title, category, description만 추출
 */
export type ClubApplicationData = Pick<ClubData, "title" | "category" | "description">;

/**
 * 동아리 목업 데이터 상수
 * - 성능 최적화를 위해 컴포넌트 외부에 정의
 * - ID를 키로 사용하여 O(1) 조회가 가능하도록 구성
 * - 백엔드 API 응답을 시뮬레이션
 */
export const MOCK_CLUB_DATA: Record<string, ClubData> = {
    "6": {
        title: "CPR (CJU Public Relation)",
        category: "학술분과",
        tags: ["#코딩", "#취준", "#대학원", "#인공지능"],
        description:
            "프로그래밍과 AI에 대한 열정을 실현하며 미래를 준비하는 동아리 입니다.",
        longDescription: `
      우리 동아리는 학생들이 자신의 꿈과 목표를 찾고, 그것을 실현하기 위한 실질적인 지식과 경험을 쌓을 수 있는 동아리 활동을 제공하는 것이 CPR의 목표입니다!

우리는 취업과 진학이라는 두 가지 주요 진로 방향에 맞춰 체계적인 지원 시스템을 구축하여, 부원들이 각자의 길을 찾고 성장할 수 있도록 서포트하는 동아리입니다.
    `,
        activities: [
            {
                id: 1,
                title: "코딩테스트 스터디",
                image: "/images/coding_test_study.jpg",
            },
            {
                id: 2,
                title: "AI 논문 리뷰",
                image: "/images/paper_review.png",
            },
            {
                id: 3,
                title: "미래 준비에 대한 교수님 초청 강연",
                image: "/images/lecture.png",
            },
        ],
        recruitment: {
            status: "모집예정",
            period: "2026.03.01 ~ 2026.03.14",
            target: "코딩과 인공지능에 열정 있는 모든 재학생 (전공 무관)",
            process: "서류 심사 > 면접 > 최종 합격",
        },
    },
};

/**
 * 동아리 지원 페이지용 데이터 가져오기 함수
 * - API에서 전체 데이터를 받아온 후 필요한 필드만 추출하는 시나리오 시뮬레이션
 * @param id 동아리 ID
 * @returns title, category, description만 포함된 데이터 또는 null
 */
export function getClubApplicationData(id: string): ClubApplicationData | null {
    const fullData = MOCK_CLUB_DATA[id];
    if (!fullData) return null;

    // 필요한 필드만 추출하여 반환
    return {
        title: fullData.title,
        category: fullData.category,
        description: fullData.description,
    };
}
