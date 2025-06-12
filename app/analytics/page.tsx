"use client"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownToLine, BarChart3, Download, FileText, Users } from "lucide-react"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  ChartArea,
  ChartLine,
  ChartBar,
} from "@/components/ui/chart"

export default function AnalyticsPage() {
  return (
    <div className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Analytics & Reports</h1>
            <p className="text-muted-foreground uppercase text-xs tracking-wide">
              Track engagement and emotional trends across your projects
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="last30days">
              <SelectTrigger className="w-[180px] border-2 border-black rounded-none uppercase text-xs tracking-wide">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent className="border-2 border-black rounded-none">
                <SelectItem value="last7days" className="uppercase text-xs tracking-wide">
                  Last 7 days
                </SelectItem>
                <SelectItem value="last30days" className="uppercase text-xs tracking-wide">
                  Last 30 days
                </SelectItem>
                <SelectItem value="last90days" className="uppercase text-xs tracking-wide">
                  Last 90 days
                </SelectItem>
                <SelectItem value="lastyear" className="uppercase text-xs tracking-wide">
                  Last year
                </SelectItem>
                <SelectItem value="alltime" className="uppercase text-xs tracking-wide">
                  All time
                </SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 border-2 border-black uppercase text-xs tracking-wide">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-black overflow-hidden">
            <div className="h-2 w-full bg-[#E41E26]"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wide">Total Projects</CardTitle>
              <CardDescription className="uppercase text-xs tracking-wide">All active projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">12</div>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-black overflow-hidden">
            <div className="h-2 w-full bg-[#1C3F95]"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wide">Active Collaborators</CardTitle>
              <CardDescription className="uppercase text-xs tracking-wide">Across all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">28</div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-black overflow-hidden">
            <div className="h-2 w-full bg-[#FFD500]"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wide">Total Comments</CardTitle>
              <CardDescription className="uppercase text-xs tracking-wide">Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">143</div>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="engagement" className="space-y-4">
          <TabsList className="grid grid-cols-3 border-2 border-black p-0 h-auto">
            <TabsTrigger
              value="engagement"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Engagement
            </TabsTrigger>
            <TabsTrigger
              value="emotions"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Emotional Trends
            </TabsTrigger>
            <TabsTrigger
              value="conflicts"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Conflicts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="engagement" className="space-y-6">
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle className="uppercase tracking-wide">Project Engagement</CardTitle>
                <CardDescription className="uppercase text-xs tracking-wide">
                  Comments and feedback over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bauhaus-grid">
                  <Chart>
                    <ChartContainer>
                      <ChartTooltip>
                        <ChartTooltipContent />
                      </ChartTooltip>
                      <ChartLegend>
                        <ChartLegendItem name="Comments" color="#1C3F95" />
                        <ChartLegendItem name="Feedback" color="#E41E26" />
                      </ChartLegend>
                      <ChartGrid />
                      <ChartXAxis />
                      <ChartYAxis />
                      <ChartLine data={[10, 15, 25, 32, 28, 42, 48]} name="Comments" color="#1C3F95" />
                      <ChartLine data={[5, 10, 15, 20, 18, 28, 30]} name="Feedback" color="#E41E26" />
                    </ChartContainer>
                  </Chart>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-black">
                <CardHeader>
                  <CardTitle className="uppercase tracking-wide">Most Active Projects</CardTitle>
                  <CardDescription className="uppercase text-xs tracking-wide">
                    Based on comment activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] bauhaus-grid">
                    <Chart>
                      <ChartContainer>
                        <ChartTooltip>
                          <ChartTooltipContent />
                        </ChartTooltip>
                        <ChartGrid />
                        <ChartXAxis />
                        <ChartYAxis />
                        <ChartBar data={[48, 32, 28, 25, 15]} name="Comments" color="#1C3F95" />
                      </ChartContainer>
                    </Chart>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-black">
                <CardHeader>
                  <CardTitle className="uppercase tracking-wide">Most Active Collaborators</CardTitle>
                  <CardDescription className="uppercase text-xs tracking-wide">Based on contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] bauhaus-grid">
                    <Chart>
                      <ChartContainer>
                        <ChartTooltip>
                          <ChartTooltipContent />
                        </ChartTooltip>
                        <ChartGrid />
                        <ChartXAxis />
                        <ChartYAxis />
                        <ChartBar data={[42, 35, 28, 20, 15]} name="Contributions" color="#FFD500" />
                      </ChartContainer>
                    </Chart>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="emotions" className="space-y-6">
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle className="uppercase tracking-wide">Emotional Trends</CardTitle>
                <CardDescription className="uppercase text-xs tracking-wide">
                  Distribution of emotions across projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bauhaus-grid">
                  <Chart>
                    <ChartContainer>
                      <ChartTooltip>
                        <ChartTooltipContent />
                      </ChartTooltip>
                      <ChartLegend>
                        <ChartLegendItem name="Happy" color="#FFD500" />
                        <ChartLegendItem name="Neutral" color="#1C3F95" />
                        <ChartLegendItem name="Frustrated" color="#E41E26" />
                      </ChartLegend>
                      <ChartGrid />
                      <ChartXAxis />
                      <ChartYAxis />
                      <ChartArea data={[15, 20, 25, 35, 30, 40, 45]} name="Happy" color="#FFD500" />
                      <ChartArea data={[25, 20, 15, 10, 15, 10, 5]} name="Neutral" color="#1C3F95" />
                      <ChartArea data={[10, 5, 8, 5, 10, 5, 3]} name="Frustrated" color="#E41E26" />
                    </ChartContainer>
                  </Chart>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-black">
                <CardHeader>
                  <CardTitle className="uppercase tracking-wide">Emotion Distribution</CardTitle>
                  <CardDescription className="uppercase text-xs tracking-wide">
                    Overall sentiment breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="h-[250px] w-[250px]">
                    <div className="relative h-full w-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold">68%</div>
                          <div className="text-sm text-muted-foreground uppercase tracking-wide">Positive</div>
                        </div>
                      </div>
                      <svg viewBox="0 0 100 100" className="h-full w-full rotate-[-90deg]">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="20"
                          fill="none"
                          className="text-muted stroke-[10]"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#FFD500"
                          strokeWidth="20"
                          fill="none"
                          strokeDasharray="251.2"
                          strokeDashoffset="80.4"
                          className="stroke-[10]"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-black">
                <CardHeader>
                  <CardTitle className="uppercase tracking-wide">Mood Trends by Project</CardTitle>
                  <CardDescription className="uppercase text-xs tracking-wide">
                    Emotional patterns across projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Summer Vibes EP", happy: 75, neutral: 20, frustrated: 5 },
                      { name: "Acoustic Sessions", happy: 60, neutral: 30, frustrated: 10 },
                      { name: "Jazz Ensemble", happy: 80, neutral: 15, frustrated: 5 },
                      { name: "Rock Anthems", happy: 50, neutral: 30, frustrated: 20 },
                    ].map((project) => (
                      <div key={project.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium uppercase tracking-wide">{project.name}</span>
                          <span className="text-sm text-muted-foreground uppercase tracking-wide">
                            {project.happy}% positive
                          </span>
                        </div>
                        <div className="flex h-2 w-full overflow-hidden">
                          <div className="bg-[#FFD500]" style={{ width: `${project.happy}%` }} />
                          <div className="bg-[#1C3F95]" style={{ width: `${project.neutral}%` }} />
                          <div className="bg-[#E41E26]" style={{ width: `${project.frustrated}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="conflicts" className="space-y-6">
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle className="uppercase tracking-wide">Conflict Resolution</CardTitle>
                <CardDescription className="uppercase text-xs tracking-wide">
                  Tracking and resolving feedback conflicts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bauhaus-grid">
                  <Chart>
                    <ChartContainer>
                      <ChartTooltip>
                        <ChartTooltipContent />
                      </ChartTooltip>
                      <ChartLegend>
                        <ChartLegendItem name="Conflicts Identified" color="#E41E26" />
                        <ChartLegendItem name="Conflicts Resolved" color="#1C3F95" />
                      </ChartLegend>
                      <ChartGrid />
                      <ChartXAxis />
                      <ChartYAxis />
                      <ChartBar data={[8, 12, 10, 15, 9, 14, 7]} name="Conflicts Identified" color="#E41E26" />
                      <ChartBar data={[6, 10, 8, 12, 7, 10, 5]} name="Conflicts Resolved" color="#1C3F95" />
                    </ChartContainer>
                  </Chart>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-black">
                <CardHeader>
                  <CardTitle className="uppercase tracking-wide">Resolution Time</CardTitle>
                  <CardDescription className="uppercase text-xs tracking-wide">
                    Average time to resolve conflicts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] bauhaus-grid">
                    <Chart>
                      <ChartContainer>
                        <ChartTooltip>
                          <ChartTooltipContent />
                        </ChartTooltip>
                        <ChartGrid />
                        <ChartXAxis />
                        <ChartYAxis />
                        <ChartLine data={[48, 36, 24, 36, 24, 12, 18]} name="Hours" color="#1C3F95" />
                      </ChartContainer>
                    </Chart>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-black">
                <CardHeader>
                  <CardTitle className="uppercase tracking-wide">Conflict Types</CardTitle>
                  <CardDescription className="uppercase text-xs tracking-wide">
                    Categories of identified conflicts
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="h-[250px] w-[250px]">
                    <div className="relative h-full w-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground uppercase tracking-wide">Conflict</div>
                          <div className="text-2xl font-bold uppercase tracking-wide">Types</div>
                        </div>
                      </div>
                      <svg viewBox="0 0 100 100" className="h-full w-full rotate-[-90deg]">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#E41E26"
                          strokeWidth="20"
                          fill="none"
                          strokeDasharray="251.2"
                          strokeDashoffset="188.4"
                          className="stroke-[10]"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#1C3F95"
                          strokeWidth="20"
                          fill="none"
                          strokeDasharray="251.2"
                          strokeDashoffset="188.4"
                          className="stroke-[10]"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#FFD500"
                          strokeWidth="20"
                          fill="none"
                          strokeDasharray="251.2"
                          strokeDashoffset="62.8"
                          className="stroke-[10]"
                          strokeDashoffset="125.6"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-black">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="uppercase tracking-wide">Recent Reports</CardTitle>
                  <CardDescription className="uppercase text-xs tracking-wide">
                    Generated conflict reports
                  </CardDescription>
                </div>
                <Button variant="outline" className="gap-2 border-2 border-black uppercase text-xs tracking-wide">
                  <ArrowDownToLine className="h-4 w-4" />
                  Download All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Summer Vibes EP - Vocal Processing Conflict",
                      date: "2 days ago",
                      status: "Resolved",
                      participants: 3,
                    },
                    {
                      name: "Acoustic Sessions - Arrangement Dispute",
                      date: "1 week ago",
                      status: "Resolved",
                      participants: 2,
                    },
                    {
                      name: "Rock Anthems - Mixing Preferences",
                      date: "2 weeks ago",
                      status: "Pending",
                      participants: 4,
                    },
                  ].map((report, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-black pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <div className="font-medium uppercase tracking-wide">{report.name}</div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="uppercase text-xs tracking-wide">{report.date}</span>
                          <span>•</span>
                          <span className="uppercase text-xs tracking-wide">{report.participants} participants</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={report.status === "Resolved" ? "outline" : "destructive"}
                          className={cn(
                            "uppercase text-xs tracking-wide rounded-none",
                            report.status === "Pending" && "bg-[#E41E26]",
                          )}
                        >
                          {report.status}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
