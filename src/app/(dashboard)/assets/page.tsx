import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

export default function AssetsPage() {
  const assets = [
    { tag: "AF-0012", name: "Dell Laptop", icon: "laptop_mac", category: "Electronics", status: "Allocated", statusColor: "info", location: "Bengaluru, BLR-01", faded: false },
    { tag: "AF-0062", name: "Projector 4K", icon: "videocam", category: "Electronics", status: "Maintenance", statusColor: "warning", location: "HQ, Floor 2", faded: false },
    { tag: "AF-0201", name: "Office Chair Ergo", icon: "chair", category: "Furniture", status: "Available", statusColor: "success", location: "Warehouse A", faded: false },
    { tag: "AF-0202", name: "Cisco Router X1", icon: "router", category: "Networking", status: "Allocated", statusColor: "info", location: "Mumbai, Server Rm 1", faded: false },
    { tag: "AF-0099", name: "LaserJet Pro M404", icon: "print", category: "Electronics", status: "Retired", statusColor: "danger", location: "Disposal Unit", faded: true },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-background">
      {/* Header */}
      <div className="px-container pt-comfortable">
        <PageHeader
          title="Asset Directory"
          subtitle="Manage and track all organizational equipment and resources."
          className="mb-comfortable"
        >
          <div className="w-full md:w-64">
            <Input icon="search" placeholder="Search tag, name..." />
          </div>
          <Button icon="add">Register Asset</Button>
        </PageHeader>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest border-y border-border-subtle px-container py-standard shrink-0 flex gap-standard overflow-x-auto items-center">
        <span className="text-label-md text-text-secondary shrink-0 uppercase tracking-widest flex items-center gap-1.5">
          <Icon name="filter_list" size={14} />
          Filters
        </span>
        <div className="h-4 w-px bg-border-subtle mx-1 shrink-0" />
        {["Category", "Status", "Department"].map((filter) => (
          <Button
            key={filter}
            variant="secondary"
            className="rounded-full px-3 py-1 bg-surface-container-lowest min-h-0 text-body-sm font-normal"
          >
            {filter}
            <Icon name="arrow_drop_down" size={16} className="text-text-secondary" />
          </Button>
        ))}
        <div className="ml-auto">
          <Button variant="ghost" className="text-text-secondary font-normal" icon="filter_list_off">
            Clear All
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 p-container overflow-hidden flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-comfortable py-standard bg-surface-container-low border-b border-border-subtle text-label-md text-text-secondary uppercase tracking-wider shrink-0 sticky top-0 z-10">
            <div className="col-span-2 flex items-center gap-1.5 cursor-pointer select-none hover:text-text-primary transition-colors">
              Tag ID
              <Icon name="arrow_downward" size={13} />
            </div>
            <div className="col-span-3">Asset Name</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Location</div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto">
            {assets.map((asset) => (
              <div
                key={asset.tag}
                className={`grid grid-cols-12 gap-4 px-comfortable py-3 border-b border-border-subtle hover:bg-surface-container-low transition-colors items-center group cursor-pointer ${
                  asset.faded ? "bg-surface-container-lowest/50" : ""
                }`}
              >
                <div className={`col-span-2 text-mono-data ${asset.faded ? "text-text-primary/70" : "text-text-primary"}`}>{asset.tag}</div>
                <div className={`col-span-3 text-body-sm font-medium flex items-center gap-2 ${asset.faded ? "text-text-primary/70" : "text-text-primary"}`}>
                  <span className={`w-7 h-7 rounded-md bg-surface-container-high flex items-center justify-center shrink-0 ${asset.faded ? "text-text-secondary/50" : "text-text-secondary"}`}>
                    <Icon name={asset.icon} size={15} />
                  </span>
                  {asset.name}
                </div>
                <div className={`col-span-2 text-body-sm ${asset.faded ? "text-text-secondary/70" : "text-text-secondary"}`}>{asset.category}</div>
                <div className="col-span-2 flex items-center">
                  <Badge variant={asset.statusColor as any}>{asset.status}</Badge>
                </div>
                <div className={`col-span-3 text-body-sm flex items-center gap-1.5 justify-between ${asset.faded ? "text-text-secondary/70" : "text-text-secondary"}`}>
                  <span>{asset.location}</span>
                  <Button variant="icon" className="opacity-0 group-hover:opacity-100 !p-1">
                    <Icon name="more_vert" size={17} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border-subtle bg-surface-container-lowest p-comfortable flex items-center justify-between shrink-0">
            <span className="text-body-sm text-text-secondary">Showing 1-5 of 248 assets</span>
            <div className="flex items-center gap-2">
              <Button variant="secondary" className="!p-1 min-h-0" disabled>
                <Icon name="chevron_left" size={18} />
              </Button>
              <span className="text-label-md text-text-primary px-2">Page 1 of 50</span>
              <Button variant="secondary" className="!p-1 min-h-0">
                <Icon name="chevron_right" size={18} />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
