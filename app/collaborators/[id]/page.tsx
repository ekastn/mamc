"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Music,
  Globe,
  Mail,
  Twitter,
  Instagram,
  ExternalLink,
  MapPin,
  Calendar,
  Briefcase,
  UserPlus,
  MessageSquare,
} from "lucide-react"
import { cn, getMoodColor } from "@/lib/utils"
import { useRouter } from "next/navigation"

// Sample collaborator data
const collaborator = {
  id: "1",
  name: "Alex Smith",
  username: "alexsmith",
  avatar: "/placeholder-user.jpg",
  email: "alex@example.com",
  role: "Producer",
  mood: "happy",
  bio: "Music producer and sound designer with a passion for electronic and ambient music. Always looking for interesting collaborations.",
  location: "Los Angeles, CA",
  joinDate: "January 2022",
  website: "https://alexsmith.com",
  socialLinks: {
    twitter: "https://twitter.com/alexsmith",
    instagram: "https://instagram.com/alexsmith",
    soundcloud: "https://soundcloud.com/alexsmith",
  },
  projects: 8,
  collaborations: 12,
  followers: 156,
  following: 89,
  skills: ["Mixing", "Mastering", "Sound Design", "Synthesis", "Arrangement"],
  instruments: ["Synthesizers", "Piano", "Drum Programming"],
  genres: ["Electronic", "Ambient", "Experimental", "Dance"],
  recentProjects: [
    { id: "1", title: "Summer Vibes EP", role: "Producer", date: "2 weeks ago" },
    { id: "2", title: "Acoustic Sessions", role: "Mixing Engineer", date: "1 month ago" },
    { id: "3", title: "Jazz Ensemble", role: "Sound Designer", date: "2 months ago" },
  ],
  status: "active",
}

export default function CollaboratorProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  const handleInviteToProject = () => {
    alert(`Invite ${collaborator.name} to project functionality would be implemented here`)
  }

  const handleSendMessage = () => {
    alert(`Send message to ${collaborator.name} functionality would be implemented here`)
  }

  const handleViewProject = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  return (
    <div className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="border-2 border-black rounded-none" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight uppercase">{collaborator.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="border-2 border-black md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg uppercase tracking-wide">Profile Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <Avatar className="h-24 w-24 rounded-none">
                    <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                    <AvatarFallback className="rounded-none bg-[#1C3F95] text-white text-xl">
                      {collaborator.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute -bottom-1 -right-1 h-4 w-4 border-2 border-background",
                      getMoodColor(collaborator.mood),
                    )}
                  ></div>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold uppercase tracking-wide">{collaborator.name}</h2>
                  <p className="text-muted-foreground uppercase text-xs tracking-wide">@{collaborator.username}</p>
                  <Badge className="mt-1 uppercase text-xs tracking-wide rounded-none bg-black text-white">
                    {collaborator.role}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 gap-1 bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide"
                  onClick={handleInviteToProject}
                >
                  <UserPlus className="h-4 w-4" />
                  Invite
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-1 border-2 border-black uppercase text-xs tracking-wide"
                  onClick={handleSendMessage}
                >
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
              </div>

              <Separator className="bg-black" />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm uppercase tracking-wide">{collaborator.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm uppercase tracking-wide">{collaborator.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm uppercase tracking-wide">Joined {collaborator.joinDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm uppercase tracking-wide">{collaborator.email}</span>
                </div>
                {collaborator.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={collaborator.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm uppercase tracking-wide text-[#1C3F95] hover:underline flex items-center gap-1"
                    >
                      {collaborator.website.replace(/^https?:\/\//, "")}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>

              <Separator className="bg-black" />

              <div className="space-y-2">
                <h3 className="text-sm font-medium uppercase tracking-wide">Stats</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border-2 border-black p-2 text-center">
                    <div className="text-lg font-bold">{collaborator.projects}</div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Projects</div>
                  </div>
                  <div className="border-2 border-black p-2 text-center">
                    <div className="text-lg font-bold">{collaborator.collaborations}</div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Collaborations</div>
                  </div>
                  <div className="border-2 border-black p-2 text-center">
                    <div className="text-lg font-bold">{collaborator.followers}</div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Followers</div>
                  </div>
                  <div className="border-2 border-black p-2 text-center">
                    <div className="text-lg font-bold">{collaborator.following}</div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Following</div>
                  </div>
                </div>
              </div>

              <Separator className="bg-black" />

              <div className="space-y-2">
                <h3 className="text-sm font-medium uppercase tracking-wide">Social Links</h3>
                <div className="flex flex-wrap gap-2">
                  {collaborator.socialLinks?.twitter && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 border-2 border-black uppercase text-xs tracking-wide"
                      onClick={() => window.open(collaborator.socialLinks?.twitter, "_blank")}
                    >
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </Button>
                  )}
                  {collaborator.socialLinks?.instagram && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 border-2 border-black uppercase text-xs tracking-wide"
                      onClick={() => window.open(collaborator.socialLinks?.instagram, "_blank")}
                    >
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </Button>
                  )}
                  {collaborator.socialLinks?.soundcloud && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 border-2 border-black uppercase text-xs tracking-wide"
                      onClick={() => window.open(collaborator.socialLinks?.soundcloud, "_blank")}
                    >
                      <Music className="h-4 w-4" />
                      SoundCloud
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Card className="border-2 border-black md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg uppercase tracking-wide">Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="about" className="space-y-4">
                <TabsList className="grid grid-cols-3 border-2 border-black p-0 h-auto">
                  <TabsTrigger
                    value="about"
                    className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    Projects
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    Skills
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium uppercase tracking-wide">Bio</h3>
                    <p className="text-sm">{collaborator.bio}</p>
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium uppercase tracking-wide">Recent Projects</h3>
                    <div className="space-y-2">
                      {collaborator.recentProjects.map((project) => (
                        <div
                          key={project.id}
                          className="p-3 border-2 border-black cursor-pointer hover:bg-muted/50"
                          onClick={() => handleViewProject(project.id)}
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium uppercase tracking-wide">{project.title}</h4>
                            <Badge variant="outline" className="uppercase text-xs tracking-wide rounded-none">
                              {project.role}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">{project.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium uppercase tracking-wide">Skills</h3>
                      <div className="flex flex-wrap gap-2">
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

                    <Separator className="bg-black" />

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium uppercase tracking-wide">Instruments</h3>
                      <div className="flex flex-wrap gap-2">
                        {collaborator.instruments.map((instrument, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="uppercase text-xs tracking-wide rounded-none border-2 border-[#E41E26]"
                          >
                            {instrument}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-black" />

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium uppercase tracking-wide">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {collaborator.genres.map((genre, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="uppercase text-xs tracking-wide rounded-none border-2 border-[#FFD500]"
                          >
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
