import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

export default function MaintenancePage() {
  const columns = [
    {
      title: "Pending",
      color: "bg-warning",
      count: 2,
      cards: [
        { id: "AF-0062", title: "Projector bulb not turning on", priority: "High", priorityColor: "badge-danger", date: "Reported: Today" },
        { id: "AF-0112", title: "Leaking water cooler in Breakroom B", priority: "Med", priorityColor: "badge-warning", date: "Reported: Yesterday" },
      ],
    },
    {
      title: "Approved",
      color: "bg-info",
      count: 1,
      cards: [
        {
          id: "AF-003",
          title: "AC unit noisy compressor",
          priority: "Low",
          priorityColor: "badge border-border-subtle text-text-secondary bg-surface-container-highest",
          assignee: "Unassigned",
          borderLeft: true,
        },
      ],
    },
    {
      title: "In Progress",
      color: "bg-primary",
      count: 1,
      cards: [
        {
          id: "AF-0078",
          title: "Forklift engine diagnostic",
          priority: "High",
          priorityColor: "badge-danger",
          assignee: "Tech: R. Varma",
          avatar: "RV",
        },
      ],
    },
    {
      title: "Resolved",
      color: "bg-success",
      count: 2,
      faded: true,
      cards: [
        { id: "AF-897", title: "Printer Jam - parts ordered & replaced", completed: "Completed: 5 Jul" },
        { id: "AF-873", title: "Chair repair - caster replacement", completed: "Completed: 7 Jul" },
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background animate-fade-in">
      {/* Page Header */}
      <div className="px-container pt-comfortable">
        <PageHeader
          title="Maintenance Board"
          subtitle="Track and manage asset repairs and servicing"
          className="mb-comfortable"
        >
          <div className="w-64">
            <Input icon="search" placeholder="Search tasks..." />
          </div>
          <Button icon="add">New Request</Button>
        </PageHeader>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-container">
        <div className="flex gap-container h-full min-w-max">
          {columns.map((col) => (
            <div key={col.title} className={`w-80 flex flex-col bg-surface-container-low rounded-lg p-standard border border-border-subtle shrink-0 ${col.faded ? "opacity-70 hover:opacity-100 transition-opacity" : ""}`} style={{ minHeight: "calc(100vh - 200px)" }}>
              {/* Column Header */}
              <div className="flex justify-between items-center mb-standard">
                <h2 className="text-headline-sm text-text-primary flex items-center gap-2 uppercase tracking-wide">
                  <span className={`w-2 h-2 rounded-full ${col.color}`} />
                  {col.title}
                </h2>
                <span className="text-mono-data bg-surface-container-highest px-2 py-1 rounded text-text-secondary">{col.count}</span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-standard overflow-y-auto pr-1 pb-4">
                {col.cards.map((card) => {
                  if ("completed" in card) {
                    // Resolved card
                    return (
                      <Card key={card.id} className="bg-success/5 border border-success/20 p-standard cursor-pointer kanban-card transition-all flex flex-col gap-compact">
                        <div className="flex justify-between items-start">
                          <span className="text-mono-data font-bold text-text-secondary line-through">{card.id}</span>
                        </div>
                        <div className="text-label-md text-text-secondary">{card.title}</div>
                        <div className="flex items-center gap-1 text-success mt-2">
                          <Icon name="check_circle" size={13} />
                          <span className="text-[11px] font-medium">{card.completed}</span>
                        </div>
                      </Card>
                    );
                  }

                  const badgeVariant = card.priority === "High" ? "danger" : card.priority === "Med" ? "warning" : "neutral";

                  return (
                    <Card key={card.id} className={`p-standard cursor-pointer kanban-card transition-all flex flex-col gap-compact bg-surface-container-lowest ${"borderLeft" in card ? "border-l-2 border-l-info" : ""}`}>
                      <div className="flex justify-between items-start">
                        <span className="text-mono-data font-bold text-text-primary">{card.id}</span>
                        {"priority" in card && (
                          <Badge variant={badgeVariant}>{card.priority}</Badge>
                        )}
                      </div>
                      <div className="text-label-md text-text-primary line-clamp-2">{card.title}</div>
                      {"date" in card && (
                        <div className="flex items-center gap-1 text-text-secondary mt-2">
                          <Icon name="calendar_today" size={13} />
                          <span className="text-[11px]">{card.date}</span>
                        </div>
                      )}
                      {"assignee" in card && (
                        <div className="mt-2 pt-2 border-t border-border-subtle flex justify-between items-center">
                          <div className={`flex items-center gap-1 ${"avatar" in card ? "text-primary" : "text-text-secondary"}`}>
                            <Icon name="engineering" size={13} />
                            <span className="text-[11px] font-medium">{card.assignee}</span>
                          </div>
                          {"avatar" in card && (
                            <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-text-secondary">
                              {card.avatar}
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
