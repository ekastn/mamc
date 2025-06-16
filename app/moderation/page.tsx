"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HarmonicCard, HarmonicCardContent, HarmonicCardFooter } from "@/components/ui/harmonic-card"
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
          
          {/* Summary metrics in a clean grid */}
          <div className="grid grid-cols-3 gap-0 border-2 border-black">
            <div className="border-r-2 border-black p-3 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Open</p>
              <p className="text-xl font-bold">{conflicts.filter(c => c.status === "open").length}</p>
            </div>
            <div className="border-r-2 border-black p-3 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Escalated</p>
              <p className="text-xl font-bold text-red-500">{conflicts.filter(c => c.status === "escalated").length}</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Resolved</p>
              <p className="text-xl font-bold text-green-500">{conflicts.filter(c => c.status === "resolved").length}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 border-2 border-black p-0 h-auto">
            <TabsTrigger
              value="all"
              className="uppercase text-xs tracking-wide py-2.5 rounded-none data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
            >
              All Conflicts
            </TabsTrigger>
            <TabsTrigger
              value="open"
              className="uppercase text-xs tracking-wide py-2.5 rounded-none data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
            >
              Open
            </TabsTrigger>
            <TabsTrigger
              value="escalated"
              className="uppercase text-xs tracking-wide py-2.5 rounded-none data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
            >
              Escalated
            </TabsTrigger>
            <TabsTrigger
              value="resolved"
              className="uppercase text-xs tracking-wide py-2.5 rounded-none data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
            >
              Resolved
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredConflicts.length === 0 ? (
              <HarmonicCard className="text-center py-8">
                <HarmonicCardContent>
                  <div className="grid grid-cols-1 gap-4 place-items-center">
                    {/* Geometric success icon container */}
                    <div className="h-20 w-20 bg-green-50 border-2 border-green-500 flex items-center justify-center">
                      <Check className="h-12 w-12 text-green-500" />
                    </div>
                    
                    {/* Clear, structured text */}
                    <div className="space-y-2 max-w-md">
                      <h2 className="text-xl font-bold uppercase tracking-wide">No Conflicts Found</h2>
                      <p className="text-muted-foreground uppercase text-sm tracking-wide">
                        {activeTab === "all" 
                          ? "All collaborations are running smoothly." 
                          : activeTab === "resolved"
                            ? "You've resolved all conflicts in this category!" 
                            : `No ${activeTab} conflicts found at the moment.`}
                      </p>
                    </div>
                    
                    {/* Grid-based button layout */}
                    <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-2">
                      {activeTab !== "all" && (
                        <Button 
                          variant="outline"
                          className="border-2 border-black uppercase text-xs tracking-wide"
                          onClick={() => setActiveTab("all")}
                        >
                          View All Conflicts
                        </Button>
                      )}
                      {activeTab === "all" && (
                        <Button 
                          variant="outline"
                          className="border-2 border-black uppercase text-xs tracking-wide"
                          onClick={() => {
                            // Would refresh the list
                          }}
                        >
                          Refresh List
                        </Button>
                      )}
                      <Button 
                        className={cn(
                          "bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide",
                          activeTab === "all" ? "col-span-1" : "col-span-1"
                        )}
                        onClick={() => {
                          // Would open help documentation
                        }}
                      >
                        Moderation Guide
                      </Button>
                    </div>
                  </div>
                </HarmonicCardContent>
              </HarmonicCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredConflicts.map((conflict) => (
                  <HarmonicCard 
                    key={conflict.id} 
                    title={conflict.title}
                    description={`${conflict.project.name} • ${conflict.createdAt}`}
                    accentColor={
                      conflict.status === "open" ? "bg-orange-500" :
                      conflict.status === "escalated" ? "bg-red-500" :
                      "bg-green-500"
                    }
                    className={cn(
                      conflict.status === "escalated" && "border-red-500"
                    )}
                    onClick={() => setSelectedConflict(conflict)}
                  >
                    <HarmonicCardContent className="pb-2">
                      {/* Bauhaus-inspired grid layout with clear visual hierarchy */}
                      <div className="grid grid-cols-[auto,1fr] gap-4">
                        {/* Conflict type icon with status-based background */}
                        <div className={cn(
                          "h-12 w-12 rounded-none flex items-center justify-center",
                          conflict.status === "open" ? "bg-orange-100" :
                          conflict.status === "escalated" ? "bg-red-100" :
                          "bg-green-100"
                        )}>
                          {getConflictIcon(conflict.type)}
                        </div>
                        
                        {/* Content container */}
                        <div className="flex flex-col space-y-3">
                          {/* Status badges in a clean row */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {getStatusBadge(conflict.status)}
                            {conflict.reports > 0 && (
                              <Badge variant="outline" className="border-2 border-red-500 uppercase text-xs tracking-wide">
                                <Flag className="h-3 w-3 mr-1 text-red-500" />
                                {conflict.reports} {conflict.reports === 1 ? 'Report' : 'Reports'}
                              </Badge>
                            )}
                          </div>
                          
                          {/* Description with proper line clamp */}
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {conflict.description}
                          </p>
                        </div>
                      </div>

                      {/* Metadata grid with clear separation - participants and priority */}
                      <div className="grid grid-cols-2 gap-2 mt-4 border-t-2 border-gray-100 pt-3">
                        {/* Participants with better alignment */}
                        <div className="flex items-center">
                          <div className="flex -space-x-2 mr-2">
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
                          <span className="text-xs uppercase tracking-wide">
                            {conflict.participants.length} {conflict.participants.length === 1 ? 'Participant' : 'Participants'}
                          </span>
                        </div>
                        
                        {/* Priority badge with better alignment */}
                        <div className="flex justify-end items-center">
                          {getPriorityBadge(conflict.priority)}
                        </div>
                      </div>
                    </HarmonicCardContent>
                    
                    <HarmonicCardFooter className="pt-0 border-t-2 border-gray-100">
                      <div className="grid grid-cols-2 gap-2 w-full">
                        {/* Conflict type indicator with more geometric treatment */}
                        <div className="flex items-center">
                          <div className={cn(
                            "h-3 w-3 rounded-none",
                            conflict.status === "open" ? "bg-orange-500" :
                            conflict.status === "escalated" ? "bg-red-500" :
                            "bg-green-500"
                          )} />
                          <span className="text-xs ml-2 text-muted-foreground uppercase tracking-wide">
                            {conflict.type.charAt(0).toUpperCase() + conflict.type.slice(1)} Conflict
                          </span>
                        </div>
                        
                        {/* Action buttons with improved alignment */}
                        <div className="flex justify-end gap-2">
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
                      </div>
                    </HarmonicCardFooter>
                  </HarmonicCard>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {selectedConflict && (
          <HarmonicCard 
            title={selectedConflict.title}
            description={`Project: ${selectedConflict.project.name} • Reported ${selectedConflict.createdAt}`}
            accentColor={
              selectedConflict.status === "open" ? "bg-orange-500" :
              selectedConflict.status === "escalated" ? "bg-red-500" :
              "bg-green-500"
            }
            className={cn(
              selectedConflict.status === "escalated" && "border-red-500",
              "print:shadow-none"
            )}
          >
            <HarmonicCardContent>
              {/* Bauhaus-inspired header with grid-based structure and strong visual hierarchy */}
              <div className="grid grid-cols-[auto,1fr] gap-6 mb-6">
                {/* Larger icon with status color */}
                <div className={cn(
                  "h-16 w-16 rounded-none flex items-center justify-center",
                  selectedConflict.status === "open" ? "bg-orange-100" :
                  selectedConflict.status === "escalated" ? "bg-red-100" :
                  "bg-green-100"
                )}>
                  {getConflictIcon(selectedConflict.type)}
                </div>
                
                {/* Status and action grid */}
                <div className="grid grid-rows-[auto,1fr] gap-3">
                  {/* Top row: Status badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="uppercase text-xs tracking-wide rounded-none bg-black text-white">
                      {selectedConflict.type.charAt(0).toUpperCase() + selectedConflict.type.slice(1)} Conflict
                    </Badge>
                    {getStatusBadge(selectedConflict.status)}
                    {getPriorityBadge(selectedConflict.priority)}
                    {selectedConflict.reports > 0 && (
                      <Badge variant="outline" className="border-2 border-red-500 uppercase text-xs tracking-wide">
                        <Flag className="h-3 w-3 mr-1 text-red-500" />
                        {selectedConflict.reports} {selectedConflict.reports === 1 ? 'Report' : 'Reports'}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Bottom row: Action buttons */}
                  <div className="flex items-end gap-2">
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
              </div>
              
              {/* Main content in a clean two-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column: Description */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium uppercase tracking-wide flex items-center gap-2">
                    <span className="w-3 h-3 bg-black"></span>
                    Description
                  </h3>
                  <div className="p-4 border-2 border-gray-200 bg-gray-50 h-full">
                    <p className="text-sm text-muted-foreground">{selectedConflict.description}</p>
                  </div>
                </div>
                
                {/* Right column: Participants */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium uppercase tracking-wide flex items-center gap-2">
                    <span className="w-3 h-3 bg-black"></span>
                    Participants
                  </h3>
                  <div className="grid grid-cols-1 gap-2 h-full">
                    {selectedConflict.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center gap-3 p-3 border-2 border-black">
                        <Avatar className="h-10 w-10 rounded-none">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback className="bg-black text-white">
                            {participant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{participant.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resolution options in a clean geometric layout */}
              <div className="mt-6 pt-6 border-t-2 border-black">
                <h3 className="text-sm font-medium uppercase tracking-wide flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 bg-black"></span>
                  Resolution Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button 
                    variant="outline" 
                    className="justify-start gap-2 border-2 border-black h-12 uppercase text-xs tracking-wide"
                    onClick={() => {
                      // Would open the related content
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                    View Comments
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start gap-2 border-2 border-black h-12 uppercase text-xs tracking-wide"
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
                      className="justify-start gap-2 border-2 border-red-500 text-red-500 h-12 uppercase text-xs tracking-wide hover:bg-red-50"
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
            </HarmonicCardContent>
          </HarmonicCard>
        )}
      </div>

      {/* Resolution Dialog */}
      <Dialog open={showResolutionDialog} onOpenChange={setShowResolutionDialog}>
        <DialogContent className="border-2 border-black rounded-none sm:max-w-[500px]">
          <DialogHeader className="border-b-2 border-black pb-3">
            <DialogTitle className="uppercase tracking-wide font-bold">Resolve Conflict</DialogTitle>
            <DialogDescription className="uppercase text-xs tracking-wide">
              {selectedConflict && `Resolving conflict in ${selectedConflict.project.name}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-5 py-4">
            {/* Resolution notes */}
            <div className="grid grid-cols-[auto,1fr] gap-3 items-start">
              <div className="w-3 h-3 bg-black mt-1.5"></div>
              <div className="space-y-2 w-full">
                <Label htmlFor="resolution" className="uppercase text-xs tracking-wide font-medium">Resolution Notes</Label>
                <Textarea
                  id="resolution"
                  placeholder="Explain how this conflict was resolved..."
                  className="min-h-[100px] border-2 border-black rounded-none w-full"
                />
              </div>
            </div>
            
            {/* Resolution type */}
            <div className="grid grid-cols-[auto,1fr] gap-3 items-start">
              <div className="w-3 h-3 bg-black mt-1.5"></div>
              <div className="space-y-3 w-full">
                <Label className="uppercase text-xs tracking-wide font-medium">Resolution Type</Label>
                <RadioGroup defaultValue="mediated" className="space-y-3">
                  <div className="flex items-center space-x-2 border-2 border-black p-3 transition-colors hover:bg-gray-50">
                    <RadioGroupItem value="mediated" id="mediated" className="border-black" />
                    <Label htmlFor="mediated" className="flex-1 cursor-pointer">
                      <span className="font-medium">Mediated Resolution</span>
                      <p className="text-sm text-muted-foreground">Conflict was resolved through moderation</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border-2 border-black p-3 transition-colors hover:bg-gray-50">
                    <RadioGroupItem value="mutual" id="mutual" className="border-black" />
                    <Label htmlFor="mutual" className="flex-1 cursor-pointer">
                      <span className="font-medium">Mutual Agreement</span>
                      <p className="text-sm text-muted-foreground">Participants reached an agreement themselves</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border-2 border-black p-3 transition-colors hover:bg-gray-50">
                    <RadioGroupItem value="policy" id="policy" className="border-black" />
                    <Label htmlFor="policy" className="flex-1 cursor-pointer">
                      <span className="font-medium">Policy Enforcement</span>
                      <p className="text-sm text-muted-foreground">Resolved by enforcing community guidelines</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {/* Notification preference */}
            <div className="grid grid-cols-[auto,1fr] gap-3 items-center">
              <div className="w-3 h-3 bg-black"></div>
              <div className="space-y-2">
                <Label className="uppercase text-xs tracking-wide font-medium">Notify Participants</Label>
                <div className="flex items-center space-x-2 p-2 border-2 border-black">
                  <input type="checkbox" id="notify" className="h-4 w-4 rounded-none" defaultChecked />
                  <Label htmlFor="notify" className="cursor-pointer text-sm">Send resolution notification to all participants</Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="border-t-2 border-black pt-3 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowResolutionDialog(false)}
              className="border-2 border-black uppercase text-xs tracking-wide rounded-none"
            >
              Cancel
            </Button>
            <Button 
              className="gap-2 bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide rounded-none"
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
