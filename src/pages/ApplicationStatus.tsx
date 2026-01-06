import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, XCircle, Clock, Edit, Info } from "lucide-react";

interface Application {
  id: string;
  clubName: string;
  clubImage: string;
  category: string;
  status: "pending" | "accepted" | "rejected";
  appliedDate: string;
  message: string;
}

const APPLICATIONS: Application[] = [
  {
    id: "1",
    clubName: "코딩 마스터즈",
    clubImage: "https://placehold.co/160x160/e2e8f0/1e293b?text=Coding",
    category: "IT기술",
    status: "pending",
    appliedDate: "2025.10.01",
    message: "지원서가 성공적으로 접수되었습니다. 현재 운영진이 서류를 꼼꼼히 검토하고 있습니다. 결과 발표까지 조금만 기다려주세요!",
  },
  {
    id: "2",
    clubName: "디지털 아트 크리에이터",
    clubImage: "https://placehold.co/160x160/e2e8f0/1e293b?text=Art",
    category: "문화예술",
    status: "accepted",
    appliedDate: "2025.09.28",
    message: "축하합니다! 서류 전형에 합격하셨습니다. 향후 면접 일정 및 자세한 안내 사항은 가입하신 이메일로 발송되었습니다.",
  },
  {
    id: "3",
    clubName: "경제 분석 연구회",
    clubImage: "https://placehold.co/160x160/e2e8f0/1e293b?text=Economy",
    category: "학술연구",
    status: "rejected",
    appliedDate: "2025.09.25",
    message: "지원해주셔서 감사합니다. 아쉽게도 이번 모집에서는 함께하지 못하게 되었습니다. 귀하의 앞날에 무궁한 발전이 있기를 기원합니다.",
  },
];

export function ApplicationStatus() {
  const stats = {
    total: APPLICATIONS.length,
    accepted: APPLICATIONS.filter((app) => app.status === "accepted").length,
    rejected: APPLICATIONS.filter((app) => app.status === "rejected").length,
    pending: APPLICATIONS.filter((app) => app.status === "pending").length,
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="flex flex-row items-center justify-between p-6 shadow-sm border rounded-xl bg-card">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">전체 지원</span>
            <span className="text-2xl font-bold">{stats.total}개</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-full text-primary">
            <FileText className="w-6 h-6" />
          </div>
        </Card>
        
        <Card className="flex flex-row items-center justify-between p-6 shadow-sm border rounded-xl bg-card">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">합격</span>
            <span className="text-2xl font-bold">{stats.accepted}개</span>
          </div>
          <div className="p-3 bg-green-50 rounded-full text-green-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex flex-row items-center justify-between p-6 shadow-sm border rounded-xl bg-card">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">불합격</span>
            <span className="text-2xl font-bold">{stats.rejected}개</span>
          </div>
          <div className="p-3 bg-red-50 rounded-full text-destructive">
            <XCircle className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex flex-row items-center justify-between p-6 shadow-sm border rounded-xl bg-card">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">검토중</span>
            <span className="text-2xl font-bold">{stats.pending}개</span>
          </div>
          <div className="p-3 bg-orange-50 rounded-full text-orange-500">
            <Clock className="w-6 h-6" />
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-foreground">지원 내역</h2>
        
        <div className="flex flex-col gap-4">
          {APPLICATIONS.map((app) => (
            <div key={app.id} className="flex flex-col md:flex-row gap-6 p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="shrink-0">
                <img 
                  src={app.clubImage} 
                  alt={app.clubName} 
                  className="w-full md:w-[160px] h-[160px] rounded-lg object-cover bg-muted"
                />
              </div>

              <div className="flex flex-col flex-1 gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-primary border-blue-200 hover:bg-blue-50">
                    {app.category}
                  </Badge>
                  {app.status === "pending" && (
                    <Badge className="bg-chart-3 text-white border-transparent hover:bg-chart-3/90">
                      검토중
                    </Badge>
                  )}
                  {app.status === "accepted" && (
                    <Badge className="bg-primary text-primary-foreground border-transparent hover:bg-primary/90">
                      합격
                    </Badge>
                  )}
                  {app.status === "rejected" && (
                    <Badge variant="destructive" className="border-transparent">
                      불합격
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-foreground">{app.clubName}</h3>
                  <p className="text-sm text-muted-foreground">지원일: {app.appliedDate}</p>
                </div>

                <div className="p-4 border rounded-lg bg-background/50 text-sm text-foreground">
                  {app.message}
                </div>
              </div>

              <div className="flex md:flex-col gap-2 justify-center md:justify-start md:min-w-[140px]">
                {app.status === "pending" ? (
                  <>
                    <Button variant="outline" className="w-full justify-center">
                      <Edit className="w-4 h-4 mr-2" />
                      수정하기
                    </Button>
                    <Button variant="default" className="w-full justify-center">
                      <FileText className="w-4 h-4 mr-2" />
                      지원서 보기
                    </Button>
                  </>
                ) : (
                  <Button variant="default" className="w-full justify-center mt-auto">
                    <FileText className="w-4 h-4 mr-2" />
                    지원서 보기
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <h3 className="text-xl font-medium flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" /> 도움말
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>지원서는 <strong>검토중</strong> 상태일 때만 수정이 가능합니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>문의사항은 각 동아리 페이지의 연락처를 통해 문의해주세요.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
