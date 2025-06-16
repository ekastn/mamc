import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Music, Plus, Sparkles, Users } from "lucide-react"
import { EmotionSelector } from "@/components/emotion-selector"

export default function Home() {
  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-8">
          <div className="space-y-4 p-6 border-2 border-black">
            <h1 className="text-3xl font-bold tracking-tight uppercase">Welcome back!</h1>
            <p className="text-muted-foreground uppercase text-sm tracking-wide">How are you feeling today?</p>
            <EmotionSelector />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold uppercase tracking-wide">Recent Projects</h2>
              <Button variant="ghost" size="sm" asChild className="uppercase text-xs tracking-wide">
                <Link href="/projects" className="flex items-center gap-1">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentProjects.map((project) => (
                <Card key={project.id} className="border-2 border-black overflow-hidden">
                  <div className={`h-2 w-full ${project.color}`}></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg uppercase tracking-wide">{project.title}</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-wide">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs uppercase tracking-wide">{project.collaborators} collaborators</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Music className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs uppercase tracking-wide">{project.tracks} tracks</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full bg-black text-white hover:bg-black/90">
                      <Link href={`/projects/${project.id}`} className="uppercase text-xs tracking-wide">
                        Open Project
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              <Card className="border-2 border-dashed border-black">
                <CardContent className="flex flex-col items-center justify-center h-[180px]">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 border-2 border-black uppercase text-xs tracking-wide"
                    asChild
                  >
                    <Link href="/projects/new">
                      <Plus className="h-4 w-4" />
                      Create New Project
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>


        </div>

        <div className="w-full md:w-80 space-y-6">
          <Card className="border-2 border-black overflow-hidden">
            <div className="h-2 w-full bg-[#FFD500]"></div>
            <CardHeader>
              <CardTitle className="text-lg uppercase tracking-wide">Suggestions</CardTitle>
              <CardDescription className="text-xs uppercase tracking-wide">
                Based on your recent activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex gap-3">
                  <Sparkles className="h-5 w-5 text-[#FFD500] flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium uppercase tracking-wide">{suggestion.title}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                    <Button variant="link" size="sm" className="h-auto p-0 uppercase text-xs tracking-wide" asChild>
                      <Link href={suggestion.link}>Take action</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-2 border-black overflow-hidden">
            <div className="h-2 w-full bg-[#1C3F95]"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg uppercase tracking-wide">Recent Activity</CardTitle>
              <CardDescription className="text-xs uppercase tracking-wide">Latest updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.slice(0, 2).map((activity, index) => (
                <div key={index} className="border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-start gap-2">
                    <div className={`h-2 w-2 mt-2 ${activity.unread ? "bg-[#E41E26]" : "bg-black"}`}></div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-1">
                <Button variant="outline" size="sm" asChild className="w-full border-2 border-black uppercase text-xs tracking-wide">
                  <Link href="/activity" className="flex items-center justify-center gap-1">
                    View All Activity <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const recentProjects = [
  {
    id: "1",
    title: "Summer Vibes EP",
    description: "Electronic dance collaboration",
    collaborators: 4,
    tracks: 6,
    color: "bg-[#E41E26]",
  },
  {
    id: "2",
    title: "Acoustic Sessions",
    description: "Unplugged versions of popular tracks",
    collaborators: 2,
    tracks: 3,
    color: "bg-[#1C3F95]",
  },
]

const recentActivity = [
  {
    title: "Alex commented on 'Summer Vibes EP'",
    description: "I love the new bassline at 1:24! It really adds energy to the chorus.",
    time: "2 hours ago",
    unread: true,
  },
  {
    title: "Sarah uploaded a new version of 'Track 3'",
    description: "Added the vocal harmonies we discussed. Let me know what you think!",
    time: "Yesterday",
    unread: false,
  },
  {
    title: "Mike tagged a section as 'Needs work'",
    description: "The transition at 2:15 feels a bit abrupt. Maybe we could smooth it out?",
    time: "2 days ago",
    unread: false,
  },
]

const suggestions = [
  {
    title: "Respond to Alex's comment",
    description: "They're waiting for your feedback on the bassline",
    link: "/projects/1",
  },
  {
    title: "Review Sarah's new version",
    description: "She added the vocal harmonies to Track 3",
    link: "/projects/2",
  },
  {
    title: "Resolve conflict in 'Acoustic Sessions'",
    description: "There are differing opinions about the bridge section",
    link: "/projects/2",
  },
]


