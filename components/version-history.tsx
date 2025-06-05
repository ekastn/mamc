"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, Download, GitBranch, MoreHorizontal, RotateCcw, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { SAMPLE_VERSIONS } from "@/lib/constants"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function VersionHistory() {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const versions = SAMPLE_VERSIONS

  const getVersionTypeColor = (type: string) => {
    switch (type) {
      case "upload":
        return "bg-[#1C3F95]"
      case "edit":
        return "bg-[#E41E26]"
      case "milestone":
        return "bg-[#FFD500]"
      default:
        return "bg-black"
    }
  }

  const getVersionTypeIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <Upload className="h-3 w-3" />
      case "edit":
        return <GitBranch className="h-3 w-3" />
      case "milestone":
        return <CheckCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold uppercase tracking-wide">Version History</h2>
        <Button className="gap-2 bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide">
          <CheckCircle className="h-4 w-4" />
          Create Checkpoint
        </Button>
      </div>

      <div className="space-y-4">
        {versions.map((version, index) => (
          <Card
            key={version.id}
            className={cn(
              "border-2 transition-all cursor-pointer",
              version.isCurrent ? "border-black bg-muted/50" : "border-gray-300 hover:border-black",
              selectedVersion === version.id && "ring-2 ring-black ring-offset-2",
            )}
            onClick={() => setSelectedVersion(selectedVersion === version.id ? null : version.id)}
          >
            <div className={cn("h-2 w-full", getVersionTypeColor(version.type))}></div>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 rounded-none">
                    <AvatarImage src={version.user.avatar || "/placeholder.svg"} alt={version.user.name} />
                    <AvatarFallback className="rounded-none bg-[#1C3F95] text-white">
                      {version.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base uppercase tracking-wide">{version.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1 border-2 uppercase text-xs tracking-wide rounded-none",
                          `border-${getVersionTypeColor(version.type).split("-")[1]}`,
                        )}
                      >
                        {getVersionTypeIcon(version.type)}
                        {version.type}
                      </Badge>
                      {version.isCurrent && (
                        <Badge className="bg-black text-white uppercase text-xs tracking-wide rounded-none">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium uppercase tracking-wide">{version.user.name}</span>
                      <span className="text-sm text-muted-foreground uppercase tracking-wide">{version.timestamp}</span>
                      <span className="text-sm text-muted-foreground uppercase tracking-wide">
                        Version {version.id}
                      </span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-2 border-black rounded-none">
                    {!version.isCurrent && (
                      <>
                        <DropdownMenuItem className="gap-2 uppercase text-xs tracking-wide">
                          <RotateCcw className="h-4 w-4" />
                          Restore Version
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem className="gap-2 uppercase text-xs tracking-wide">
                      <Download className="h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 uppercase text-xs tracking-wide">
                      <GitBranch className="h-4 w-4" />
                      Create Branch
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium uppercase tracking-wide mb-2">Changes Made:</h4>
                  <ul className="space-y-1">
                    {version.changes.map((change, changeIndex) => (
                      <li key={changeIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-black">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {version.files && version.files.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium uppercase tracking-wide mb-2">Files Added:</h4>
                      <div className="flex flex-wrap gap-2">
                        {version.files.map((file, fileIndex) => (
                          <Badge
                            key={fileIndex}
                            variant="outline"
                            className="border-2 border-black uppercase text-xs tracking-wide rounded-none"
                          >
                            {file}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {selectedVersion === version.id && (
                  <>
                    <Separator />
                    <div className="flex gap-2">
                      {!version.isCurrent && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 border-2 border-black uppercase text-xs tracking-wide"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Restore This Version
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 border-2 border-black uppercase text-xs tracking-wide"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 border-2 border-black uppercase text-xs tracking-wide"
                      >
                        <GitBranch className="h-4 w-4" />
                        Compare
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {versions.map(
        (version, index) =>
          index < versions.length - 1 && (
            <div className="flex justify-center">
              <div className="w-px h-4 bg-border"></div>
            </div>
          ),
      )}
    </div>
  )
}
