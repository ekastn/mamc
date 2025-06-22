import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
    Music,
    Users,
    Heart,
    Zap,
    Shield,
    Clock,
    ArrowRight,
    Play,
    Headphones,
    Mic,
    Volume2,
    Star,
    CheckCircle,
} from "lucide-react";

const features = [
    {
        icon: Heart,
        title: "Emotion Tracking",
        description:
            "Track your emotional journey through music creation and connect with others who share your vibe.",
        color: "bg-[#E41E26]",
        iconBg: "bg-[#E41E26]",
    },
    {
        icon: Users,
        title: "Real-time Collaboration",
        description:
            "Work together in real-time with artists from around the world. See changes as they happen.",
        color: "bg-[#1C3F95]",
        iconBg: "bg-[#1C3F95]",
    },
    {
        icon: Shield,
        title: "Version Control",
        description:
            "Never lose your work. Track every change, create checkpoints, and revert when needed.",
        color: "bg-[#FFD500]",
        iconBg: "bg-black",
    },
    {
        icon: Zap,
        title: "Smart Conflict Resolution",
        description:
            "AI-powered conflict resolution helps merge changes when multiple people edit simultaneously.",
        color: "bg-[#E41E26]",
        iconBg: "bg-[#E41E26]",
    },
    {
        icon: Clock,
        title: "Project Checkpoints",
        description:
            "Save important milestones in your project and restore complete project states instantly.",
        color: "bg-[#1C3F95]",
        iconBg: "bg-[#1C3F95]",
    },
    {
        icon: Mic,
        title: "Professional Tools",
        description:
            "Industry-standard audio tools with waveform visualization and professional mixing capabilities.",
        color: "bg-[#FFD500]",
        iconBg: "bg-black",
    },
];

const benefits = [
    {
        title: "Seamless Collaboration",
        description:
            "Work with anyone, anywhere. Our platform handles the technical complexity so you can focus on creating.",
    },
    {
        title: "Emotional Intelligence",
        description:
            "The first platform that understands music is emotional. Track moods, connect with like-minded artists.",
    },
    {
        title: "Professional Grade",
        description:
            "Built for serious musicians with enterprise-level features, security, and reliability.",
    },
    {
        title: "Always in Sync",
        description:
            "Real-time updates ensure everyone is always working on the latest version. No more confusion.",
    },
];

export default function LandingPage() {
    return (
        <main>
            <section className="py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <Badge className="bg-[#FFD500] text-black border-2 border-black uppercase text-xs tracking-wide">
                                Social-Emotional Music Platform
                            </Badge>
                            <h1 className="text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-tight">
                                Create Music
                                <br />
                                <span className="text-[#E41E26]">Together</span>
                                <br />
                                With Heart
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                The first music collaboration platform that understands
                                emotions. Connect with artists worldwide, share your feelings
                                through music, and create something beautiful together.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="bg-[#E41E26] hover:bg-[#E41E26]/90 text-white uppercase text-sm tracking-wide px-8 py-6"
                                asChild
                            >
                                <Link
                                    href="/auth/register"
                                    className="flex items-center gap-2"
                                >
                                    Start Creating{" "}
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-black uppercase text-sm tracking-wide px-8 py-6"
                                asChild
                            >
                                <Link href="#demo" className="flex items-center gap-2">
                                    <Play className="h-5 w-5" /> Watch Demo
                                </Link>
                            </Button>
                        </div>

                        <div className="flex items-center gap-8 pt-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#E41E26]">10K+</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wide">
                                    Artists
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#1C3F95]">50K+</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wide">
                                    Tracks
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#FFD500]">100K+</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wide">
                                    Collaborations
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative z-10">
                            <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <div className="h-4 w-full bg-[#E41E26]"></div>
                                <CardHeader>
                                    <CardTitle className="uppercase tracking-wide">
                                        Live Collaboration
                                    </CardTitle>
                                    <CardDescription className="uppercase text-xs tracking-wide">
                                        Real-time music creation
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-[#1C3F95] border-2 border-black flex items-center justify-center">
                                            <Music className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-medium uppercase text-sm tracking-wide">
                                                Sarah is editing
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Adding vocals to Track 2
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-[#FFD500] border-2 border-black flex items-center justify-center">
                                            <Headphones className="h-5 w-5 text-black" />
                                        </div>
                                        <div>
                                            <div className="font-medium uppercase text-sm tracking-wide">
                                                Mike is listening
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Reviewing the mix
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-20 bg-gray-100 border-2 border-black flex items-center justify-center">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Volume2 className="h-5 w-5" />
                                            <span className="uppercase text-xs tracking-wide">
                                                Waveform Visualization
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 h-20 w-20 bg-[#FFD500] border-2 border-black"></div>
                        <div className="absolute -bottom-4 -left-4 h-16 w-16 bg-[#1C3F95] border-2 border-black rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl font-bold uppercase tracking-wide">
                            Why Choose{" "}
                            <span className="text-[#E41E26]">Harmonic</span>?
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            We're not just another music platform. We understand that music
                            is emotional, and collaboration should be too.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="border-2 border-black overflow-hidden hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                            >
                                <div className={`h-2 w-full ${feature.color}`}></div>
                                <CardHeader>
                                    <div
                                        className={`h-12 w-12 ${feature.iconBg} border-2 border-black flex items-center justify-center mb-4`}
                                    >
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="uppercase tracking-wide">
                                        {feature.title}
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        {feature.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-bold uppercase tracking-wide">
                                Built for{" "}
                                <span className="text-[#1C3F95]">Modern</span> Musicians
                            </h2>
                            <div className="space-y-6">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex gap-4">
                                        <CheckCircle className="h-6 w-6 text-[#E41E26] flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-bold uppercase tracking-wide mb-1">
                                                {benefit.title}
                                            </h3>
                                            <p className="text-muted-foreground">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <div className="h-4 w-full bg-[#1C3F95]"></div>
                                <CardHeader>
                                    <CardTitle className="uppercase tracking-wide">
                                        Emotion-Driven Creation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="h-16 bg-[#E41E26] border-2 border-black flex items-center justify-center">
                                            <Heart className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="h-16 bg-[#FFD500] border-2 border-black flex items-center justify-center">
                                            <Star className="h-6 w-6 text-black" />
                                        </div>
                                        <div className="h-16 bg-[#1C3F95] border-2 border-black flex items-center justify-center">
                                            <Zap className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Track your emotional journey through music creation and
                                        connect with others who share your vibe.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-[#E41E26] mb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white uppercase tracking-wide">
                            Ready to Create Something Amazing?
                        </h2>
                        <p className="text-xl text-white/90">
                            Join thousands of artists who are already collaborating and
                            creating music with heart.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-white text-[#E41E26] hover:bg-white/90 uppercase text-sm tracking-wide px-8 py-6"
                                asChild
                            >
                                <Link href="/register">Start Free Today</Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-white text-white hover:bg-white hover:text-[#E41E26] uppercase text-sm tracking-wide px-8 py-6"
                                asChild
                            >
                                <Link href="/login">Already Have Account?</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
