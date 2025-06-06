"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Check, Flag, MessageSquare, Shield, ThumbsDown, ThumbsUp, AlertCircle, UserX } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConflictItem {
  id: string
  type: "comment" | "version" | "access"
  status: "open" | "resolved" | "escalated"
  title: string
  description: string
  createdAt: string
  project: {
    id: string
    name: string
  }
  participants: {
    id: string
    name: string
    avatar?: string
  }[]
  priority: "low" | "medium" | "high"
  reports: number
}

// Sample data
const sampleConflicts: ConflictItem[] = [
  {
    id: "conflict-1",
    type: "comment",
    status: "open",
    title: "Disagreement over drum pattern in chorus",
    description: "Multiple disagreements about the drum pattern in the chorus section have led to heated discussions in the comments.",
    createdAt: "2 hours ago",
    project: {
      id: "project-1",
      name: "Summer Vibes EP"
    },
    participants: [
      { id: "user-1", name: "Alex Johnson", avatar: "/placeholder-user.jpg" },
      { id: "user-2", name: "Maria Rodriguez", avatar: "/placeholder-user.jpg" },
      { id: "user-3", name: "David Kim", avatar: "/placeholder-user.jpg" }
    ],
    priority: "medium",
    reports: 3
  },
  {
    id: "conflict-2",
    type: "version",
    status: "escalated",
    title: "Unauthorized version changes to vocal track",
    description: "Version 2.3 of the vocal track was modified without approval from the vocalist, changing key effects and processing.",
    createdAt: "1 day ago",
    project: {
      id: "project-2",
      name: "Midnight Blue"
    },
    participants: [
      { id: "user-4", name: "Sarah Miller", avatar: "/placeholder-user.jpg" },
      { id: "user-5", name: "James Wilson", avatar: "/placeholder-user.jpg" }
    ],
    priority: "high",
    reports: 2
  },
  {
    id: "conflict-3",
    type: "access",
    status: "resolved",
    title: "Dispute over edit permissions",
    description: "Disagreement about who should have edit permissions for the bass tracks in the project.",
    createdAt: "3 days ago",
    project: {
      id: "project-3",
      name: "Urban Echoes"
    },
    participants: [
      { id: "user-6", name: "Emma Davis", avatar: "/placeholder-user.jpg" },
      { id: "user-7", name: "Michael Johnson", avatar: "/placeholder-user.jpg" }
    ],
    priority: "low",
    reports: 1
  },
  {
    id: "conflict-4",
    type: "comment",
    status: "open",
    title: "Emotional feedback dispute",
    description: "Conflicting emotional feedback on the bridge section is causing tension between team members.",
    createdAt: "4 hours ago",
    project: {
      id: "project-1",
      name: "Summer Vibes EP"
    },
    participants: [
      { id: "user-2", name: "Maria Rodriguez", avatar: "/placeholder-user.jpg" },
      { id: "user-8", name: "Jessica Brown", avatar: "/placeholder-user.jpg" }
    ],
    priority: "medium",
    reports: 4
  }
]

