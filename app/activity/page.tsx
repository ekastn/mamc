"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { HarmonicCard, HarmonicCardContent } from "@/components/ui/harmonic-card"

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  // Group activities into time-based sections
  const groupedActivities = useMemo(() => {
    // First filter activities based on search query and type
    const filteredActivities = recentActivity.filter((activity) => {
      const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (filterType === "all") return matchesSearch
      if (filterType === "unread") return matchesSearch && activity.unread
      if (filterType === "read") return matchesSearch && !activity.unread
      
      return matchesSearch
    })

    // Then group filtered activities by time period
    return {
      today: filteredActivities.filter(activity => 
        activity.time === "2 hours ago" || 
        activity.time === "Just now" || 
        activity.time.includes("minute") || 
        activity.time.includes("hour")),
      thisWeek: filteredActivities.filter(activity => 
        activity.time === "Yesterday" || 
        activity.time.includes("day") || 
        activity.time === "1 week ago"),
      others: filteredActivities.filter(activity => 
        activity.time.includes("week") && activity.time !== "1 week ago" || 
        activity.time.includes("month") || 
        activity.time.includes("year"))
    }
  }, [searchQuery, filterType])

  // Check if there are any activities to display
  const hasActivities = Object.values(groupedActivities).some(group => group.length > 0)

  return (
    <div className="py-8">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Activity</h1>
            <p className="text-muted-foreground uppercase text-sm tracking-wide">
              Track all updates and interactions across your projects
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 border-black"
            />
          </div>
          <Tabs value={filterType} onValueChange={setFilterType} className="w-full md:w-auto">
            <TabsList className="border-2 border-black p-0 h-auto grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger
                value="all"
                className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Unread
              </TabsTrigger>
              <TabsTrigger
                value="read"
                className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Read
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Activity List Grouped by Time */}
        <div className="space-y-8">
          {/* Today Section */}
          {groupedActivities.today.length > 0 && (
            <div>
              <h2 className="text-xl font-bold tracking-tight uppercase mb-4">Today</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedActivities.today.map((activity, index) => (
                  <HarmonicCard 
                    key={`today-${index}`} 
                    title={activity.title}
                    description={activity.time}
                  >
                    <HarmonicCardContent>
                      <p className="text-sm">{activity.description}</p>
                    </HarmonicCardContent>
                  </HarmonicCard>
                ))}
              </div>
            </div>
          )}

          {/* This Week Section */}
          {groupedActivities.thisWeek.length > 0 && (
            <div>
              <h2 className="text-xl font-bold tracking-tight uppercase mb-4">This Week</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedActivities.thisWeek.map((activity, index) => (
                  <HarmonicCard 
                    key={`week-${index}`} 
                    title={activity.title}
                    description={activity.time}
                  >
                    <HarmonicCardContent>
                      <p className="text-sm">{activity.description}</p>
                    </HarmonicCardContent>
                  </HarmonicCard>
                ))}
              </div>
            </div>
          )}

          {/* Others Section */}
          {groupedActivities.others.length > 0 && (
            <div>
              <h2 className="text-xl font-bold tracking-tight uppercase mb-4">Older</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedActivities.others.map((activity, index) => (
                  <HarmonicCard 
                    key={`others-${index}`} 
                    title={activity.title}
                    description={activity.time}
                    isUnread={activity.unread}
                  >
                    <HarmonicCardContent>
                      <p className="text-sm">{activity.description}</p>
                    </HarmonicCardContent>
                  </HarmonicCard>
                ))}
              </div>
            </div>
          )}

          {/* No Activities Message */}
          {!hasActivities && (
            <div className="text-center py-12">
              <p className="text-lg font-medium uppercase tracking-wide mb-2">No activities found</p>
              <p className="text-muted-foreground uppercase text-sm tracking-wide mb-4">
                {searchQuery ? "Try adjusting your search terms" : "You have no activities to display"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Using the same activity data from the home page for now
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
  {
    title: "Jason invited you to collaborate on 'Winter Beats'",
    description: "Hey, I'd love your input on this new electronic project I'm working on.",
    time: "3 days ago",
    unread: true,
  },
  {
    title: "Emma created a new checkpoint 'Final Mix v1'",
    description: "This version includes all the changes we discussed in the last meeting.",
    time: "1 week ago",
    unread: false,
  },
  {
    title: "Studio session scheduled",
    description: "Recording session for 'Acoustic Sessions' has been scheduled for next Monday at 2pm.",
    time: "1 week ago",
    unread: false,
  }
]
