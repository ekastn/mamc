"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Save } from "lucide-react"

export default function SettingsPage() {
  const [theme, setTheme] = useState("system")
  const [audioQuality, setAudioQuality] = useState("high")
  const [autoSave, setAutoSave] = useState(true)
  const [showTimecodes, setShowTimecodes] = useState(true)
  const [defaultZoomLevel, setDefaultZoomLevel] = useState([50])
  const [defaultVolume, setDefaultVolume] = useState([80])
  const [autoPause, setAutoPause] = useState(true)
  const [showCommentMarkers, setShowCommentMarkers] = useState(true)
  const [showEmotionIndicators, setShowEmotionIndicators] = useState(true)
  const [autoPlayOnSeek, setAutoPlayOnSeek] = useState(false)
  const [cacheAudio, setCacheAudio] = useState(true)
  const [storageLimit, setStorageLimit] = useState("5GB")
  const [backupFrequency, setBackupFrequency] = useState("daily")
  const [backupLocation, setBackupLocation] = useState("/backups")
  const [maxVersions, setMaxVersions] = useState("10")
  const [autoDeleteOldVersions, setAutoDeleteOldVersions] = useState(true)

  const handleSaveSettings = () => {
    alert("Settings saved successfully!")
  }

  return (
    <div className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Settings</h1>
            <p className="text-muted-foreground uppercase text-xs tracking-wide">
              Configure your application preferences
            </p>
          </div>
          <Button
            className="gap-2 bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide"
            onClick={handleSaveSettings}
          >
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>

        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid grid-cols-4 border-2 border-black p-0 h-auto">
            <TabsTrigger
              value="appearance"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="audio"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Audio
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Timeline
            </TabsTrigger>
            <TabsTrigger
              value="storage"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Storage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="border-2 border-black">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg uppercase tracking-wide">Appearance Settings</CardTitle>
                <CardDescription className="uppercase text-xs tracking-wide">
                  Customize how the application looks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm uppercase tracking-wide">Theme</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        className={`uppercase text-xs tracking-wide ${theme === "light" ? "bg-black text-white" : "border-2 border-black"}`}
                        onClick={() => setTheme("light")}
                      >
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        className={`uppercase text-xs tracking-wide ${theme === "dark" ? "bg-black text-white" : "border-2 border-black"}`}
                        onClick={() => setTheme("dark")}
                      >
                        Dark
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        className={`uppercase text-xs tracking-wide ${theme === "system" ? "bg-black text-white" : "border-2 border-black"}`}
                        onClick={() => setTheme("system")}
                      >
                        System
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-black" />

                  <div className="space-y-2">
                    <Label className="text-sm uppercase tracking-wide">Color Scheme</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="border-2 border-black p-2 flex items-center justify-center cursor-pointer">
                        <div className="flex h-8 w-8">
                          <div className="h-8 w-8/3 bg-[#E41E26]"></div>
                          <div className="h-8 w-8/3 bg-[#1C3F95]"></div>
                          <div className="h-8 w-8/3 bg-[#FFD500]"></div>
                        </div>
                      </div>
                      <div className="border-2 border-black p-2 flex items-center justify-center cursor-pointer">
                        <div className="flex h-8 w-8">
                          <div className="h-8 w-8/3 bg-[#000000]"></div>
                          <div className="h-8 w-8/3 bg-[#666666]"></div>
                          <div className="h-8 w-8/3 bg-[#CCCCCC]"></div>
                        </div>
                      </div>
                      <div className="border-2 border-black p-2 flex items-center justify-center cursor-pointer">
                        <div className="flex h-8 w-8">
                          <div className="h-8 w-8/3 bg-[#2D9CDB]"></div>
                          <div className="h-8 w-8/3 bg-[#27AE60]"></div>
                          <div className="h-8 w-8/3 bg-[#BB6BD9]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-black" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm uppercase tracking-wide">Auto-Save</Label>
                      <p className="text-xs text-muted-foreground">Automatically save changes as you work</p>
                    </div>
                    <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audio" className="space-y-6">
            <Card className="border-2 border-black">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg uppercase tracking-wide">Audio Settings</CardTitle>
                <CardDescription className="uppercase text-xs tracking-wide">
                  Configure audio playback and recording preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm uppercase tracking-wide">Audio Quality</Label>
                    <Select value={audioQuality} onValueChange={setAudioQuality}>
                      <SelectTrigger className="border-2 border-black rounded-none uppercase text-xs tracking-wide">
                        <SelectValue placeholder="Select audio quality" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-black rounded-none">
                        <SelectItem value="low" className="uppercase text-xs tracking-wide">
                          Low (128kbps)
                        </SelectItem>
                        <SelectItem value="medium" className="uppercase text-xs tracking-wide">
                          Medium (256kbps)
                        </SelectItem>
                        <SelectItem value="high" className="uppercase text-xs tracking-wide">
                          High (320kbps)
                        </SelectItem>
                        <SelectItem value="lossless" className="uppercase text-xs tracking-wide">
                          Lossless
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-black" />

                  <div className="space-y-2">
                    <Label className="text-sm uppercase tracking-wide">Default Volume ({defaultVolume}%)</Label>
                    <Slider value={defaultVolume} max={100} step={1} onValueChange={setDefaultVolume} />
                  </div>

                  <Separator className="bg-black" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm uppercase tracking-wide">Auto-Pause</Label>
                      <p className="text-xs text-muted-foreground">Automatically pause when switching tabs</p>
                    </div>
                    <Switch checked={autoPause} onCheckedChange={setAutoPause} />
                  </div>

                  <Separator className="bg-black" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm uppercase tracking-wide">Auto-Play on Seek</Label>
                      <p className="text-xs text-muted-foreground">Automatically play audio after seeking</p>
                    </div>
                    <Switch checked={autoPlayOnSeek} onCheckedChange={setAutoPlayOnSeek} />
                  </div>

                  <Separator className="bg-black" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm uppercase tracking-wide">Cache Audio</Label>
                      <p className="text-xs text-muted-foreground">Cache audio files for faster playback</p>
                    </div>
                    <Switch checked={cacheAudio} onCheckedChange={setCacheAudio} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card className="border-2 border-black">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg uppercase tracking-wide">Timeline Settings</CardTitle>
                <CardDescription className="uppercase text-xs tracking-wide">
                  Configure timeline and waveform display preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm uppercase tracking-wide">Show Timecodes</Label>
                      <p className="text-xs text-muted-foreground">Display timecodes on the timeline</p>
                    </div>
                    <Switch checked={showTimecodes} onCheckedChange={setShowTimecodes} />
                  </div>

                  <Separator className="bg-black" />

                  <div className="space-y-2">
                    <Label className="text-sm uppercase tracking-wide">Default Zoom Level</Label>
                    <Slider value={defaultZoomLevel} max={100} step={1} onValueChange={setDefaultZoomLevel} />
                  </div>

                  <Separator className="bg-black" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm uppercase tracking-wide">Show Comment Markers</Label>
                      <p className="text-xs text-muted-foreground">Display comment markers on the timeline</p>
                    </div>
                    <Switch checked={showCommentMarkers} onCheckedChange={setShowCommentMarkers} />
                  </div>

                  <Separator className="bg-black" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm uppercase tracking-wide">Show Emotion Indicators</Label>
                      <p className="text-xs text-muted-foreground">Display emotion indicators on comments</p>
                    </div>
                    <Switch checked={showEmotionIndicators} onCheckedChange={setShowEmotionIndicators} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage" className="space-y-6">
            <Card className="border-2 border-black">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg uppercase tracking-wide">Storage Settings</CardTitle>
                <CardDescription className="uppercase text-xs tracking-wide">
                  Configure storage and backup preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm uppercase tracking-wide">Storage Limit</Label>
                    <Select value={storageLimit} onValueChange={setStorageLimit}>
                      <SelectTrigger className="border-2 border-black rounded-none uppercase text-xs tracking-wide">
                        <SelectValue placeholder="Select storage limit" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-black rounded-none">
                        <SelectItem value="1GB" className="uppercase text-xs tracking-wide">
                          1GB
                        </SelectItem>
                        <SelectItem value="5GB" className="uppercase text-xs tracking-wide">
                          5GB
                        </SelectItem>
                        <SelectItem value="10GB" className="uppercase text-xs tracking-wide">
                          10GB
                        </SelectItem>
                        <SelectItem value="Unlimited" className="uppercase text-xs tracking-wide">
                          Unlimited
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-black" />

                  <div className="space-y-2">
                    <Label className="text-sm uppercase tracking-wide">Backup Frequency</Label>
                    <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                      <SelectTrigger className="border-2 border-black rounded-none uppercase text-xs tracking-wide">
                        <SelectValue placeholder="Select backup frequency" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-black rounded-none">
                        <SelectItem value="hourly" className="uppercase text-xs tracking-wide">
                          Hourly
                        </SelectItem>
                        <SelectItem value="daily" className="uppercase text-xs tracking-wide">
                          Daily
                        </SelectItem>
                        <SelectItem value="weekly" className="uppercase text-xs tracking-wide">
                          Weekly
                        </SelectItem>
                        <SelectItem value="never" className="uppercase text-xs tracking-wide">
                          Never
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-black" />

                  <div className="space-y-2">
                    <Label className="text-sm uppercase tracking-wide">Backup Location</Label>
                    <Input
                      value={backupLocation}
                      onChange={(e) => setBackupLocation(e.target.value)}
                      className="border-2 border-black rounded-none"
                    />
                  </div>

                  <Separator className="bg-black" />

                  <div className="space-y-2">
                    <Label className="text-sm uppercase tracking-wide">Maximum Versions to Keep</Label>
                    <Input
                      type="number"
                      value={maxVersions}
                      onChange={(e) => setMaxVersions(e.target.value)}
                      className="border-2 border-black rounded-none"
                    />
                  </div>

                  <Separator className="bg-black" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm uppercase tracking-wide">Auto-Delete Old Versions</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically delete old versions when limit is reached
                      </p>
                    </div>
                    <Switch checked={autoDeleteOldVersions} onCheckedChange={setAutoDeleteOldVersions} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