export default function ConflictModeration() {
  const [conflicts, setConflicts] = useState<ConflictItem[]>(sampleConflicts)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [selectedConflict, setSelectedConflict] = useState<ConflictItem | null>(null)
  const [showResolutionDialog, setShowResolutionDialog] = useState(false)

  const filteredConflicts = conflicts.filter(conflict => {
    if (activeTab === "all") return true
    if (activeTab === "open") return conflict.status === "open"
    if (activeTab === "escalated") return conflict.status === "escalated"
    if (activeTab === "resolved") return conflict.status === "resolved"
    return true
  })

  const handleResolveConflict = (id: string) => {
    setConflicts(
      conflicts.map(conflict => 
        conflict.id === id 
          ? { ...conflict, status: "resolved" } 
          : conflict
      )
    )
    setShowResolutionDialog(false)
  }

  const handleEscalateConflict = (id: string) => {
    setConflicts(
      conflicts.map(conflict => 
        conflict.id === id 
          ? { ...conflict, status: "escalated", priority: "high" } 
          : conflict
      )
    )
  }

  const getConflictIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="h-5 w-5" />
      case "version":
        return <AlertTriangle className="h-5 w-5" />
      case "access":
        return <Shield className="h-5 w-5" />
      default:
        return <Flag className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-orange-500 text-white uppercase text-xs tracking-wide">Open</Badge>
      case "escalated":
        return <Badge className="bg-red-500 text-white uppercase text-xs tracking-wide">Escalated</Badge>
      case "resolved":
        return <Badge className="bg-green-500 text-white uppercase text-xs tracking-wide">Resolved</Badge>
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 uppercase text-xs tracking-wide">High Priority</Badge>
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800 uppercase text-xs tracking-wide">Medium Priority</Badge>
      case "low":
        return <Badge className="bg-blue-100 text-blue-800 uppercase text-xs tracking-wide">Low Priority</Badge>
      default:
        return null
    }
  }

  return (
    <div className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Conflict Moderation</h1>
            <p className="text-muted-foreground uppercase text-xs tracking-wide">
              Manage and resolve conflicts in your collaboration projects
            </p>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 border-2 border-black p-0 h-auto">
            <TabsTrigger
              value="all"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              All Conflicts
            </TabsTrigger>
            <TabsTrigger
              value="open"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Open
            </TabsTrigger>
            <TabsTrigger
              value="escalated"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Escalated
            </TabsTrigger>
            <TabsTrigger
              value="resolved"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Resolved
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredConflicts.length === 0 ? (
              <Card className="border-2 border-black text-center py-12">
                <CardContent>
                  <Check className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h2 className="text-xl font-bold uppercase tracking-wide mb-2">No Conflicts Found</h2>
                  <p className="text-muted-foreground uppercase text-sm tracking-wide">
                    {activeTab === "resolved" 
                      ? "You've resolved all conflicts!" 
                      : "All collaborations are running smoothly."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredConflicts.map((conflict) => (
                  <Card 
                    key={conflict.id} 
                    className={cn(
                      "border-2 border-black overflow-hidden cursor-pointer hover:shadow-md transition-shadow",
                      conflict.status === "escalated" && "border-red-500"
                    )}
                    onClick={() => setSelectedConflict(conflict)}
                  >
                    <div className={cn(
                      "h-2 w-full",
                      conflict.status === "open" ? "bg-orange-500" :
                      conflict.status === "escalated" ? "bg-red-500" :
                      "bg-green-500"
                    )}></div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-8 w-8 rounded-none flex items-center justify-center",
                            conflict.status === "open" ? "bg-orange-100" :
                            conflict.status === "escalated" ? "bg-red-100" :
                            "bg-green-100"
                          )}>
                            {getConflictIcon(conflict.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg uppercase tracking-wide">{conflict.title}</CardTitle>
                            <CardDescription className="uppercase text-xs tracking-wide">
                              {conflict.project.name} • {conflict.createdAt}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {getStatusBadge(conflict.status)}
                          {conflict.reports > 0 && (
                            <Badge variant="outline" className="border-2 border-red-500 uppercase text-xs tracking-wide">
                              <Flag className="h-3 w-3 mr-1 text-red-500" />
                              {conflict.reports} {conflict.reports === 1 ? 'Report' : 'Reports'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {conflict.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {conflict.participants.slice(0, 3).map((participant) => (
                            <Avatar key={participant.id} className="border-2 border-background rounded-none h-8 w-8">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback className="bg-black text-white">
                                {participant.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {conflict.participants.length > 3 && (
                            <div className="h-8 w-8 rounded-none bg-muted flex items-center justify-center text-xs border-2 border-background">
                              +{conflict.participants.length - 3}
                            </div>
                          )}
                        </div>
                        {getPriorityBadge(conflict.priority)}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex justify-end gap-2 w-full">
                        {conflict.status !== "resolved" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="gap-1 border-2 border-black uppercase text-xs tracking-wide"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedConflict(conflict)
                                setShowResolutionDialog(true)
                              }}
                            >
                              <Check className="h-3.5 w-3.5" />
                              Resolve
                            </Button>
                            {conflict.status !== "escalated" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="gap-1 border-2 border-red-500 text-red-500 uppercase text-xs tracking-wide hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEscalateConflict(conflict.id)
                                }}
                              >
                                <AlertCircle className="h-3.5 w-3.5" />
                                Escalate
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {selectedConflict && (
          <Card className="border-2 border-black overflow-hidden">
            <div className={cn(
              "h-2 w-full",
              selectedConflict.status === "open" ? "bg-orange-500" :
              selectedConflict.status === "escalated" ? "bg-red-500" :
              "bg-green-500"
            )}></div>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-xl uppercase tracking-wide">{selectedConflict.title}</CardTitle>
                    {getStatusBadge(selectedConflict.status)}
                  </div>
                  <CardDescription className="uppercase text-xs tracking-wide">
                    Project: {selectedConflict.project.name} • Reported {selectedConflict.createdAt}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {selectedConflict.status !== "resolved" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-1 border-2 border-black uppercase text-xs tracking-wide"
                        onClick={() => setShowResolutionDialog(true)}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Resolve Issue
                      </Button>
                      {selectedConflict.status !== "escalated" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="gap-1 border-2 border-red-500 text-red-500 uppercase text-xs tracking-wide hover:bg-red-50"
                          onClick={() => handleEscalateConflict(selectedConflict.id)}
                        >
                          <AlertCircle className="h-3.5 w-3.5" />
                          Escalate
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="uppercase text-xs tracking-wide rounded-none bg-black text-white">
                  {selectedConflict.type.charAt(0).toUpperCase() + selectedConflict.type.slice(1)} Conflict
                </Badge>
                {getPriorityBadge(selectedConflict.priority)}
                {selectedConflict.reports > 0 && (
                  <Badge variant="outline" className="border-2 border-red-500 uppercase text-xs tracking-wide">
                    <Flag className="h-3 w-3 mr-1 text-red-500" />
                    {selectedConflict.reports} {selectedConflict.reports === 1 ? 'Report' : 'Reports'}
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium uppercase tracking-wide mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{selectedConflict.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium uppercase tracking-wide mb-2">Participants</h3>
                <div className="space-y-2">
                  {selectedConflict.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3 p-2 border-2 border-black">
                      <Avatar className="h-8 w-8 rounded-none">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="bg-black text-white">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{participant.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-black" />

              <div className="space-y-2">
                <h3 className="text-sm font-medium uppercase tracking-wide">Resolution Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button 
                    variant="outline" 
                    className="justify-start gap-2 border-2 border-black uppercase text-xs tracking-wide"
                    onClick={() => {
                      // Would open the related content
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                    View Comments
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start gap-2 border-2 border-black uppercase text-xs tracking-wide"
                    onClick={() => {
                      // Would open the project
                    }}
                  >
                    <Shield className="h-4 w-4" />
                    Go to Project
                  </Button>
                  {selectedConflict.status !== "resolved" && (
                    <Button 
                      variant="outline" 
                      className="justify-start gap-2 border-2 border-red-500 text-red-500 uppercase text-xs tracking-wide hover:bg-red-50"
                      onClick={() => {
                        // Would moderate participants
                      }}
                    >
                      <UserX className="h-4 w-4" />
                      Moderate Users
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Resolution Dialog */}
      <Dialog open={showResolutionDialog} onOpenChange={setShowResolutionDialog}>
        <DialogContent className="border-2 border-black sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="uppercase tracking-wide">Resolve Conflict</DialogTitle>
            <DialogDescription className="uppercase text-xs tracking-wide">
              {selectedConflict && `Resolving conflict in ${selectedConflict.project.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution Notes</Label>
              <Textarea
                id="resolution"
                placeholder="Explain how this conflict was resolved..."
                className="min-h-[100px] border-2 border-black"
              />
            </div>
            <div className="space-y-2">
              <Label>Resolution Type</Label>
              <RadioGroup defaultValue="mediated" className="space-y-2">
                <div className="flex items-center space-x-2 border-2 border-black p-3">
                  <RadioGroupItem value="mediated" id="mediated" />
                  <Label htmlFor="mediated" className="flex-1 cursor-pointer">
                    <span className="font-medium">Mediated Resolution</span>
                    <p className="text-sm text-muted-foreground">Conflict was resolved through moderation</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border-2 border-black p-3">
                  <RadioGroupItem value="mutual" id="mutual" />
                  <Label htmlFor="mutual" className="flex-1 cursor-pointer">
                    <span className="font-medium">Mutual Agreement</span>
                    <p className="text-sm text-muted-foreground">Participants reached an agreement themselves</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border-2 border-black p-3">
                  <RadioGroupItem value="policy" id="policy" />
                  <Label htmlFor="policy" className="flex-1 cursor-pointer">
                    <span className="font-medium">Policy Enforcement</span>
                    <p className="text-sm text-muted-foreground">Resolved by enforcing community guidelines</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>Notify Participants?</Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="notify" className="h-4 w-4" defaultChecked />
                <Label htmlFor="notify">Send resolution notification to all participants</Label>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button 
              variant="outline" 
              onClick={() => setShowResolutionDialog(false)}
              className="border-2 border-black uppercase text-xs tracking-wide"
            >
              Cancel
            </Button>
            <Button 
              className="gap-2 bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide"
              onClick={() => selectedConflict && handleResolveConflict(selectedConflict.id)}
            >
              <Check className="h-4 w-4" />
              Mark as Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
