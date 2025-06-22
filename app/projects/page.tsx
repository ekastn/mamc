"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Grid, List, Music, Users, Clock } from "lucide-react"
import Link from "next/link"
import { projectService } from "@/lib/services/client/project-service"
import { HarmonicCard, HarmonicCardContent, HarmonicCardFooter } from "@/components/ui/harmonic-card"

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const projects = projectService.getAllProjects() || []

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Filter projects based on category
    if (filterCategory === "all") return matchesSearch
    if (filterCategory === "my") return matchesSearch && project.owner?.id === "user-1" // Assuming current user id is user-1
    if (filterCategory === "shared") return matchesSearch && project.collaborators.some(c => c.id !== "user-1" && c.id !== project.owner?.id)
    if (filterCategory === "archived") return matchesSearch && project.archived === true
    
    return matchesSearch
  })

  return (
    <div className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-wide">Projects</h1>
            <p className="text-muted-foreground uppercase text-sm tracking-wide">
              Manage your music collaboration projects
            </p>
          </div>
          <Button asChild className="gap-2 bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide">
            <Link href="/projects/new">
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 border-black"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`border-2 border-black ${viewMode === "grid" ? "bg-black text-white" : ""}`}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode("list")}
              className={`border-2 border-black ${viewMode === "list" ? "bg-black text-white" : ""}`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filter Categories */}
        <Tabs value={filterCategory} onValueChange={setFilterCategory}>
          <TabsList className="grid grid-cols-4 border-2 border-black p-0 h-auto">
            <TabsTrigger
              value="all"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              All Projects
            </TabsTrigger>
            <TabsTrigger
              value="my"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              My Projects
            </TabsTrigger>
            <TabsTrigger
              value="shared"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Shared With Me
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Archived
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Projects Grid/List */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredProjects.map((project) => (
            <HarmonicCard 
              key={project.id} 
              title={project.title}
              description={project.description}
              accentColor={project.color}
              headerClassName="pb-3"
            >
              <div className="flex items-start justify-between absolute top-4 right-4">
                {project.checkpoints && project.checkpoints.length > 0 && project.currentCheckpointId ? (
                  <Badge variant="outline" className="border-2 border-black uppercase text-xs tracking-wide">
                    {project.checkpoints.find(cp => cp.id === project.currentCheckpointId)?.label || 'v1.0'}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-2 border-black uppercase text-xs tracking-wide">
                    No version
                  </Badge>
                )}
              </div>
              <HarmonicCardContent className="pb-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs uppercase tracking-wide">
                        {project.collaborators.length} collaborators
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Music className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs uppercase tracking-wide">{project.tracks.length} tracks</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs uppercase tracking-wide">Updated {project.lastUpdated}</span>
                    </div>
                    {project.checkpoints && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs uppercase tracking-wide">
                          {project.checkpoints.length} {project.checkpoints.length === 1 ? 'checkpoint' : 'checkpoints'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs uppercase tracking-wide bg-muted text-muted-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge
                        variant="secondary"
                        className="text-xs uppercase tracking-wide bg-muted text-muted-foreground"
                      >
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </HarmonicCardContent>
              <HarmonicCardFooter>
                <Button
                  asChild
                  className="w-full bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide"
                >
                  <Link href={`/projects/${project.id}`}>Open Project</Link>
                </Button>
              </HarmonicCardFooter>
            </HarmonicCard>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium uppercase tracking-wide mb-2">No projects found</h3>
            <p className="text-muted-foreground uppercase text-sm tracking-wide mb-4">
              {searchQuery ? "Try adjusting your search terms" : "Create your first project to get started"}
            </p>
            <Button asChild className="gap-2 bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide">
              <Link href="/projects/new">
                <Plus className="h-4 w-4" />
                Create Project
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
