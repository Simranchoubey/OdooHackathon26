import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

export default function ReportsPage() {
  return (
    <div className="page-root">
      {/* Header */}
      <PageHeader
        title="Reports & Analytics"
        subtitle="System-wide performance and utilization metrics."
        className="mb-comfortable"
      >
        <Button icon="download">Export Report</Button>
      </PageHeader>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-comfortable">
        {/* Utilization Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Utilization by Department</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2 px-2 pb-6 border-b border-border-subtle relative">
            {/* Y Axis */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-text-secondary text-mono-data text-[10px] w-8">
              {["100%", "75%", "50%", "25%", "0%"].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            {/* Grid Lines */}
            <div className="absolute left-10 right-0 top-0 bottom-6 border-l border-border-subtle flex flex-col justify-between pointer-events-none">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`w-full border-t border-border-subtle ${i < 5 ? "border-dashed opacity-50" : ""} h-0`} />
              ))}
            </div>
            {/* Bars */}
            {[
              { label: "ENG", height: 85, opacity: "" },
              { label: "FAC", height: 60, opacity: "opacity-80" },
              { label: "HR", height: 45, opacity: "opacity-60" },
              { label: "OPS", height: 92, opacity: "" },
              { label: "IT", height: 55, opacity: "opacity-70" },
              { label: "R&D", height: 78, opacity: "opacity-90" },
            ].map((bar) => (
              <div key={bar.label} className="flex flex-col items-center flex-1 z-10 first:ml-10 justify-end h-full">
                <div className={`w-full max-w-[40px] chart-bar rounded-t-sm ${bar.opacity}`} style={{ height: `${(bar.height / 100) * 220}px` }} />
                <span className="text-mono-data text-text-secondary mt-2 text-[10px] uppercase truncate w-full text-center">{bar.label}</span>
              </div>
            ))}
          </div>
          </CardContent>
        </Card>

        {/* Maintenance Line Graph */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Frequency</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="h-64 relative w-full">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <line stroke="#E2E8F0" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="25" y2="25" />
              <line stroke="#E2E8F0" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="50" y2="50" />
              <line stroke="#E2E8F0" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="75" y2="75" />
              <path className="chart-area" d="M0,80 L20,60 L40,70 L60,30 L80,45 L100,10 L100,100 L0,100 Z" />
              <path className="chart-line" d="M0,80 L20,60 L40,70 L60,30 L80,45 L100,10" />
              <circle cx="20" cy="60" fill="#005c55" r="2" />
              <circle cx="40" cy="70" fill="#005c55" r="2" />
              <circle cx="60" cy="30" fill="#005c55" r="2" />
              <circle cx="80" cy="45" fill="#005c55" r="2" />
              <circle cx="100" cy="10" fill="#005c55" r="2" />
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-text-secondary text-mono-data text-[10px] pt-2 border-t border-border-subtle">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
          </CardContent>
        </Card>

        {/* Most Used Assets */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Most Used Assets</CardTitle>
            <Icon name="trending_up" size={18} className="text-text-secondary" />
          </CardHeader>
          <CardContent>
          <ul className="space-y-4">
            {[
              { icon: "meeting_room", name: "Room B2", sub: "34 bookings this month" },
              { icon: "directions_car", name: "Van AF-343", sub: "21 trips this month" },
              { icon: "videocam", name: "Projector AF-335", sub: "18 uses" },
            ].map((item) => (
              <li key={item.name} className="flex items-start">
                <div className="bg-surface-container-low p-2 rounded mr-3">
                  <Icon name={item.icon} size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-body-sm font-medium text-text-primary">{item.name}</p>
                  <p className="text-mono-data text-text-secondary">{item.sub}</p>
                </div>
              </li>
            ))}
          </ul>
          </CardContent>
        </Card>

        {/* Idle Assets */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Idle Assets</CardTitle>
            <Icon name="warning" size={18} className="text-warning" />
          </CardHeader>
          <CardContent>
          <ul className="space-y-4">
            {[
              { icon: "photo_camera", name: "Camera AF-0301", sub: "Unused 60+ days" },
              { icon: "chair", name: "Chair AF-0410", sub: "Unused 45 days" },
              { icon: "print", name: "Printer AF-0992", sub: "Unused 30 days" },
            ].map((item) => (
              <li key={item.name} className="flex items-start">
                <div className="bg-surface-container-low p-2 rounded mr-3">
                  <Icon name={item.icon} size={18} className="text-text-secondary" />
                </div>
                <div>
                  <p className="text-body-sm font-medium text-text-primary">{item.name}</p>
                  <p className="text-mono-data text-text-secondary">{item.sub}</p>
                </div>
              </li>
            ))}
          </ul>
          </CardContent>
        </Card>

        {/* Maintenance / Retirement Action */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Maintenance / Retirement Action Required</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-5">
            {[
              { name: "Forklift AF-0087", alert: "Due in 5 days", alertColor: "text-danger", barColor: "bg-danger", width: "90%", sub: "Service required" },
              { name: "Laptop AF-0020", alert: "4 years old", alertColor: "text-warning", barColor: "bg-warning", width: "75%", sub: "Nearing retirement cycle" },
              { name: "HVAC Unit B-East", alert: "Hours limit", alertColor: "text-warning", barColor: "bg-warning", width: "82%", sub: "Routine inspection" },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-body-sm font-medium">{item.name}</span>
                  <span className={`text-mono-data ${item.alertColor}`}>{item.alert}</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-1.5">
                  <div className={`${item.barColor} h-1.5 rounded-full`} style={{ width: item.width }} />
                </div>
                <p className="text-mono-data text-[10px] text-text-secondary mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
