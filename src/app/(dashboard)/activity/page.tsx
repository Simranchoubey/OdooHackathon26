import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

export default function ActivityPage() {
  const logs = [
    {
      icon: "swap_horiz",
      iconBg: "bg-secondary-container",
      iconColor: "text-info",
      title: <><span className="font-medium">Laptop AF-0114</span> assigned to <span className="font-medium">Priya Shah</span></>,
      sub: "Asset Allocation",
      time: "2m ago",
      bg: "",
    },
    {
      icon: "check_circle",
      iconBg: "bg-tertiary-container/20",
      iconColor: "text-success",
      title: <>Maintenance request <span className="font-medium text-info">AF-0055</span> approved</>,
      sub: "Approval Flow",
      time: "18m ago",
      bg: "",
    },
    {
      icon: "event_seat",
      iconBg: "bg-surface-container-high",
      iconColor: "text-text-secondary",
      title: "Booking confirmed : Room B2 : 2:00 to 3:00 PM",
      sub: "Resource Booking",
      time: "1h ago",
      bg: "",
    },
    {
      icon: "check_circle",
      iconBg: "bg-tertiary-container/20",
      iconColor: "text-success",
      title: "Transfer approved : AF-0033 to facilities dept",
      sub: "Approval Flow",
      time: "3h ago",
      bg: "",
    },
    {
      icon: "warning",
      iconBg: "bg-error/10",
      iconColor: "text-error",
      title: <span className="font-medium">Overdue return : AF-0021 was due 3 days ago</span>,
      sub: "System Alert",
      subColor: "text-error",
      time: "1d ago",
      timeColor: "text-error font-medium",
      bg: "bg-error-container/20",
    },
    {
      icon: "assignment_late",
      iconBg: "bg-warning/20",
      iconColor: "text-warning",
      title: <>Audit discrepancy flagged : <span className="font-medium">AF-0088</span> damaged</>,
      sub: "Audit Report",
      subColor: "text-warning",
      time: "2d ago",
      bg: "bg-warning/10",
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-background">
      {/* Desktop Header */}
      <div className="px-container pt-comfortable">
        <PageHeader
          title="Activity Logs & Notifications"
          subtitle="Chronological audit trail of system events."
          className="mb-comfortable"
        >
          <div className="w-64">
            <Input icon="search" placeholder="Search logs..." />
          </div>
          <Button variant="secondary" icon="filter_list">Filter</Button>
        </PageHeader>
      </div>

      <div className="flex-1 overflow-y-auto p-container max-w-5xl mx-auto w-full">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-comfortable overflow-x-auto pb-2">
          {["All", "Alerts", "Approvals", "Bookings"].map((filter, i) => (
            <Button
              key={filter}
              variant={i === 0 ? "primary" : "secondary"}
              className="rounded-full px-4 py-1 min-h-0 text-label-md"
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Activity Feed */}
        <Card>
          {logs.map((log, i) => (
            <div
              key={i}
              className={`flex gap-4 p-4 border-b border-border-subtle last:border-b-0 hover:bg-surface-container-low transition-colors group ${log.bg}`}
            >
              <div className={`w-10 h-10 rounded-full ${log.iconBg} flex items-center justify-center shrink-0`}>
                <Icon name={log.icon} size={18} className={log.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-md text-text-primary truncate">{log.title}</p>
                <p className={`text-body-sm mt-0.5 ${"subColor" in log ? log.subColor : "text-text-secondary"}`}>{log.sub}</p>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-mono-data ${"timeColor" in log ? log.timeColor : "text-text-secondary"}`}>{log.time}</span>
              </div>
            </div>
          ))}
        </Card>

        <div className="mt-4 text-center">
          <Button variant="ghost">Load More Activity</Button>
        </div>
      </div>
    </div>
  );
}
