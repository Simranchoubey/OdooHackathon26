import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Icon } from '@/components/ui/Icon';

export default function AuditPage() {
  const auditItems = [
    { id: "AF-003", name: "Dell laptop", location: "Desk E12", status: "Verified", statusIcon: "check_circle", statusColor: "badge-success", rowBg: "" },
    { id: "AF-9921", name: "Office chair", location: "Desk E14", status: "Missing", statusIcon: "error", statusColor: "badge-danger", rowBg: "bg-error/5" },
    { id: "AF-9838", name: "Monitor", location: "Desk E15", status: "Damaged", statusIcon: "warning", statusColor: "badge-warning", rowBg: "bg-warning/5" },
    { id: "AF-004", name: "MacBook Pro", location: "Desk E16", status: "Verified", statusIcon: "check_circle", statusColor: "badge-success", rowBg: "" },
  ];

  return (
    <div className="page-root">
      {/* Header */}
      <PageHeader
        title="Q3 Audit: Engineering Dept – 1-15 Jul"
        subtitle="Auditors: A. Rao, S. Iqbal"
        className="mb-comfortable"
      >
        <Button variant="secondary" icon="download">Export</Button>
      </PageHeader>

      {/* Audit Table */}
      <Card className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-label-md text-text-secondary uppercase tracking-wider border-b border-border-subtle sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-medium">Asset</th>
                <th className="px-6 py-4 font-medium">Expected Location</th>
                <th className="px-6 py-4 font-medium">Verification</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-body-md divide-y divide-border-subtle">
              {auditItems.map((item) => (
                <tr key={item.id} className={`hover:bg-surface-container transition-colors ${item.rowBg}`}>
                  <td className="px-6 py-3 text-mono-data text-text-primary">
                    <div className="font-medium">{item.id}</div>
                    <div className="text-text-secondary">{item.name}</div>
                  </td>
                  <td className="px-6 py-3 text-text-secondary">{item.location}</td>
                  <td className="px-6 py-3">
                    <Badge variant={item.status === "Verified" ? "success" : item.status === "Missing" ? "danger" : "warning" as any} icon={item.statusIcon}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-3">
                    <Button variant="icon">
                      <Icon name="more_vert" size={19} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary & Actions */}
      <div className="flex flex-col gap-4">
        <Alert variant="warning" title="2 assets flagged">
          Discrepancy report generated automatically. Review required before closing cycle.
        </Alert>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="secondary">Save Progress</Button>
          <Button>Close Audit Cycle</Button>
        </div>
      </div>
    </div>
  );
}
