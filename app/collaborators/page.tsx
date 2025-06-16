"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Filter, Plus, Search, UserPlus } from "lucide-react"
import { getMoodColor } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { HarmonicCard, HarmonicCardContent } from "@/components/ui/harmonic-card"

// Sample collaborators data
const collaborators = [
  {
    id: "1",
    name: "Alex Smith",
    username: "alexsmith",
    avatar: "/placeholder-user.jpg",
    role: "Producer",
    mood: "happy",
    projects: 8,
    collaborations: 12,
    skills: ["Mixing", "Mastering", "Sound Design"],
    status: "active",
  },
  {
    id: "2",
    name: "Sam Johnson",
    username: "samjohnson",
    avatar: "/placeholder-user.jpg",
    role: "Vocalist",
    mood: "neutral",
    projects: 5,
    collaborations: 7,
    skills: ["Vocals", "Lyrics", "Composition"],
    status: "active",
  },
  {
    id: "3",
    name: "Taylor Wilson",
    username: "taylorwilson",
    avatar: "/placeholder-user.jpg",
    role: "Instrumentalist",
    mood: "frustrated",
    projects: 10,
    collaborations: 15,
    skills: ["Guitar", "Piano", "Drums"],
    status: "inactive",
  },
  {
    id: "4",
    name: "Jordan Lee",
    username: "jordanlee",
    avatar: "/placeholder-user.jpg",
    role: "Sound Engineer",
    mood: "happy",
    projects: 12,
    collaborations: 20,
    skills: ["Recording", "Mixing", "Mastering"],
    status: "active",
  },
  {
    id: "5",
    name: "Casey Morgan",
    username: "caseymorgan",
    avatar: "/placeholder-user.jpg",
    role: "Composer",
    mood: "neutral",
    projects: 7,
    collaborations: 9,
    skills: ["Composition", "Arrangement", "Orchestration"],
    status: "active",
  },
]

export default function CollaboratorsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredCollaborators = collaborators.filter((collaborator) => {
    // Filter by search query
    const matchesSearch =
      collaborator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collaborator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collaborator.role.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by tab
    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && collaborator.status === "active"
    if (activeTab === "inactive") return matchesSearch && collaborator.status === "inactive"

    return matchesSearch
  })

  const handleViewProfile = (id: string) => {
    router.push(`/collaborators/${id}`)
  }

  const handleInvite = () => {
    alert("Invite collaborator functionality would be implemented here")
  }

  return (
    <div className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Collaborators</h1>
            <p className="text-muted-foreground uppercase text-xs tracking-wide">
              Manage your collaborators and find new ones
            </p>
          </div>
          <Button
            className="gap-2 bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide"
            onClick={handleInvite}
          >
            <UserPlus className="h-4 w-4" />
            Invite Collaborator
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="SEARCH COLLABORATORS..."
              className="pl-8 border-2 border-black uppercase text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 border-2 border-black uppercase text-xs tracking-wide">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 border-2 border-black p-0 h-auto">
            <TabsTrigger
              value="all"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              All Collaborators
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="inactive"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Inactive
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredCollaborators.length === 0 ? (
              <div className="border-2 border-black p-8 text-center">
                <p className="text-muted-foreground uppercase text-sm tracking-wide">No collaborators found</p>
                <Button
                  className="mt-4 gap-2 bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide"
                  onClick={handleInvite}
                >
                  <Plus className="h-4 w-4" />
                  Invite New Collaborator
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCollaborators.map((collaborator) => (
                  <HarmonicCard
                    key={collaborator.id}
                    accentColor={getMoodColor(collaborator.mood)}
                    onClick={() => handleViewProfile(collaborator.id)}
                  >
                    <HarmonicCardContent className="pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12 rounded-none">
                              <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                              <AvatarFallback className="rounded-none bg-[#1C3F95] text-white">
                                {collaborator.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={cn(
                                "absolute -bottom-1 -right-1 h-3 w-3 border-2 border-background",
                                getMoodColor(collaborator.mood),
                              )}
                            ></div>
                          </div>
                          <div>
                            <h3 className="text-base font-medium uppercase tracking-wide">{collaborator.name}</h3>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">@{collaborator.username}</p>
                            <Badge className="uppercase text-xs tracking-wide rounded-none bg-black text-white">
                              {collaborator.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <div className="flex flex-col items-center p-2 border border-black">
                          <span className="font-bold">{collaborator.projects}</span>
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">Projects</span>
                        </div>
                        <div className="flex flex-col items-center p-2 border border-black">
                          <span className="font-bold">{collaborator.collaborations}</span>
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            Collaborations
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <h4 className="text-xs uppercase tracking-wide text-muted-foreground">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {collaborator.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="uppercase text-xs tracking-wide rounded-none border-2 border-[#1C3F95]"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mb-4 border-2 border-black uppercase text-xs tracking-wide"
                        onClick={(e) => {
                          e.stopPropagation()
                          alert(`Invite ${collaborator.name} to project functionality would be implemented here`)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Invite to Project
                      </Button>
                    </HarmonicCardContent>
                  </HarmonicCard>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
