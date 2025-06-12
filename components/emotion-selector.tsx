"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EMOTIONS, Emotion } from "@/lib/constants/emotions"

const emotions = EMOTIONS

interface EmotionSelectorProps {
  onSelect?: (emotion: Emotion) => void
  selectedEmotion?: string | null
  compact?: boolean
}

export function EmotionSelector({ onSelect, selectedEmotion = null, compact = false }: EmotionSelectorProps) {
  const [selected, setSelected] = useState<Emotion | null>(
    selectedEmotion ? emotions.find((e) => e.name === selectedEmotion) || null : null,
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const handleSelect = (emotion: Emotion) => {
    setSelected(emotion)
    if (onSelect) {
      onSelect(emotion)
    }
    setIsDialogOpen(false)
  }

  const filteredEmotions = activeTab === "all" ? emotions : emotions.filter((emotion) => emotion.category === activeTab)

  // Display a compact version with just the selected emotion and a button to change
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {selected ? (
          <div
            className={cn(
              "flex items-center gap-2 p-2 border-2 rounded-none",
              `border-${selected.color.split("-")[1]}`,
            )}
          >
            <span className="text-xl">{selected.emoji}</span>
            <span className="uppercase text-xs tracking-wide font-medium">{selected.name}</span>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground uppercase tracking-wide">No emotion selected</div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="border-2 border-black uppercase text-xs tracking-wide">
              {selected ? "Change" : "Select Emotion"}
            </Button>
          </DialogTrigger>
          <DialogContent className="border-2 border-black rounded-none p-0 sm:max-w-[500px]">
            <DialogHeader className="p-4 pb-2 border-b-2 border-black">
              <DialogTitle className="uppercase tracking-wide text-base">Select Your Emotion</DialogTitle>
            </DialogHeader>

            <div className="p-4">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 border-2 border-black p-0 h-auto mb-4">
                  <TabsTrigger
                    value="all"
                    className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="positive"
                    className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-[#FFD500] data-[state=active]:text-black"
                  >
                    Positive
                  </TabsTrigger>
                  <TabsTrigger
                    value="negative"
                    className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-[#E41E26] data-[state=active]:text-white"
                  >
                    Negative
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {filteredEmotions.map((emotion) => (
                      <Button
                        key={emotion.name}
                        variant="outline"
                        className={cn(
                          "flex flex-col items-center gap-1 h-auto py-3 px-2 border-2 transition-all",
                          selected?.name === emotion.name ? "border-black" : "border-transparent",
                          selected?.name === emotion.name && emotion.bgColor,
                        )}
                        onClick={() => handleSelect(emotion)}
                      >
                        <span className="text-2xl">{emotion.emoji}</span>
                        <span className="text-xs uppercase tracking-wide">{emotion.name}</span>
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter className="p-4 border-t-2 border-black">
              <DialogClose asChild>
                <Button variant="outline" className="border-2 border-black uppercase text-xs tracking-wide">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Full version with grid of emotions
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {emotions.slice(0, 9).map((emotion) => (
          <Button
            key={emotion.name}
            variant="outline"
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-3 px-2 border-2 transition-all",
              selected?.name === emotion.name ? "border-black" : "border-transparent",
              selected?.name === emotion.name && emotion.bgColor,
            )}
            onClick={() => handleSelect(emotion)}
          >
            <span className="text-2xl">{emotion.emoji}</span>
            <span className="text-xs uppercase tracking-wide">{emotion.name}</span>
          </Button>
        ))}

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-1 h-auto py-3 px-2 border-2 border-dashed border-black"
            >
              <span className="text-2xl">+</span>
              <span className="text-xs uppercase tracking-wide">MORE</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="border-2 border-black rounded-none p-0 sm:max-w-[500px]">
            <DialogHeader className="p-4 pb-2 border-b-2 border-black">
              <DialogTitle className="uppercase tracking-wide text-base">All Emotions</DialogTitle>
            </DialogHeader>

            <div className="p-4">
              <Tabs defaultValue="all">
                <TabsList className="grid grid-cols-4 border-2 border-black p-0 h-auto mb-4">
                  <TabsTrigger
                    value="all"
                    className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="positive"
                    className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-[#FFD500] data-[state=active]:text-black"
                  >
                    Positive
                  </TabsTrigger>
                  <TabsTrigger
                    value="neutral"
                    className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-[#1C3F95] data-[state=active]:text-white"
                  >
                    Neutral
                  </TabsTrigger>
                  <TabsTrigger
                    value="negative"
                    className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-[#E41E26] data-[state=active]:text-white"
                  >
                    Negative
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {emotions.map((emotion) => (
                      <Button
                        key={emotion.name}
                        variant="outline"
                        className={cn(
                          "flex flex-col items-center gap-1 h-auto py-3 px-2 border-2 transition-all",
                          selected?.name === emotion.name ? "border-black" : "border-transparent",
                          selected?.name === emotion.name && emotion.bgColor,
                        )}
                        onClick={() => handleSelect(emotion)}
                      >
                        <span className="text-2xl">{emotion.emoji}</span>
                        <span className="text-xs uppercase tracking-wide">{emotion.name}</span>
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="positive">
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {emotions
                      .filter((emotion) => emotion.category === "positive")
                      .map((emotion) => (
                        <Button
                          key={emotion.name}
                          variant="outline"
                          className={cn(
                            "flex flex-col items-center gap-1 h-auto py-3 px-2 border-2 transition-all",
                            selected?.name === emotion.name ? "border-black" : "border-transparent",
                            selected?.name === emotion.name && emotion.bgColor,
                          )}
                          onClick={() => handleSelect(emotion)}
                        >
                          <span className="text-2xl">{emotion.emoji}</span>
                          <span className="text-xs uppercase tracking-wide">{emotion.name}</span>
                        </Button>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="neutral">
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {emotions
                      .filter((emotion) => emotion.category === "neutral")
                      .map((emotion) => (
                        <Button
                          key={emotion.name}
                          variant="outline"
                          className={cn(
                            "flex flex-col items-center gap-1 h-auto py-3 px-2 border-2 transition-all",
                            selected?.name === emotion.name ? "border-black" : "border-transparent",
                            selected?.name === emotion.name && emotion.bgColor,
                          )}
                          onClick={() => handleSelect(emotion)}
                        >
                          <span className="text-2xl">{emotion.emoji}</span>
                          <span className="text-xs uppercase tracking-wide">{emotion.name}</span>
                        </Button>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="negative">
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {emotions
                      .filter((emotion) => emotion.category === "negative")
                      .map((emotion) => (
                        <Button
                          key={emotion.name}
                          variant="outline"
                          className={cn(
                            "flex flex-col items-center gap-1 h-auto py-3 px-2 border-2 transition-all",
                            selected?.name === emotion.name ? "border-black" : "border-transparent",
                            selected?.name === emotion.name && emotion.bgColor,
                          )}
                          onClick={() => handleSelect(emotion)}
                        >
                          <span className="text-2xl">{emotion.emoji}</span>
                          <span className="text-xs uppercase tracking-wide">{emotion.name}</span>
                        </Button>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {selected && (
        <div className="flex items-center gap-2 p-4 border-2 border-black">
          <div className={cn("h-4 w-4", selected.color)}></div>
          <p className="text-sm uppercase tracking-wide">
            You're feeling <span className="font-bold">{selected.name.toLowerCase()}</span> today
          </p>
        </div>
      )}
    </div>
  )
}
