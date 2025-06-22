"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import { projectService } from "@/lib/services/client/project-service"
import { useAuth } from "@/lib/context/auth-context"
import { SAMPLE_USERS } from "@/lib/constants"

export default function NewProjectPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    color: "bg-[#E41E26]",
  })
  const [newTag, setNewTag] = useState("")

  const colorOptions = [
    { name: "Red", value: "bg-[#E41E26]" },
    { name: "Blue", value: "bg-[#1C3F95]" },
    { name: "Yellow", value: "bg-[#FFD500]" },
    { name: "Black", value: "bg-black" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setIsLoading(true)

    try {
      const currentUser = user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar || "/placeholder.svg",
            role: "owner" as const,
            mood: "happy" as const,
          }
        : SAMPLE_USERS[0]

      const newProject = projectService.createProject({
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        color: formData.color,
        collaborators: [currentUser],
        tracks: [],
        lastUpdated: new Date().toISOString().split("T")[0],
        version: "v1.0",
      })

      router.push(`/projects/${newProject.id}`)
    } catch (error) {
      console.error("Failed to create project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="border-2 border-black">
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-wide">New Project</h1>
            <p className="text-muted-foreground uppercase text-sm tracking-wide">
              Create a new music collaboration project
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="border-2 border-black">
          <CardHeader>
            <CardTitle className="text-xl uppercase tracking-wide">Project Details</CardTitle>
            <CardDescription className="text-xs uppercase tracking-wide">
              Fill in the information below to create your project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs uppercase tracking-wide font-bold">
                  Project Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title"
                  className="border-2 border-black"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs uppercase tracking-wide font-bold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project"
                  className="border-2 border-black"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide font-bold">Project Color</Label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                      className={`w-8 h-8 ${color.value} border-2 ${
                        formData.color === color.value ? "border-black" : "border-gray-300"
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide font-bold">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="border-2 border-black"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline" className="border-2 border-black">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-2 border-black uppercase text-xs tracking-wide gap-1"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="flex-1 border-2 border-black uppercase text-xs tracking-wide"
                >
                  <Link href="/projects">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.title.trim() || isLoading}
                  className="flex-1 bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide"
                >
                  {isLoading ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
