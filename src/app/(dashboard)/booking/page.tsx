import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Icon } from '@/components/ui/Icon';

export default function BookingPage() {
  return (
    <div className="page-root">
      {/* Page Header */}
      <PageHeader
        overline="Resource"
        title={
          <>
            Conference Room B2
            <span className="text-text-secondary text-headline-sm">– Tue, 7 Jul</span>
          </>
        }
      >
        <Button variant="secondary" icon="calendar_today">Change Date</Button>
        <Button variant="primary" icon="add">Book a slot</Button>
      </PageHeader>

      {/* Booking Calendar */}
      <Card className="relative">
        <div className="timeline-grid">
          {/* Time Column */}
          <div className="flex flex-col text-right pr-4 border-r border-border-subtle text-mono-data text-text-secondary">
            {["9:00", "10:00", "11:00", "12:00", "13:00"].map((time, i) => (
              <div key={time} className={`timeline-row flex items-start justify-end -mt-3 ${i === 4 ? "border-b-0" : ""}`}>
                <span>{time}</span>
              </div>
            ))}
          </div>

          {/* Schedule Column */}
          <div className="relative w-full pb-8">
            {/* Grid Lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`timeline-row ${i === 4 ? "border-b-0" : ""}`} />
            ))}

            {/* Booked Block (9:00 - 10:30) */}
            <div
              className="absolute top-0 left-0 right-4 bg-primary-fixed border border-primary text-on-primary-fixed rounded p-3 shadow-sm z-10"
              style={{ height: 90, marginTop: 0 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-label-md font-bold">Booked – Procurement Team</h4>
                  <p className="text-body-sm opacity-80">9:00 to 10:30</p>
                </div>
                <Icon name="groups" size={17} className="opacity-70" />
              </div>
            </div>

            {/* Conflict Request (9:30 - 10:30) */}
            <div
              className="absolute left-4 right-8 z-20"
              style={{ top: 30, height: 60 }}
            >
              <Alert variant="danger" className="h-full !p-2 border-dashed border-2 flex items-center min-h-0">
                Requested 9:30 to 10:30 – conflict – slot is unavailable
              </Alert>
            </div>

            {/* Empty Slot Hover (11:00 - 12:00) */}
            <div
              className="absolute left-0 right-4 rounded border border-transparent hover:border-primary border-dashed hover:bg-surface-container-low transition-all cursor-pointer z-0 flex items-center justify-center group"
              style={{ top: 120, height: 60 }}
            >
              <span className="opacity-0 group-hover:opacity-100 text-primary text-label-md flex items-center gap-1 transition-opacity">
                <Icon name="add_circle" size={15} />
                Click to book 11:00 – 12:00
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Resource Details Panel */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resource Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-body-sm">
              {[
                { label: "Capacity", value: "12 People" },
                { label: "Equipment", value: "Projector, Whiteboard" },
                { label: "Location", value: "Floor 2, East Wing" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between border-b border-surface-container-high pb-2 last:border-b-0 last:pb-0">
                  <dt className="text-text-secondary">{item.label}</dt>
                  <dd className="font-medium text-text-primary">{item.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
