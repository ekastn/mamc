"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn, getMoodColor } from "@/lib/utils"
import { COLOR_CLASSES } from "@/lib/constants/theme"

// Mock data for mood trends
const weeklyMoodData = [
  { label: "M", value: 0.6, mood: "happy" },
  { label: "T", value: 0.8, mood: "happy" },
  { label: "W", value: 0.4, mood: "neutral" },
  { label: "T", value: 0.3, mood: "sad" },
  { label: "F", value: 0.5, mood: "neutral" },
  { label: "S", value: 0.9, mood: "happy" },
  { label: "S", value: 0.7, mood: "happy" },
]

const monthlyMoodData = [
  { label: "W1", value: 0.7, mood: "happy" },
  { label: "W2", value: 0.5, mood: "neutral" },
  { label: "W3", value: 0.3, mood: "sad" },
  { label: "W4", value: 0.8, mood: "happy" },
]

const projectMoodData = [
  { name: "Summer Vibes EP", happy: 75, neutral: 20, frustrated: 5 },
  { name: "Acoustic Sessions", happy: 60, neutral: 30, frustrated: 10 },
  { name: "Jazz Ensemble", happy: 80, neutral: 15, frustrated: 5 },
  { name: "Rock Anthems", happy: 50, neutral: 30, frustrated: 20 },
]

// Emotion distribution data
const emotionDistribution = [
  { emotion: "HAPPY", percentage: 45, color: COLOR_CLASSES.BG.YELLOW },
  { emotion: "NEUTRAL", percentage: 30, color: COLOR_CLASSES.BG.BLUE },
  { emotion: "FRUSTRATED", percentage: 15, color: COLOR_CLASSES.BG.RED },
  { emotion: "SAD", percentage: 10, color: COLOR_CLASSES.BG.BLACK },
]

