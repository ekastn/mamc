"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mood = {
    name: string;
    emoji: string;
    color: string;
};

const moods: Mood[] = [
    { name: "Happy", emoji: "■", color: "bg-[#FFD500]" },
    { name: "Excited", emoji: "■", color: "bg-[#FFD500]" },
    { name: "Calm", emoji: "■", color: "bg-[#1C3F95] text-white" },
    { name: "Neutral", emoji: "■", color: "bg-black text-white" },
    { name: "Tired", emoji: "■", color: "bg-[#1C3F95] text-white" },
    { name: "Sad", emoji: "■", color: "bg-[#1C3F95] text-white" },
    { name: "Frustrated", emoji: "■", color: "bg-[#E41E26] text-white" },
];

export function MoodSelector() {
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {moods.map((mood) => (
                    <Button
                        key={mood.name}
                        variant="outline"
                        className={cn(
                            "flex flex-col items-center gap-1 h-auto py-3 px-2 border-2 border-black transition-all",
                            selectedMood?.name === mood.name ? "ring-2 ring-black" : "",
                            mood.color
                        )}
                        onClick={() => setSelectedMood(mood)}
                    >
                        <span className="text-xs uppercase tracking-wide">{mood.name}</span>
                    </Button>
                ))}
            </div>

            {selectedMood && (
                <div className="flex items-center gap-2 p-4 border-2 border-black">
                    <div className={cn("h-4 w-4", selectedMood.color)}></div>
                    <p className="text-sm uppercase tracking-wide">
                        You're feeling{" "}
                        <span className="font-bold">{selectedMood.name.toLowerCase()}</span> today
                    </p>
                </div>
            )}
        </div>
    );
}
