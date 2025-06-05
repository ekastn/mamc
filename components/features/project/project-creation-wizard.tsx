"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Check, Plus, X } from "lucide-react"
import { projectCreationService } from "@/services/project/project-creation-service"
import type { ProjectTemplate, ProjectCreationData } from "@/lib/types/project"
import { cn } from "@/lib/utils"

interface ProjectCreationWizardProps {
  onComplete?: (projectId: string) => void
  onCancel?: () => void
}

type WizardStep = "template" | "details" | "settings" | "review"

export function ProjectCreationWizard({ onComplete, onCancel }: ProjectCreationWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<WizardStep>("template")
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)
  const [projectData, setProjectData] = useState<ProjectCreationData>({
    title: "",
    description: "",
    tags: [],
    color: "bg-[#1C3F95]",
  })
  const [newTag, setNewTag] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const templates = projectCreationService.getTemplates()
  const colors = [
    "bg-[#E41E26]", // Red
    "bg-[#1C3F95]", // Blue
    "bg-[#FFD500]", // Yellow
    "bg-black", // Black
    "bg-gray-600", // Gray
  ]

  const steps: Array<{ id: WizardStep; title: string; description: string }> = [
    { id: "template", title: "Choose Template", description: "Select a starting point for your project" },
    { id: "details", title: "Project Details", description: "Add title, description, and tags" },
    { id: "settings", title: "Project Settings", description: "Configure audio settings" },
    { id: "review", title: "Review & Create", description: "Review your project before creating" },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id)
    }
  }

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id)
    }
  }

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setSelectedTemplate(template)
    setProjectData((prev) => ({
      ...prev,
      templateId: template.id,
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !projectData.tags?.includes(newTag.trim())) {
      setProjectData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setProjectData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }))
  }

  const handleCreateProject = async () => {
    setIsCreating(true)
    setError(null)

    try {
      const project = await projectCreationService.createProject(projectData)
      onComplete?.(project.id)
      router.push(`/projects/${project.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project")
    } finally {
      setIsCreating(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case "template":
        return selectedTemplate !== null
      case "details":
        return projectData.title.trim().length > 0
      case "settings":
        return true
      case "review":
        return true
      default:
        return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">Create New Project</h1>
        <p className="text-muted-foreground uppercase text-xs tracking-wide">
          Follow the steps below to create your music collaboration project
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 border-2 font-bold text-sm",
                  index <= currentStepIndex ? "bg-black text-white border-black" : "bg-white text-black border-black",
                )}
              >
                {index < currentStepIndex ? <Check className="h-5 w-5" /> : index + 1}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium uppercase tracking-wide">{step.title}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={cn("w-16 h-0.5 mx-4", index < currentStepIndex ? "bg-black" : "bg-gray-300")} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-2 border-black mb-8">
        <CardHeader>
          <CardTitle className="uppercase tracking-wide">{steps[currentStepIndex].title}</CardTitle>
          <CardDescription className="uppercase text-xs tracking-wide">
            {steps[currentStepIndex].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Template Selection */}
          {currentStep === "template" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={cn(
                    "border-2 cursor-pointer transition-colors",
                    selectedTemplate?.id === template.id
                      ? "border-[#1C3F95] bg-[#1C3F95]/5"
                      : "border-black hover:border-[#1C3F95]",
                  )}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{template.icon}</span>
                      <div>
                        <h3 className="font-medium uppercase tracking-wide">{template.name}</h3>
                        <p className="text-sm text-muted-foreground uppercase tracking-wide">{template.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wide">Includes:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.tracks.map((track, index) => (
                          <Badge key={index} variant="outline" className="text-xs uppercase tracking-wide rounded-none">
                            {track.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Project Details */}
          {currentStep === "details" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="uppercase text-xs tracking-wide">
                  Project Title *
                </Label>
                <Input
                  id="title"
                  value={projectData.title}
                  onChange={(e) => setProjectData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title..."
                  className="border-2 border-black rounded-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="uppercase text-xs tracking-wide">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={projectData.description}
                  onChange={(e) => setProjectData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project..."
                  className="border-2 border-black rounded-none min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label className="uppercase text-xs tracking-wide">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    className="border-2 border-black rounded-none"
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button
                    onClick={handleAddTag}
                    variant="outline"
                    className="border-2 border-black uppercase text-xs tracking-wide"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {projectData.tags && projectData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {projectData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="uppercase text-xs tracking-wide rounded-none">
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="uppercase text-xs tracking-wide">Project Color</Label>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        "w-8 h-8 border-2",
                        color,
                        projectData.color === color ? "border-white ring-2 ring-black" : "border-black",
                      )}
                      onClick={() => setProjectData((prev) => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Project Settings */}
          {currentStep === "settings" && selectedTemplate && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="uppercase text-xs tracking-wide">Tempo (BPM)</Label>
                  <Input
                    type="number"
                    value={selectedTemplate.defaultSettings.tempo}
                    className="border-2 border-black rounded-none"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-xs tracking-wide">Time Signature</Label>
                  <Input
                    value={selectedTemplate.defaultSettings.timeSignature}
                    className="border-2 border-black rounded-none"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-xs tracking-wide">Key</Label>
                  <Input
                    value={selectedTemplate.defaultSettings.key}
                    className="border-2 border-black rounded-none"
                    readOnly
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                These settings can be changed later in the project settings.
              </p>
            </div>
          )}

          {/* Review */}
          {currentStep === "review" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium uppercase tracking-wide">Project Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium uppercase tracking-wide">Title:</span>
                      <p className="text-sm">{projectData.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium uppercase tracking-wide">Description:</span>
                      <p className="text-sm">{projectData.description || "No description"}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium uppercase tracking-wide">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {projectData.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs uppercase tracking-wide rounded-none">
                            {tag}
                          </Badge>
                        )) || <span className="text-sm text-muted-foreground">No tags</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium uppercase tracking-wide">Template & Settings</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium uppercase tracking-wide">Template:</span>
                      <p className="text-sm">{selectedTemplate?.name || "None"}</p>
                    </div>
                    {selectedTemplate && (
                      <>
                        <div>
                          <span className="text-sm font-medium uppercase tracking-wide">Tracks:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedTemplate.tracks.map((track, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs uppercase tracking-wide rounded-none"
                              >
                                {track.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium uppercase tracking-wide">Settings:</span>
                          <p className="text-sm">
                            {selectedTemplate.defaultSettings.tempo} BPM,{" "}
                            {selectedTemplate.defaultSettings.timeSignature}, {selectedTemplate.defaultSettings.key}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 border-2 border-red-500 bg-red-50">
                  <p className="text-sm text-red-600 uppercase tracking-wide">{error}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          {currentStepIndex > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="gap-2 border-2 border-black uppercase text-xs tracking-wide"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-2 border-black uppercase text-xs tracking-wide"
          >
            Cancel
          </Button>
        </div>

        <div>
          {currentStep !== "review" ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-2 bg-[#1C3F95] text-white hover:bg-[#1C3F95]/90 uppercase text-xs tracking-wide"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleCreateProject}
              disabled={!canProceed() || isCreating}
              className="gap-2 bg-[#1C3F95] text-white hover:bg-[#1C3F95]/90 uppercase text-xs tracking-wide"
            >
              {isCreating ? "Creating..." : "Create Project"}
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
