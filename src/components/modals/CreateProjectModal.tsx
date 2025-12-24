import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormSelectField, FormTextField } from "@/components/forms/InputFields";
import { Loader, Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "@/types/projects";

type CreateProjectDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
};

const statusOptions = [
  { label: "In-Progress", value: "In-Progress" },
  { label: "Completed", value: "Completed" },
  { label: "Pending", value: "Pending" },
];

const priorityOptions = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "Low" },
];

export function CreateProjectDialog({
  isOpen,
  onOpenChange,
  form,
  onSubmit,
  isSubmitting,
  onCancel,
}: CreateProjectDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Button
        className="gap-2"
        onClick={() => onOpenChange(true)}
        disabled={isSubmitting}
      >
        <Plus className="h-4 w-4" />
        New Project
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Project</DialogTitle>
          <DialogDescription>Add a new project to your team</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormTextField
              form={form}
              name="name"
              label="Project Name"
              placeholder="TODO List App"
            />

            <FormTextField
              form={form}
              name="description"
              label="Description"
              type="text"
              placeholder="Describe about the project"
            />

            <FormSelectField
              form={form}
              name="priority"
              label="Priority"
              placeholder="High | Medium | Low"
              options={priorityOptions}
            />

            <FormSelectField
              form={form}
              name="status"
              label="Status"
              placeholder="Select a status"
              options={statusOptions}
            />

            <FormTextField
              form={form}
              name="team"
              label="Team No"
              type="string"
              placeholder="Add No of Team Member"
            />

            <FormTextField
              form={form}
              name="tasks.completed"
              label="Tasks Completed"
              type="number"
              placeholder="e.g., 5"
            />

            <FormTextField
              form={form}
              name="tasks.total"
              label="Tasks Total"
              type="number"
              placeholder="e.g., 12"
            />

            <FormTextField
              form={form}
              name="deadline"
              label="Deadline"
              type="date"
              placeholder=""
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Project
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
