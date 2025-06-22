"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Edit,
  Save,
  Music,
  Globe,
  Mail,
  Twitter,
  Instagram,
  Youtube,
  ExternalLink,
  MapPin,
  Calendar,
  Briefcase,
  Loader2
} from "lucide-react"
import { SAMPLE_NOTIFICATION_SETTINGS, SAMPLE_SECURITY_SETTINGS, SAMPLE_USER } from "@/lib/constants/user"
import { useAuth } from "@/lib/context/auth-context"

export default function ProfilePage() {
  const { user: authUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userState, setUser] = useState<any>(null)
  const [notificationSettings, setNotificationSettings] = useState(SAMPLE_NOTIFICATION_SETTINGS)
  const [securitySettings, setSecuritySettings] = useState(SAMPLE_SECURITY_SETTINGS)

  const user = SAMPLE_USER;

  // Fetch user profile data
  useEffect(() => {
    // const fetchUserProfile = async () => {
    //   try {
    //     setIsLoading(true)
    //     const response = await fetch('/api/users/me')
        
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch profile')
    //     }
        
    //     const data = await response.json()
    //     setUser(data)
    //     setError(null)
    //   } catch (err) {
    //     console.error('Error fetching user profile:', err)
    //     setError('Failed to load user profile')
    //   } finally {
    //     setIsLoading(false)
    //   }
    // }
    
    // if (authUser?.isAuthenticated) {
    //   fetchUserProfile()
    // }
    setUser(SAMPLE_USER) // For demo purposes, replace with actual fetchJK:w

  }, [authUser])

  const handleToggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true)
      
      // Only send fields that can be updated
      const updateData = {
        name: user.name,
        bio: user.bio,
        avatar: user.avatar
      }
      
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update profile')
      }
      
      const updatedUser = await response.json()
      setUser(updatedUser)
      setIsEditing(false)
      setError(null)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setUser({ ...user, [field]: value })
  }

  const handleToggleNotification = (field: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: !notificationSettings[field],
    })
  }

  const handleEmailDigestChange = (value: "daily" | "weekly" | "never") => {
    setNotificationSettings({
      ...notificationSettings,
      emailDigest: value,
    })
  }

  const handleToggleTwoFactor = () => {
    setSecuritySettings({
      ...securitySettings,
      twoFactorEnabled: !securitySettings.twoFactorEnabled,
    })
  }

  // Show loading state when fetching profile data
  if (isLoading && !user) {
    return (
      <div className="container mx-auto py-10 space-y-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Profile</h1>
            <p className="text-muted-foreground uppercase text-xs tracking-wide">
              Manage your personal information and preferences
            </p>
          </div>
          <Button
            className={`gap-2 ${isEditing ? "bg-[#1C3F95]" : "bg-black"} text-white hover:bg-black/90 uppercase text-xs tracking-wide`}
            onClick={isEditing ? handleSaveProfile : handleToggleEdit}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                Save Profile
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-3 border-2 border-black p-0 h-auto">
            <TabsTrigger
              value="profile"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Overview */}
              <Card className="border-2 border-black md:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg uppercase tracking-wide">Profile Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24 rounded-none">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="rounded-none bg-[#1C3F95] text-white text-xl">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button variant="outline" size="sm" className="uppercase text-xs tracking-wide">
                        Change Avatar
                      </Button>
                    )}
                    <div className="text-center">
                      <h2 className="text-xl font-bold uppercase tracking-wide">{user.name}</h2>
                      <p className="text-muted-foreground uppercase text-xs tracking-wide">@{user.username}</p>
                    </div>
                  </div>

                  <Separator className="bg-black" />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm uppercase tracking-wide">{user.role}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm uppercase tracking-wide">{user.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm uppercase tracking-wide">Joined {user.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm uppercase tracking-wide">{user.email}</span>
                    </div>
                    {user.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm uppercase tracking-wide text-[#1C3F95] hover:underline flex items-center gap-1"
                        >
                          {user.website.replace(/^https?:\/\//, "")}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-black" />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium uppercase tracking-wide">Stats</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border-2 border-black p-2 text-center">
                        <div className="text-lg font-bold">{user.stats.projects}</div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">Projects</div>
                      </div>
                      <div className="border-2 border-black p-2 text-center">
                        <div className="text-lg font-bold">{user.stats.collaborations}</div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">Collaborations</div>
                      </div>
                      <div className="border-2 border-black p-2 text-center">
                        <div className="text-lg font-bold">{user.stats.followers}</div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">Followers</div>
                      </div>
                      <div className="border-2 border-black p-2 text-center">
                        <div className="text-lg font-bold">{user.stats.following}</div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">Following</div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-black" />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium uppercase tracking-wide">Social Links</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.socialLinks?.twitter && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 border-2 border-black uppercase text-xs tracking-wide"
                          onClick={() => window.open(user.socialLinks?.twitter, "_blank")}
                        >
                          <Twitter className="h-4 w-4" />
                          Twitter
                        </Button>
                      )}
                      {user.socialLinks?.instagram && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 border-2 border-black uppercase text-xs tracking-wide"
                          onClick={() => window.open(user.socialLinks?.instagram, "_blank")}
                        >
                          <Instagram className="h-4 w-4" />
                          Instagram
                        </Button>
                      )}
                      {user.socialLinks?.soundcloud && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 border-2 border-black uppercase text-xs tracking-wide"
                          onClick={() => window.open(user.socialLinks?.soundcloud, "_blank")}
                        >
                          <Music className="h-4 w-4" />
                          SoundCloud
                        </Button>
                      )}
                      {user.socialLinks?.youtube && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 border-2 border-black uppercase text-xs tracking-wide"
                          onClick={() => window.open(user.socialLinks?.youtube, "_blank")}
                        >
                          <Youtube className="h-4 w-4" />
                          YouTube
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Details */}
              <Card className="border-2 border-black md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg uppercase tracking-wide">Profile Details</CardTitle>
                  <CardDescription className="uppercase text-xs tracking-wide">
                    {isEditing ? "Edit your profile information" : "Your personal information and preferences"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="uppercase text-xs tracking-wide">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            value={user.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="border-2 border-black rounded-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username" className="uppercase text-xs tracking-wide">
                            Username
                          </Label>
                          <Input
                            id="username"
                            value={user.username}
                            onChange={(e) => handleInputChange("username", e.target.value)}
                            className="border-2 border-black rounded-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="uppercase text-xs tracking-wide">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={user.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="border-2 border-black rounded-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role" className="uppercase text-xs tracking-wide">
                            Role
                          </Label>
                          <Input
                            id="role"
                            value={user.role}
                            onChange={(e) => handleInputChange("role", e.target.value)}
                            className="border-2 border-black rounded-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location" className="uppercase text-xs tracking-wide">
                            Location
                          </Label>
                          <Input
                            id="location"
                            value={user.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            className="border-2 border-black rounded-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website" className="uppercase text-xs tracking-wide">
                            Website
                          </Label>
                          <Input
                            id="website"
                            value={user.website || ""}
                            onChange={(e) => handleInputChange("website", e.target.value)}
                            className="border-2 border-black rounded-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="uppercase text-xs tracking-wide">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={user.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          className="border-2 border-black rounded-none min-h-[100px]"
                        />
                      </div>

                      <Separator className="bg-black" />

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium uppercase tracking-wide">Skills & Expertise</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="skills" className="uppercase text-xs tracking-wide">
                              Skills (comma separated)
                            </Label>
                            <Input
                              id="skills"
                              value={user.skills.join(", ")}
                              onChange={(e) => handleInputChange("skills", e.target.value)}
                              className="border-2 border-black rounded-none"
                              placeholder="e.g. Sound Design, Mixing, Mastering"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="instruments" className="uppercase text-xs tracking-wide">
                              Instruments (comma separated)
                            </Label>
                            <Input
                              id="instruments"
                              value={user.instruments.join(", ")}
                              onChange={(e) => handleInputChange("instruments", e.target.value)}
                              className="border-2 border-black rounded-none"
                              placeholder="e.g. Piano, Guitar, Synthesizers"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="genres" className="uppercase text-xs tracking-wide">
                              Genres (comma separated)
                            </Label>
                            <Input
                              id="genres"
                              value={user.genres.join(", ")}
                              onChange={(e) => handleInputChange("genres", e.target.value)}
                              className="border-2 border-black rounded-none"
                              placeholder="e.g. Electronic, Ambient, Jazz"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-black" />

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium uppercase tracking-wide">Social Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="twitter" className="uppercase text-xs tracking-wide">
                              Twitter
                            </Label>
                            <Input
                              id="twitter"
                              value={user.socialLinks?.twitter || ""}
                              onChange={(e) =>
                                setUser({
                                  ...user,
                                  socialLinks: { ...user.socialLinks, twitter: e.target.value },
                                })
                              }
                              className="border-2 border-black rounded-none"
                              placeholder="https://twitter.com/username"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="instagram" className="uppercase text-xs tracking-wide">
                              Instagram
                            </Label>
                            <Input
                              id="instagram"
                              value={user.socialLinks?.instagram || ""}
                              onChange={(e) =>
                                setUser({
                                  ...user,
                                  socialLinks: { ...user.socialLinks, instagram: e.target.value },
                                })
                              }
                              className="border-2 border-black rounded-none"
                              placeholder="https://instagram.com/username"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="soundcloud" className="uppercase text-xs tracking-wide">
                              SoundCloud
                            </Label>
                            <Input
                              id="soundcloud"
                              value={user.socialLinks?.soundcloud || ""}
                              onChange={(e) =>
                                setUser({
                                  ...user,
                                  socialLinks: { ...user.socialLinks, soundcloud: e.target.value },
                                })
                              }
                              className="border-2 border-black rounded-none"
                              placeholder="https://soundcloud.com/username"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="youtube" className="uppercase text-xs tracking-wide">
                              YouTube
                            </Label>
                            <Input
                              id="youtube"
                              value={user.socialLinks?.youtube || ""}
                              onChange={(e) =>
                                setUser({
                                  ...user,
                                  socialLinks: { ...user.socialLinks, youtube: e.target.value },
                                })
                              }
                              className="border-2 border-black rounded-none"
                              placeholder="https://youtube.com/c/username"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium uppercase tracking-wide">Bio</h3>
                        <p className="text-sm">{user.bio}</p>
                      </div>

                      <Separator className="bg-black" />

                      <div className="space-y-4">
                        <h3 className="text-sm font-medium uppercase tracking-wide">Skills & Expertise</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Music className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium uppercase tracking-wide">Skills</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="uppercase text-xs tracking-wide rounded-none border-2 border-[#1C3F95]"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Music className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium uppercase tracking-wide">Instruments</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {user.instruments.map((instrument, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="uppercase text-xs tracking-wide rounded-none border-2 border-[#E41E26]"
                              >
                                {instrument}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Music className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium uppercase tracking-wide">Genres</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {user.genres.map((genre, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="uppercase text-xs tracking-wide rounded-none border-2 border-[#FFD500]"
                              >
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-2 border-black">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg uppercase tracking-wide">Notification Preferences</CardTitle>
                <CardDescription className="uppercase text-xs tracking-wide">
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm uppercase tracking-wide">Comments</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive notifications when someone comments on your projects
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.comments}
                      onCheckedChange={() => handleToggleNotification("comments")}
                    />
                  </div>
                  <Separator className="bg-black" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm uppercase tracking-wide">Mentions</Label>
                      <p className="text-xs text-muted-foreground">Receive notifications when someone mentions you</p>
                    </div>
                    <Switch
                      checked={notificationSettings.mentions}
                      onCheckedChange={() => handleToggleNotification("mentions")}
                    />
                  </div>
                  <Separator className="bg-black" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm uppercase tracking-wide">Project Updates</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive notifications about updates to projects you&apos;re involved in
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.projectUpdates}
                      onCheckedChange={() => handleToggleNotification("projectUpdates")}
                    />
                  </div>
                  <Separator className="bg-black" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm uppercase tracking-wide">New Collaborators</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive notifications when someone joins a project you're part of
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.newCollaborators}
                      onCheckedChange={() => handleToggleNotification("newCollaborators")}
                    />
                  </div>
                  <Separator className="bg-black" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm uppercase tracking-wide">Version History</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive notifications about version history changes
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.versionHistory}
                      onCheckedChange={() => handleToggleNotification("versionHistory")}
                    />
                  </div>
                </div>

                <Separator className="bg-black" />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium uppercase tracking-wide">Email Digest</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={notificationSettings.emailDigest === "daily" ? "default" : "outline"}
                      className={`uppercase text-xs tracking-wide ${notificationSettings.emailDigest === "daily" ? "bg-black text-white" : "border-2 border-black"}`}
                      onClick={() => handleEmailDigestChange("daily")}
                    >
                      Daily
                    </Button>
                    <Button
                      variant={notificationSettings.emailDigest === "weekly" ? "default" : "outline"}
                      className={`uppercase text-xs tracking-wide ${notificationSettings.emailDigest === "weekly" ? "bg-black text-white" : "border-2 border-black"}`}
                      onClick={() => handleEmailDigestChange("weekly")}
                    >
                      Weekly
                    </Button>
                    <Button
                      variant={notificationSettings.emailDigest === "never" ? "default" : "outline"}
                      className={`uppercase text-xs tracking-wide ${notificationSettings.emailDigest === "never" ? "bg-black text-white" : "border-2 border-black"}`}
                      onClick={() => handleEmailDigestChange("never")}
                    >
                      Never
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border-2 border-black">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg uppercase tracking-wide">Security Settings</CardTitle>
                <CardDescription className="uppercase text-xs tracking-wide">
                  Manage your account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm uppercase tracking-wide">Two-Factor Authentication</Label>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch checked={securitySettings.twoFactorEnabled} onCheckedChange={handleToggleTwoFactor} />
                  </div>
                  <Separator className="bg-black" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm uppercase tracking-wide">Password</Label>
                      <p className="text-xs text-muted-foreground">
                        Last changed: {securitySettings.lastPasswordChange}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-black uppercase text-xs tracking-wide"
                      onClick={() => alert("Change password functionality would be implemented here")}
                    >
                      Change Password
                    </Button>
                  </div>
                  <Separator className="bg-black" />
                  <div className="space-y-2">
                    <Label className="text-sm uppercase tracking-wide">Connected Accounts</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border-2 border-black">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-[#4285F4] flex items-center justify-center text-white">G</div>
                          <span className="text-sm uppercase tracking-wide">Google</span>
                        </div>
                        <Badge
                          variant={securitySettings.connectedAccounts.google ? "default" : "outline"}
                          className={`uppercase text-xs tracking-wide rounded-none ${securitySettings.connectedAccounts.google ? "bg-[#1C3F95]" : "border-2 border-black"}`}
                        >
                          {securitySettings.connectedAccounts.google ? "Connected" : "Not Connected"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border-2 border-black">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-black flex items-center justify-center text-white">A</div>
                          <span className="text-sm uppercase tracking-wide">Apple</span>
                        </div>
                        <Badge
                          variant={securitySettings.connectedAccounts.apple ? "default" : "outline"}
                          className={`uppercase text-xs tracking-wide rounded-none ${securitySettings.connectedAccounts.apple ? "bg-[#1C3F95]" : "border-2 border-black"}`}
                        >
                          {securitySettings.connectedAccounts.apple ? "Connected" : "Not Connected"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border-2 border-black">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-[#1877F2] flex items-center justify-center text-white">F</div>
                          <span className="text-sm uppercase tracking-wide">Facebook</span>
                        </div>
                        <Badge
                          variant={securitySettings.connectedAccounts.facebook ? "default" : "outline"}
                          className={`uppercase text-xs tracking-wide rounded-none ${securitySettings.connectedAccounts.facebook ? "bg-[#1C3F95]" : "border-2 border-black"}`}
                        >
                          {securitySettings.connectedAccounts.facebook ? "Connected" : "Not Connected"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-black" />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium uppercase tracking-wide text-[#E41E26]">Danger Zone</h3>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-[#E41E26] text-[#E41E26] uppercase text-xs tracking-wide"
                    onClick={() => alert("This would open a confirmation dialog for account deletion")}
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
