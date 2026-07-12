import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Icon } from '@/components/ui/Icon';

const kpis = [
  { label: "Available", value: "128", icon: "check_circle", tone: "text-success bg-success/10", trend: "+4 today" },
  { label: "Allocated", value: "76", icon: "swap_horiz", tone: "text-primary bg-primary/10", trend: "+2 today" },
  { label: "Active Bookings", value: "9", icon: "event_seat", tone: "text-info bg-info/10", trend: "3 rooms" },
  { label: "Pending Transfers", value: "3", icon: "arrow_downward", tone: "text-warning bg-warning/10", trend: "Needs review" },
];

const activity = [
  {
    icon: "computer",
    iconBg: "bg-secondary-container text-primary",
    title: "Laptop AF-0114",
    desc: "Allocated to Priya Shah – IT Dept",
    time: "10:42 AM",
  },
  {
    icon: "meeting_room",
    iconBg: "bg-tertiary-container/20 text-tertiary",
    title: "Room B2",
    desc: "Booking confirmed – 2:00 to 3:00 PM",
    time: "09:15 AM",
  },
  {
    icon: "check_circle",
    iconBg: "bg-success/10 text-success",
    title: "Projector AF-0062",
    desc: "Maintenance resolved – ready for allocation",
    time: "Yesterday",
  },
  {
    icon: "chair",
    iconBg: "bg-secondary-container text-primary",
    title: "Office Chair AF-0201",
    desc: "Returned by Field Ops (East)",
    time: "Yesterday",
  },
];

export default function DashboardPage() {
  return (
    <div className="page-root pb-24">
      {/* Page Header */}
      <PageHeader
        title="Today's Overview"
        subtitle="Real-time status of your enterprise assets."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {kpis.map((card) => (
          <Card
            key={card.label}
            className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <CardContent noPadding className="p-standard flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <span className="text-label-md text-text-secondary uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${card.tone}`}>
                  <Icon name={card.icon} size={16} strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <span className="text-headline-lg text-text-primary font-bold block">
                  {card.value}
                </span>
                <span className="text-body-sm text-text-secondary">{card.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert Banner */}
      <Alert variant="danger" className="mb-8">
        3 assets overdue for return – flagged for follow-up
      </Alert>

      {/* Primary Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button icon="add">Register Asset</Button>
        <Button variant="secondary" icon="event">Book Resource</Button>
        <Button variant="secondary" icon="support_agent">Raise Requests</Button>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader className="bg-surface-bright flex flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" className="!px-2 !py-1 text-body-sm">View all</Button>
        </CardHeader>
        <div className="divide-y divide-border-subtle">
          {activity.map((item, i) => (
            <div
              key={i}
              className="px-comfortable py-standard flex items-start gap-4 hover:bg-surface-container transition-colors group"
            >
              <div
                className={`w-9 h-9 rounded-full ${item.iconBg} flex items-center justify-center shrink-0`}
              >
                <Icon name={item.icon} size={16} strokeWidth={2.25} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-3 mb-0.5">
                  <span className="text-label-md text-text-primary font-bold">
                    {item.title}
                  </span>
                  <span className="text-mono-data text-text-secondary shrink-0">{item.time}</span>
                </div>
                <p className="text-body-sm text-text-secondary">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
