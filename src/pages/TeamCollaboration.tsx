
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Check, Copy, Mail, Plus, Settings, Trash2, UserPlus, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const workspaceFormSchema = z.object({
  name: z.string().min(3, { message: "Workspace name must be at least 3 characters" }),
});

const inviteFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.enum(["viewer", "editor", "admin"]),
});

type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>;
type InviteFormValues = z.infer<typeof inviteFormSchema>;

const TeamCollaboration = () => {
  const { user } = useAuth();
  const { toast: uiToast } = useToast();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingWorkspaces, setFetchingWorkspaces] = useState(true);
  const [workspaceDialogOpen, setWorkspaceDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const workspaceForm = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: {
      name: "",
    },
  });
  
  const inviteForm = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      role: "viewer",
    },
  });
  
  // Fetch workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!user?.id) return;
      
      setFetchingWorkspaces(true);
      try {
        const { data, error } = await supabase
          .from("workspaces")
          .select("*")
          .eq("owner_id", user.id);
          
        if (error) {
          console.error("Error fetching workspaces:", error);
          return;
        }
        
        setWorkspaces(data || []);
        
        // Select the first workspace by default
        if (data && data.length > 0 && !selectedWorkspace) {
          setSelectedWorkspace(data[0]);
        }
      } catch (err) {
        console.error("Error fetching workspaces:", err);
      } finally {
        setFetchingWorkspaces(false);
      }
    };
    
    fetchWorkspaces();
  }, [user]);
  
  // Fetch collaborators when a workspace is selected
  useEffect(() => {
    const fetchCollaborators = async () => {
      if (!selectedWorkspace) return;
      
      try {
        const { data, error } = await supabase
          .from("workspace_collaborators")
          .select("*")
          .eq("workspace_id", selectedWorkspace.id);
          
        if (error) {
          console.error("Error fetching collaborators:", error);
          return;
        }
        
        setCollaborators(data || []);
      } catch (err) {
        console.error("Error fetching collaborators:", err);
      }
    };
    
    fetchCollaborators();
  }, [selectedWorkspace]);
  
  // Handle workspace form submission
  const onWorkspaceSubmit = async (values: WorkspaceFormValues) => {
    if (!user?.id) {
      toast.error("You must be logged in to create a workspace");
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("workspaces")
        .insert({
          name: values.name,
          owner_id: user.id,
        })
        .select();
        
      if (error) {
        console.error("Error creating workspace:", error);
        toast.error("Failed to create workspace", {
          description: error.message
        });
        return;
      }
      
      toast.success("Workspace created successfully");
      
      // Add to workspaces list
      if (data && data[0]) {
        setWorkspaces([...workspaces, data[0]]);
        setSelectedWorkspace(data[0]);
      }
      
      setWorkspaceDialogOpen(false);
      workspaceForm.reset();
    } catch (err) {
      console.error("Error creating workspace:", err);
      toast.error("Failed to create workspace", {
        description: "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle invite form submission
  const onInviteSubmit = async (values: InviteFormValues) => {
    if (!user?.id || !selectedWorkspace) {
      toast.error("You must be logged in and have a selected workspace to invite collaborators");
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("workspace_collaborators")
        .insert({
          workspace_id: selectedWorkspace.id,
          user_id: user.id, // This will be replaced when they accept the invitation
          invited_email: values.email,
          role: values.role,
          invitation_status: "pending",
        })
        .select();
        
      if (error) {
        console.error("Error inviting collaborator:", error);
        toast.error("Failed to invite collaborator", {
          description: error.message
        });
        return;
      }
      
      toast.success("Invitation sent successfully", {
        description: `An invitation has been sent to ${values.email}`
      });
      
      // Add to collaborators list
      if (data && data[0]) {
        setCollaborators([...collaborators, data[0]]);
      }
      
      setInviteDialogOpen(false);
      inviteForm.reset();
    } catch (err) {
      console.error("Error inviting collaborator:", err);
      toast.error("Failed to invite collaborator", {
        description: "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Delete workspace
  const deleteWorkspace = async (id: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from("workspaces")
        .delete()
        .eq("id", id)
        .eq("owner_id", user.id);
        
      if (error) {
        console.error("Error deleting workspace:", error);
        toast.error("Failed to delete workspace", {
          description: error.message
        });
        return;
      }
      
      toast.success("Workspace deleted");
      
      // Remove from workspaces list
      setWorkspaces(workspaces.filter(workspace => workspace.id !== id));
      
      // Clear selected workspace if it was deleted
      if (selectedWorkspace && selectedWorkspace.id === id) {
        setSelectedWorkspace(null);
      }
    } catch (err) {
      console.error("Error deleting workspace:", err);
      toast.error("Failed to delete workspace", {
        description: "An unexpected error occurred"
      });
    }
  };
  
  // Remove collaborator
  const removeCollaborator = async (id: string) => {
    if (!user?.id || !selectedWorkspace) return;
    
    try {
      const { error } = await supabase
        .from("workspace_collaborators")
        .delete()
        .eq("id", id)
        .eq("workspace_id", selectedWorkspace.id);
        
      if (error) {
        console.error("Error removing collaborator:", error);
        toast.error("Failed to remove collaborator", {
          description: error.message
        });
        return;
      }
      
      toast.success("Collaborator removed");
      
      // Remove from collaborators list
      setCollaborators(collaborators.filter(collaborator => collaborator.id !== id));
    } catch (err) {
      console.error("Error removing collaborator:", err);
      toast.error("Failed to remove collaborator", {
        description: "An unexpected error occurred"
      });
    }
  };
  
  // Copy invite link
  const copyInviteLink = () => {
    if (!selectedWorkspace) return;
    
    const inviteLink = `${window.location.origin}/invite/${selectedWorkspace.id}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    
    toast.success("Invite link copied to clipboard");
  };
  
  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-500 hover:bg-red-500/30";
      case "editor":
        return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30";
    }
  };
  
  // Get invitation status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30";
      case "declined":
        return "bg-red-500/20 text-red-500 hover:bg-red-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30";
    }
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Team Collaboration</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Collaborate with team members on your Pinterest marketing strategy
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-black border-gray-800">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Workspaces</CardTitle>
                <Dialog open={workspaceDialogOpen} onOpenChange={setWorkspaceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      New
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Workspace</DialogTitle>
                      <DialogDescription>
                        Create a new workspace to collaborate with your team
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...workspaceForm}>
                      <form onSubmit={workspaceForm.handleSubmit(onWorkspaceSubmit)} className="space-y-4">
                        <FormField
                          control={workspaceForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Workspace Name</FormLabel>
                              <FormControl>
                                <Input placeholder="My Team" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Workspace"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                Select a workspace to manage your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fetchingWorkspaces ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-gray-800 rounded w-full"></div>
                  <div className="h-10 bg-gray-800 rounded w-full"></div>
                </div>
              ) : workspaces.length > 0 ? (
                <div className="space-y-2">
                  {workspaces.map(workspace => (
                    <div
                      key={workspace.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                        selectedWorkspace?.id === workspace.id
                          ? "bg-gray-800 border-l-4 border-pinterest-red"
                          : "hover:bg-gray-900"
                      }`}
                      onClick={() => setSelectedWorkspace(workspace)}
                    >
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-3 text-gray-400" />
                        <div>
                          <h3 className="font-medium">{workspace.name}</h3>
                          <p className="text-xs text-gray-400">Owner</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteWorkspace(workspace.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Workspaces</h3>
                  <p className="text-gray-400 mb-4">
                    Create a workspace to start collaborating with your team
                  </p>
                  <Button onClick={() => setWorkspaceDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Workspace
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {selectedWorkspace && (
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle>Invite Link</CardTitle>
                <CardDescription>
                  Share this link to invite people to your workspace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input 
                    readOnly 
                    value={`${window.location.origin}/invite/${selectedWorkspace.id}`} 
                    className="text-sm"
                  />
                  <Button size="icon" variant="outline" onClick={copyInviteLink}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-2">
          {selectedWorkspace ? (
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedWorkspace.name}</CardTitle>
                    <CardDescription>
                      Manage your team and collaborators
                    </CardDescription>
                  </div>
                  <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite Team Member</DialogTitle>
                        <DialogDescription>
                          Invite a collaborator to your {selectedWorkspace.name} workspace
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...inviteForm}>
                        <form onSubmit={inviteForm.handleSubmit(onInviteSubmit)} className="space-y-4">
                          <FormField
                            control={inviteForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="colleague@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={inviteForm.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="viewer">Viewer (can only view)</SelectItem>
                                    <SelectItem value="editor">Editor (can edit content)</SelectItem>
                                    <SelectItem value="admin">Admin (full access)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button type="submit" disabled={loading}>
                              {loading ? "Sending..." : "Send Invitation"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="members">
                  <TabsList className="mb-4">
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="members">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-900 rounded-md">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                            <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user?.email}</div>
                            <div className="text-xs text-gray-400">You (Owner)</div>
                          </div>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-500">
                          Owner
                        </Badge>
                      </div>
                      
                      {collaborators.length > 0 ? (
                        collaborators.map(collaborator => (
                          <div key={collaborator.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-md">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarFallback>{collaborator.invited_email?.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{collaborator.invited_email}</div>
                                <div className="flex items-center text-xs text-gray-400">
                                  <Badge className={getStatusBadgeColor(collaborator.invitation_status)} variant="outline">
                                    {collaborator.invitation_status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getRoleBadgeColor(collaborator.role)}>
                                {collaborator.role}
                              </Badge>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeCollaborator(collaborator.id)}
                              >
                                <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-xl font-medium mb-2">No Team Members</h3>
                          <p className="text-gray-400 mb-4">
                            Invite team members to collaborate on your workspace
                          </p>
                          <Button onClick={() => setInviteDialogOpen(true)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite Members
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="activity">
                    <div className="text-center py-6">
                      <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-xl font-medium mb-2">Activity Log</h3>
                      <p className="text-gray-400">
                        Track your team's activity in the workspace
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings">
                    <Card className="bg-gray-900 border-gray-700">
                      <CardHeader>
                        <CardTitle>Workspace Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Workspace Name</label>
                          <div className="flex items-center space-x-2">
                            <Input defaultValue={selectedWorkspace.name} />
                            <Button variant="outline">Save</Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">Workspace Visibility</label>
                          <Select defaultValue="private">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="private">Private (Invite Only)</SelectItem>
                              <SelectItem value="public">Public (Anyone with Link)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-700">
                          <Button variant="destructive" className="w-full" onClick={() => deleteWorkspace(selectedWorkspace.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Workspace
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-black border-gray-800 h-full flex items-center justify-center">
              <CardContent className="p-6 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No Workspace Selected</h3>
                <p className="text-gray-400 mb-4">
                  Select a workspace from the list or create a new one to get started
                </p>
                <Button onClick={() => setWorkspaceDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Workspace
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeamCollaboration;
