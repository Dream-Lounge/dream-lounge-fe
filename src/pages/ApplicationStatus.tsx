import { type ReactNode, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, XCircle, Clock, Edit, Info } from "lucide-react";
import { type Application } from "@/data/applications";
import { api, type ApplicationListResponseItem } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const STATUS_BADGE_CONFIG: Record<
  Application["status"],
  { children: string; className: string; variant?: "destructive" }
> = {
  pending: {
    children: "검토중",
    className: "bg-chart-3 text-white border-transparent hover:bg-chart-3/90",
  },
  accepted: {
    children: "합격",
    className: "bg-primary text-primary-foreground border-transparent hover:bg-primary/90",
  },
  rejected: {
    children: "불합격",
    variant: "destructive",
    className: "border-transparent",
  },
};

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  iconBgClass: string;
  iconColorClass: string;
}

function StatCard({ title, value, icon, iconBgClass, iconColorClass }: StatCardProps) {
  return (
    <Card className="flex flex-row items-center justify-between p-6 shadow-sm border rounded-xl bg-card">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span className="text-2xl font-bold">{value}개</span>
      </div>
      <div className={`p-3 rounded-full ${iconBgClass} ${iconColorClass}`}>
        {icon}
      </div>
    </Card>
  );
}

interface ApplicationItemProps {
  application: Application;
}

function ApplicationItem({ application }: ApplicationItemProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="shrink-0">
        <img 
          src={application.clubImage} 
          alt={application.clubName} 
          className="w-full md:w-[160px] h-[160px] rounded-lg object-cover bg-muted"
        />
      </div>

      <div className="flex flex-col flex-1 gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-primary border-blue-200 hover:bg-blue-50">
            {application.category}
          </Badge>
          <Badge {...STATUS_BADGE_CONFIG[application.status]} />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-foreground">{application.clubName}</h3>
          <p className="text-sm text-muted-foreground">지원일: {application.appliedDate}</p>
        </div>

        <div className="p-4 border rounded-lg bg-background/50 text-sm text-foreground">
          {application.message}
        </div>
      </div>

      <div className="flex md:flex-col gap-2 justify-center md:justify-start md:min-w-[140px]">
        {application.status === "pending" ? (
          <>
            <Button 
              variant="outline" 
              className="w-full justify-center"
              onClick={() => navigate(`/applications/${application.id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              수정하기
            </Button>
            <Button 
              variant="default" 
              className="w-full justify-center"
              onClick={() => navigate(`/applications/${application.id}/view`)}
            >
              <FileText className="w-4 h-4 mr-2" />
              지원서 보기
            </Button>
          </>
        ) : (
          <Button 
            variant="default" 
            className="w-full justify-center mt-auto"
            onClick={() => navigate(`/applications/${application.id}/view`)}
          >
            <FileText className="w-4 h-4 mr-2" />
            지원서 보기
          </Button>
        )}
      </div>
    </div>
  );
}

function getStatusMessage(status: ApplicationListResponseItem["status"]) {
  switch (status) {
    case "합격":
      return "축하합니다! 서류 전형에 합격하셨습니다. 향후 면접 일정 및 자세한 안내 사항은 가입하신 이메일로 발송되었습니다.";
    case "불합격":
      return "지원해주셔서 감사합니다. 아쉽게도 이번 모집에서는 함께하지 못하게 되었습니다. 귀하의 앞날에 무궁한 발전이 있기를 기원합니다.";
    case "제출됨":
    default:
      return "지원서가 성공적으로 접수되었습니다. 현재 운영진이 서류를 꼼꼼히 검토하고 있습니다. 결과 발표까지 조금만 기다려주세요!";
  }
}

export function ApplicationStatus() {
  const { studentId } = useParams<{ studentId: string }>();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user) {
      if (studentId && String(user.studentId) !== studentId) {
        navigate(`/users/${user.studentId}/applications`, { replace: true });
      }
    }
  }, [studentId, user, isAuthenticated, isAuthLoading, navigate]);

  useEffect(() => {
    if (isAuthLoading || !user || (studentId && String(user.studentId) !== studentId)) {
      return;
    }

    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const data = await api.getMyApplications();


        
        const mappedData: Application[] = data.map((item: ApplicationListResponseItem) => {
            let status: Application["status"] = "pending";
            if (item.status === "합격") status = "accepted";
            else if (item.status === "불합격") status = "rejected";
            
            const date = new Date(item.submitted_time);
            const appliedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
            
            return {
                id: String(item.id),
                studentId: user!.studentId,
                clubId: String(item.club_id),
                clubName: item.club_name,
                clubImage: item.club_image || "https://placehold.co/160x160/e2e8f0/1e293b?text=Club",
                category: item.category || "기타",
                status: status,
                rawStatus: item.status,
                appliedDate: appliedDate,
                message: getStatusMessage(item.status),
            };
        });
        
        setApplications(mappedData);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [studentId, user, isAuthLoading]);

  const stats = applications.reduce(
    (acc, app) => {
      acc.total++;
      if (app.status === "accepted") acc.accepted++;
      else if (app.status === "rejected") acc.rejected++;
      else if (app.status === "pending") acc.pending++;
      return acc;
    },
    { total: 0, accepted: 0, rejected: 0, pending: 0 }
  );

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="전체 지원"
          value={stats.total}
          icon={<FileText className="w-6 h-6" />}
          iconBgClass="bg-blue-50"
          iconColorClass="text-primary"
        />
        <StatCard
          title="합격"
          value={stats.accepted}
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconBgClass="bg-green-50"
          iconColorClass="text-green-600"
        />
        <StatCard
          title="불합격"
          value={stats.rejected}
          icon={<XCircle className="w-6 h-6" />}
          iconBgClass="bg-red-50"
          iconColorClass="text-destructive"
        />
        <StatCard
          title="검토중"
          value={stats.pending}
          icon={<Clock className="w-6 h-6" />}
          iconBgClass="bg-orange-50"
          iconColorClass="text-orange-500"
        />
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-foreground">지원 내역</h2>
        
        {applications.length > 0 ? (
          <div className="flex flex-col gap-4">
            {applications.map((app) => (
              <ApplicationItem key={app.id} application={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground border rounded-xl bg-muted/20">
            지원 내역이 없습니다.
          </div>
        )}
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
