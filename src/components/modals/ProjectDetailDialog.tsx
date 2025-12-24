import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Loader, Users } from "lucide-react";
import { ProjectFormValues } from "@/types/projects";

type ProjectDetailType = ProjectFormValues & {
  id?: string | number;
  deadline?: string;
  team?: string;
};

type ProjectDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: ProjectDetailType | null;
  isLoading: boolean;
  hasError: boolean;
  statusColors: Record<string, string>;
  priorityColors: Record<string, string>;
};

export function ProjectDetailDialog({
  open,
  onOpenChange,
  project,
  isLoading,
  hasError,
  statusColors,
  priorityColors,
}: ProjectDetailDialogProps) {
  const completed = Number(project?.tasks?.completed ?? 0);
  const total = Number(project?.tasks?.total ?? 0);
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? project.name : "Project Details"}</DialogTitle>
          <DialogDescription>
            View detailed information about this project.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader className="h-5 w-5 animate-spin" />
          </div>
        )}

        {hasError && !isLoading && (
          <p className="text-sm text-red-600">Failed to load project details.</p>
        )}

        {project && !isLoading && !hasError && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{project.description}</p>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={
                  statusColors[project.status as keyof typeof statusColors]
                }
              >
                {project.status}
              </Badge>
              <Badge
                variant="outline"
                className={
                  priorityColors[project.priority as keyof typeof priorityColors]
                }
              >
                {project.priority}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">
                  {completed}/{total}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{project.deadline}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{project.team}</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


