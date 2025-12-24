import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader, Mail, MoreVertical } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { InviteMemberDialog } from "@/components/modals/CreateTeamMemberModal";
import { MemberFormValues, memberSchema } from "@/types/team";

export default function Team() {
  const queryClient = useQueryClient();

  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      status: "Active",
      avatarColor: "",
    },
  });

  const createMemberMutation = useMutation({
    mutationFn: async (newMember: MemberFormValues) => {
      const response = await fetch("http://localhost:3001/api/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
      });

      if (!response.ok) {
        throw new Error("Failed to create team member");
      }

      return response.json();
    },
    onSuccess: async () => {
      toast.success("Team member invited successfully");
      form.reset({
        name: "",
        email: "",
        role: "",
        status: "Active",
        avatarColor: "",
      });
      setIsInviteOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    },
  });

  const onSubmit = (values: MemberFormValues) => {
    createMemberMutation.mutate(values);
  };

  const deleteMemberMutation = useMutation({
    mutationFn: async (memberId: string | number) => {
      const response = await fetch(
        `http://localhost:3001/api/team/${memberId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete team member");
      }

      return response.json();
    },
    onSuccess: async () => {
      toast.success("Team member deleted");
      await queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    },
  });

  const fetchTeamMembers = async () => {
    const response = await fetch("http://localhost:3001/api/team");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const {
    data: teamMembers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: fetchTeamMembers,
  });

  if (isLoading)
    return (
      <div className="flex justify-center w-full items-center h-full animate-spin">
        <Loader />
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-full text-4xl flex-col gap-3">
        <span>❌❌❌</span>
        <span className="font-semibold text-red-600">
          {" "}
          Error loading team members:{error.message}
        </span>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team</h1>
          <p className="text-muted-foreground mt-2">
            {teamMembers.length} members in your team
          </p>
        </div>
        <InviteMemberDialog
          isOpen={isInviteOpen}
          onOpenChange={setIsInviteOpen}
          form={form}
          onSubmit={onSubmit}
          isSubmitting={createMemberMutation.isPending}
          onCancel={() => {
            form.reset({
              name: "",
              email: "",
              role: "",
              status: "Active",
              avatarColor: "",
            });
            setIsInviteOpen(false);
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card
            key={member.id}
            className="shadow-sm hover:shadow-md transition-all"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <Avatar className={`h-14 w-14 ${member.avatar}`}>
                  <AvatarFallback className="text-white text-lg font-semibold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={deleteMemberMutation.isPending}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="text-red-600 focus:bg-red-50 cursor-pointer"
                      onClick={() => {
                        const confirmed = window.confirm(
                          `Remove ${member.name} from the team?`
                        );
                        if (!confirmed) return;
                        deleteMemberMutation.mutate(member.id);
                      }}
                    >
                      Delete member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Projects: </span>
                    <span className="font-semibold text-foreground">
                      {member.projects}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 border-green-200"
                  >
                    {member.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
