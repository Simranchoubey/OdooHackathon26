import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Icon } from '@/components/ui/Icon';

export default function AllocationPage() {
  return (
    <div className="page-root p-0">
      <div className="max-w-6xl mx-auto p-container space-y-comfortable">
        {/* Page Header */}
        <PageHeader
          title="Allocation & Transfer"
          subtitle="Manage asset assignments and process transfer requests."
          className="border-b border-border-subtle pb-4 mb-comfortable"
        />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-container">
          {/* Transfer Request Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Transfer Request</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <form className="space-y-5">
                {/* Asset Input */}
                <div className="space-y-1.5">
                  <label className="text-label-md text-text-primary block" htmlFor="asset-input">Asset</label>
                  <Input icon="laptop_mac" id="asset-input" readOnly defaultValue="AF-0114 - Dell Laptop" />
                </div>

                {/* Error Banner */}
                <Alert variant="danger" title="Already Allocated to Priya Shah (Engineering)">
                  Direct re-allocation is blocked – submit a transfer request below.
                </Alert>

                {/* From / To Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-label-md text-text-primary block" htmlFor="from-user">From</label>
                    <Input disabled id="from-user" defaultValue="Priya Shah" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-label-md text-text-primary block" htmlFor="to-user">To</label>
                    <div className="relative">
                      <select className="w-full px-3 py-2 pr-9 bg-surface-container-lowest border border-border-subtle rounded-md text-body-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer" id="to-user" defaultValue="">
                        <option disabled value="">Select Employee...</option>
                        <option value="emp1">Rahul Desai</option>
                        <option value="emp2">Anita Sharma</option>
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"><Icon name="expand_more" size={18} /></span>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-1.5">
                  <label className="text-label-md text-text-primary block" htmlFor="reason-text">Reason</label>
                  <textarea className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-md text-body-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-text-secondary/60 resize-none" id="reason-text" placeholder="Provide justification for this transfer..." rows={3} />
                </div>

                {/* Submit */}
                <div className="pt-4 flex justify-end">
                  <Button icon="send" type="button">
                    Submit Request
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Contextual Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-container">
            {/* Asset Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-label-md uppercase tracking-wider text-text-secondary">Asset Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-primary">
                    <Icon name="laptop_mac" size={22} />
                  </div>
                  <div>
                    <p className="text-headline-sm text-text-primary">AF-0114</p>
                    <p className="text-body-sm text-text-secondary">Dell Latitude 7420</p>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  {[
                    { label: "Category:", value: "Electronics" },
                    { label: "Status:", value: "Allocated", badge: true },
                    { label: "Location:", value: "HQ Floor 3" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-body-sm">
                      <span className="text-text-secondary">{item.label}</span>
                      {item.badge ? (
                        <Badge variant="danger">{item.value}</Badge>
                      ) : (
                        <span className="text-text-primary font-medium">{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Allocation History Timeline */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-label-md uppercase tracking-wider text-text-secondary">Allocation History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative border-l border-border-subtle ml-3 space-y-6">
                  {[
                    { date: "Mar 12, 2023", desc: <>Allocated to <strong>Priya Shah</strong></>, sub: "Dept: Engineering", active: true },
                    { date: "Jan 04, 2023", desc: <>Returned by <strong>Arjun Nair</strong></>, sub: "Condition reported: Good", active: false },
                    { date: "Nov 15, 2022", desc: "Asset Registered", sub: "Procurement Batch #8892", active: false },
                  ].map((item, i) => (
                    <div key={i} className="relative pl-6">
                      <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${item.active ? "bg-primary ring-4 ring-surface-container-lowest" : "bg-border-subtle"}`} />
                      <p className="text-mono-data text-text-secondary mb-1">{item.date}</p>
                      <p className="text-body-sm text-text-primary">{item.desc}</p>
                      <p className="text-body-sm text-text-secondary text-xs mt-0.5">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
