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
import { Loader, Mail } from "lucide-react";
import { MemberFormValues } from "@/types/team";
import { UseFormReturn } from "react-hook-form";

type InviteMemberDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<MemberFormValues>;
  onSubmit: (values: MemberFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
};

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Away", value: "Away" },
  { label: "Busy", value: "Busy" },
  { label: "Offline", value: "Offline" },
];

const avatarOptions = [
  { label: "Blue", value: "bg-blue-500" },
  { label: "Green", value: "bg-green-500" },
  { label: "Purple", value: "bg-purple-500" },
  { label: "Orange", value: "bg-orange-500" },
  { label: "Red", value: "bg-red-500" },
];

export function InviteMemberDialog({
  isOpen,
  onOpenChange,
  form,
  onSubmit,
  isSubmitting,
  onCancel,
}: InviteMemberDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Button
        className="gap-2"
        onClick={() => onOpenChange(true)}
        disabled={isSubmitting}
      >
        <Mail className="h-4 w-4" />
        Invite Member
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Add a new member to your team. An invite will be sent to their email
            address.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormTextField
              form={form}
              name="name"
              label="Name"
              placeholder="Jane Doe"
            />

            <FormTextField
              form={form}
              name="email"
              label="Email"
              type="email"
              placeholder="jane.doe@example.com"
            />

            <FormTextField
              form={form}
              name="role"
              label="Role"
              placeholder="Product Manager"
            />

            <FormSelectField
              form={form}
              name="status"
              label="Status"
              placeholder="Select a status"
              options={statusOptions}
            />

            <FormSelectField
              form={form}
              name="avatarColor"
              label="Avatar color (optional)"
              placeholder="Choose a color"
              options={avatarOptions}
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
                Send Invite
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