export function MoodTrends() {
  const [timeframe, setTimeframe] = useState("week")
        return "bg-[#E41E26]"
      default:
        return "bg-black"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold uppercase tracking-wide">Mood & Emotion Trends</h2>
        <Select defaultValue={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px] border-2 border-black rounded-none uppercase text-xs tracking-wide">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent className="border-2 border-black rounded-none">
            <SelectItem value="week" className="uppercase text-xs tracking-wide">
              Last 7 days
            </SelectItem>
            <SelectItem value="month" className="uppercase text-xs tracking-wide">
              Last 30 days
            </SelectItem>
            <SelectItem value="project" className="uppercase text-xs tracking-wide">
              By Project
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-black overflow-hidden">
          <div className="h-2 w-full bg-[#1C3F95]"></div>
          <CardHeader>
            <CardTitle className="uppercase tracking-wide">
              {timeframe === "week"
                ? "Weekly Mood Trends"
                : timeframe === "month"
                  ? "Monthly Mood Trends"
                  : "Project Mood Distribution"}
            </CardTitle>
            <CardDescription className="uppercase text-xs tracking-wide">
              {timeframe === "week"
                ? "Your daily emotional patterns"
                : timeframe === "month"
                  ? "Your weekly emotional patterns"
                  : "Emotional patterns across projects"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {timeframe === "project" ? (
              <div className="space-y-4">
                {projectMoodData.map((project) => (
                  <div key={project.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium uppercase tracking-wide">{project.name}</span>
                      <span className="text-sm text-muted-foreground uppercase tracking-wide">
                        {project.happy}% positive
                      </span>
                    </div>
                    <div className="flex h-4 w-full overflow-hidden">
                      <div className="bg-[#FFD500]" style={{ width: `${project.happy}%` }} />
                      <div className="bg-[#1C3F95]" style={{ width: `${project.neutral}%` }} />
                      <div className="bg-[#E41E26]" style={{ width: `${project.frustrated}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex items-end gap-1">
                {(timeframe === "week" ? weeklyMoodData : monthlyMoodData).map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={cn("w-full", getMoodColor(day.mood))}
                      style={{ height: `${day.value * 100}%` }}
                    ></div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">{day.label}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-black overflow-hidden">
          <div className="h-2 w-full bg-[#FFD500]"></div>
          <CardHeader>
            <CardTitle className="uppercase tracking-wide">Emotion Distribution</CardTitle>
            <CardDescription className="uppercase text-xs tracking-wide">Overall sentiment breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center">
                <div className="h-[150px] w-[150px] relative">
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    {emotionDistribution.map((item, index) => {
                      // Calculate the start angle for this segment
                      const previousTotal = emotionDistribution
                        .slice(0, index)
                        .reduce((sum, curr) => sum + curr.percentage, 0)

                      const startAngle = (previousTotal / 100) * 360
                      const endAngle = ((previousTotal + item.percentage) / 100) * 360

                      // Convert angles to radians
                      const startRad = (startAngle - 90) * (Math.PI / 180)
                      const endRad = (endAngle - 90) * (Math.PI / 180)

                      // Calculate the SVG arc path
                      const x1 = 50 + 40 * Math.cos(startRad)
                      const y1 = 50 + 40 * Math.sin(startRad)
                      const x2 = 50 + 40 * Math.cos(endRad)
                      const y2 = 50 + 40 * Math.sin(endRad)

                      // Determine if the arc should be drawn as a large arc
                      const largeArcFlag = item.percentage > 50 ? 1 : 0

                      return (
                        <path
                          key={item.emotion}
                          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          className={item.color}
                        />
                      )
                    })}
                    <circle cx="50" cy="50" r="25" fill="white" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm uppercase tracking-wide">Emotion</div>
                      <div className="text-lg font-bold">Distribution</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {emotionDistribution.map((item) => (
                  <div key={item.emotion} className="flex items-center gap-2">
                    <div className={cn("h-4 w-4", item.color)}></div>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs uppercase tracking-wide">{item.emotion}</span>
                      <span className="text-xs font-medium">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-black overflow-hidden">
        <div className="h-2 w-full bg-[#E41E26]"></div>
        <CardHeader>
          <CardTitle className="uppercase tracking-wide">Emotion Timeline</CardTitle>
          <CardDescription className="uppercase text-xs tracking-wide">
            How your emotions change throughout the day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[100px] relative bauhaus-grid">
            {/* Time markers */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground uppercase tracking-wide">
              <span>9AM</span>
              <span>12PM</span>
              <span>3PM</span>
              <span>6PM</span>
              <span>9PM</span>
            </div>

            {/* Emotion markers */}
            <div className="absolute top-0 left-[10%] flex flex-col items-center">
              <div className="h-4 w-4 bg-[#FFD500]"></div>
              <div className="h-[60px] w-px bg-[#FFD500] opacity-50"></div>
            </div>
            <div className="absolute top-0 left-[30%] flex flex-col items-center">
              <div className="h-4 w-4 bg-[#1C3F95]"></div>
              <div className="h-[60px] w-px bg-[#1C3F95] opacity-50"></div>
            </div>
            <div className="absolute top-0 left-[45%] flex flex-col items-center">
              <div className="h-4 w-4 bg-[#E41E26]"></div>
              <div className="h-[60px] w-px bg-[#E41E26] opacity-50"></div>
            </div>
            <div className="absolute top-0 left-[70%] flex flex-col items-center">
              <div className="h-4 w-4 bg-[#FFD500]"></div>
              <div className="h-[60px] w-px bg-[#FFD500] opacity-50"></div>
            </div>
            <div className="absolute top-0 left-[85%] flex flex-col items-center">
              <div className="h-4 w-4 bg-black"></div>
              <div className="h-[60px] w-px bg-black opacity-50"></div>
            </div>

            {/* Emotion line */}
            <svg className="absolute top-0 left-0 w-full h-[60px]" viewBox="0 0 100 60" preserveAspectRatio="none">
              <path
                d="M0,30 C10,10 20,40 30,30 C40,20 45,50 55,40 C65,30 70,10 85,20 C95,30 100,25 100,30"
                fill="none"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="gap-2 bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide">
          View Detailed Emotion Analytics
        </Button>
      </div>
    </div>
  )
}
