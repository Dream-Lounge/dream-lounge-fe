import { type ReactNode, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, XCircle, Clock, PauseCircle } from "lucide-react";
import { MOCK_APPLICATIONS, type Application } from "@/data/applications";
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
  held: {
    children: "보류",
    className: "bg-amber-500 text-white border-transparent hover:bg-amber-500/90",
  },
};

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  iconWrapClass: string;
  valueClass?: string;
}

function StatCard({ title, value, icon, iconWrapClass, valueClass }: StatCardProps) {
  return (
    <Card className="group flex flex-row items-center gap-2.5 p-3.5 shadow-sm border rounded-2xl bg-card transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className={`shrink-0 flex items-center justify-center size-9 rounded-xl transition-transform group-hover:scale-105 ${iconWrapClass}`}>
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs font-medium text-muted-foreground truncate">{title}</span>
        <span className="flex items-baseline gap-0.5">
          <span className={`text-xl font-extrabold leading-none ${valueClass ?? "text-foreground"}`}>
            {value}
          </span>
          <span className="text-xs font-semibold text-muted-foreground">개</span>
        </span>
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
    <div className="flex flex-col md:flex-row gap-4 sm:gap-5 p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="shrink-0 md:self-stretch">
        <img
          src={application.clubImage}
          alt={application.clubName}
          className="w-full md:w-[130px] h-[160px] sm:h-[160px] md:h-full rounded-lg object-cover bg-muted"
        />
      </div>

      <div className="flex flex-col flex-1 gap-3 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-blue-50 text-primary border-blue-200 hover:bg-blue-50">
              {application.category}
            </Badge>
            <Badge {...STATUS_BADGE_CONFIG[application.status]} />
          </div>

          <div className="flex flex-row gap-2 items-center shrink-0">
            <Button
              variant="default"
              className="justify-center"
              onClick={() => navigate(`/applications/${application.id}/view`)}
            >
              <FileText className="w-4 h-4 mr-2" />
              지원서 보기
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <h3 className="text-xl font-bold text-foreground">{application.clubName}</h3>
          <p className="text-sm text-muted-foreground">지원일: {application.appliedDate}</p>
        </div>

        <div className="p-3 border rounded-lg bg-background/50 text-sm text-foreground">
          {application.message}
        </div>
      </div>
    </div>
  );
}

function getStatusMessage(status: ApplicationListResponseItem["status"]) {
  switch (status) {
    case "합격":
      return "축하합니다! 합격하셨습니다. OT 일정을 확인해주세요.";
    case "불합격":
      return "아쉽지만 이번 모집에서는 선발되지 못했습니다. 다음 기회에 다시 도전해주세요.";
    case "보류":
      return "지원서를 검토한 결과 추가 확인이 필요하여 보류 처리되었습니다. 결과가 확정되면 별도로 안내드리겠습니다.";
    case "제출됨":
    default:
      return "지원서를 검토중입니다. 곧 연락드리겠습니다.";
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
    if (!isAuthLoading && !user) {
      setApplications(MOCK_APPLICATIONS);
      setIsLoading(false);
      return;
    }

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
            else if (item.status === "보류") status = "held";
            
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
      else if (app.status === "held") acc.held++;
      else if (app.status === "pending") acc.pending++;
      return acc;
    },
    { total: 0, accepted: 0, rejected: 0, held: 0, pending: 0 }
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
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">지원 내역</h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-3">
        <StatCard
          title="전체 지원"
          value={stats.total}
          icon={<FileText className="w-4 h-4" strokeWidth={2} />}
          iconWrapClass="bg-slate-100 text-slate-500"
        />
        <StatCard
          title="합격"
          value={stats.accepted}
          icon={<CheckCircle2 className="w-4 h-4" strokeWidth={2} />}
          iconWrapClass="bg-primary/10 text-primary"
          valueClass="text-primary"
        />
        <StatCard
          title="불합격"
          value={stats.rejected}
          icon={<XCircle className="w-4 h-4" strokeWidth={2} />}
          iconWrapClass="bg-destructive/10 text-destructive"
          valueClass="text-destructive"
        />
        <StatCard
          title="보류"
          value={stats.held}
          icon={<PauseCircle className="w-4 h-4" strokeWidth={2} />}
          iconWrapClass="bg-amber-100 text-amber-600"
          valueClass="text-amber-600"
        />
        <StatCard
          title="검토중"
          value={stats.pending}
          icon={<Clock className="w-4 h-4" strokeWidth={2} />}
          iconWrapClass="bg-sky-100 text-sky-600"
          valueClass="text-sky-600"
        />
      </div>

      <div className="flex flex-col gap-6">
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

    </div>
  );
}
