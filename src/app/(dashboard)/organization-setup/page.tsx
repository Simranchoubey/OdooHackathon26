import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

export default function OrganizationSetupPage() {
  const departments = [
    { name: "Engineering", head: "Aditi Rao", parent: "--", status: "Active", isChild: false },
    { name: "Facilities", head: "Rohan Mehta", parent: "--", status: "Active", isChild: false },
    { name: "Field Ops (East)", head: "Sana Iqbal", parent: "Field Ops", status: "Inactive", isChild: true },
    { name: "Field Ops (West)", head: "Marcus Johnson", parent: "Field Ops", status: "Active", isChild: true },
    { name: "Human Resources", head: "Elena Rodriguez", parent: "--", status: "Active", isChild: false },
  ];

  return (
    <div className="page-root">
      {/* Page Header */}
      <div className="mb-container">
        <PageHeader
          title="Organization Setup"
          subtitle="Manage structural hierarchies and foundational data."
          className="mb-comfortable"
        >
          <Button variant="secondary" icon="download">Export</Button>
          <Button icon="add">Add Department</Button>
        </PageHeader>

        {/* Tabs */}
        <div className="border-b border-border-subtle flex gap-comfortable overflow-x-auto">
          {["Departments", "Categories", "Employees", "Locations"].map((tab, i) => (
            <button
              key={tab}
              className={`pb-2 border-b-2 text-label-md px-2 whitespace-nowrap transition-colors ${
                i === 0
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-subtle"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <Card>
        {/* Toolbar */}
        <div className="p-standard border-b border-border-subtle flex flex-col sm:flex-row gap-standard justify-between items-center bg-surface-bright">
          <div className="w-full sm:w-72">
            <Input
              icon="search"
              placeholder="Search departments..."
            />
          </div>
          <div className="flex items-center gap-compact w-full sm:w-auto">
            <Button variant="secondary" className="!p-2 min-h-0">
              <Icon name="filter_list" size={16} />
            </Button>
            <Button variant="secondary" className="!p-2 min-h-0">
              <Icon name="view_column" size={16} />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-container-low sticky top-0 z-10">
                <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">Department</th>
                <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">Head</th>
                <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">Parent Dept</th>
                <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">Status</th>
                <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-body-sm text-text-primary bg-surface-container-lowest">
              {departments.map((dept, i) => (
                <tr key={i} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <td className={`py-3 px-standard font-medium ${dept.isChild ? "pl-comfortable flex items-center gap-2" : ""}`}>
                    {dept.isChild && <span className="w-4 h-px bg-border-subtle inline-block" />}
                    {dept.name}
                  </td>
                  <td className="py-3 px-standard text-text-secondary">{dept.head}</td>
                  <td className={`py-3 px-standard text-text-secondary ${dept.parent === "--" ? "italic" : ""}`}>{dept.parent}</td>
                  <td className="py-3 px-standard">
                    <Badge variant={dept.status === "Active" ? "success" : "neutral"}>
                      {dept.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-standard text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" className="!p-1.5 min-h-0">
                      <Icon name="edit" size={15} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-standard border-t border-border-subtle flex items-center justify-between bg-surface-container-lowest text-text-secondary text-label-md">
          <div>Showing 1 to 5 of 12 departments</div>
          <div className="flex items-center gap-compact">
            <Button variant="secondary" className="!p-1 min-h-0" disabled>
              <Icon name="chevron_left" size={17} />
            </Button>
            <span className="px-2">Page 1 of 3</span>
            <Button variant="secondary" className="!p-1 min-h-0">
              <Icon name="chevron_right" size={17} />
            </Button>
          </div>
        </div>
      </Card>

      <p className="mt-comfortable text-text-secondary text-body-sm italic text-center">
        Editing a department here also drives the picklist in Asset Registrations.
      </p>
    </div>
  );
}
