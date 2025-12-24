import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Calendar, Users, Loader } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ProjectFormValues, projectSchema } from "@/types/projects";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CreateProjectDialog } from "@/components/modals/CreateProjectModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectDetailDialog } from "@/components/modals/ProjectDetailDialog";

const statusColors = {
  "In Progress": "bg-primary/10 text-primary border-primary/20",
  Planning: "bg-accent/10 text-accent border-accent/20",
  Review: "bg-green-100 text-green-700 border-green-200",
};

export const priorityColors = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Low: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function Projects() {
  const queryClient = useQueryClient();

  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | number | null
  >(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      priority: "",
      status: "In-Progress",
      team: "",
      tasks: {
        completed: "",
        total: "",
      },
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (newProject: ProjectFormValues) => {
      const response = await fetch("http://localhost:3001/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      return response.json();
    },
    onSuccess: async () => {
      toast.success("Project Created successfully");
      form.reset({
        name: "",
        description: "",
        priority: "",
        status: "In-Progress",
        team: "",
        tasks: {
          completed: "",
          total: "",
        },
      });
      setIsProjectOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    },
  });

  const onSubmit = (values: ProjectFormValues) => {
    createProjectMutation.mutate(values);
  };

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string | number) => {
      const response = await fetch(
        `http://localhost:3001/api/projects/${projectId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      return response.json();
    },
    onSuccess: async () => {
      toast.success("Project deleted");
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    },
  });

  const fetchProjects = async () => {
    const response = await fetch("http://localhost:3001/api/projects");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const fetchProjectById = async (id: string | number) => {
    const response = await fetch(`http://localhost:3001/api/projects/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const {
    data: projectDetail,
    isLoading: isDetailLoading,
    error: detailError,
  } = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: () => fetchProjectById(selectedProjectId as string | number),
    enabled: !!selectedProjectId && isDetailOpen,
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
          Error loading projects:{error.message}
        </span>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all your team projects
          </p>
        </div>
        <CreateProjectDialog
          isOpen={isProjectOpen}
          onOpenChange={setIsProjectOpen}
          form={form}
          onSubmit={onSubmit}
          isSubmitting={createProjectMutation.isPending}
          onCancel={() => {
            form.reset({
              name: "",
              description: "",
              priority: "",
              status: "In-Progress",
              team: "",
              tasks: {
                completed: "",
                total: "",
              },
              deadline: "",
            });
            setIsProjectOpen(false);
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <Card
            key={project.id}
            className="shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => {
              setSelectedProjectId(project.id);
              setIsDetailOpen(true);
            }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={deleteProjectMutation.isPending}
                      onClick={(e) => e.stopPropagation()}
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
                          `Remove ${project.name} from the project?`
                        );
                        if (!confirmed) return;
                        deleteProjectMutation.mutate(project.id);
                      }}
                    >
                      Delete Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {project.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    priorityColors[
                      project.priority as keyof typeof priorityColors
                    ]
                  }
                >
                  {project.priority}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">
                    {project.tasks.completed}/{project.tasks.total}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        (project.tasks.completed / project.tasks.total) * 100
                      }%`,
                    }}
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
            </CardContent>
          </Card>
        ))}
      </div>

      <ProjectDetailDialog
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open);
          if (!open) {
            setSelectedProjectId(null);
          }
        }}
        project={projectDetail ?? null}
        isLoading={isDetailLoading}
        hasError={!!detailError}
        statusColors={statusColors}
        priorityColors={priorityColors}
      />
    </div>
  );
}
