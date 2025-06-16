"use client";

import { ReactNode } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HarmonicCardProps {
    title?: string;
    description?: string;
    accentColor?: string;
    isUnread?: boolean;
    className?: string;
    children?: ReactNode;
    headerClassName?: string;
    contentClassName?: string;
    footerClassName?: string;
    onClick?: () => void;
    colorBar?: boolean;
    interactive?: boolean;
}

export function HarmonicCard({
    title,
    description,
    accentColor = "bg-black",
    isUnread = false,
    className,
    children,
    headerClassName,
    contentClassName,
    footerClassName,
    onClick,
    colorBar = true,
    interactive = false,
}: HarmonicCardProps) {
    const isClickable = onClick !== undefined;

    return (
        <Card
            className={cn(
                "border-2 border-black overflow-hidden relative",
                "cursor-pointer group hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C3F95] motion-reduce:hover:translate-y-0 motion-reduce:transition-colors",
                className
            )}
            onClick={onClick}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={
                isClickable
                    ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onClick();
                          }
                      }
                    : undefined
            }
            role={isClickable ? "button" : undefined}
            aria-label={title ? title : "Interactive card"}
            aria-describedby={description ? `${title}-desc` : undefined}
        >
            <div
                className={cn(
                    "h-2 w-full transition-all duration-300 motion-reduce:transition-none",
                    isUnread ? "bg-[#E41E26]" : accentColor,
                    interactive &&
                        "group-hover:h-4 group-hover:scale-x-[1.03] motion-reduce:group-hover:scale-x-100"
                )}
            ></div>

            {(title || description) && (
                <CardHeader className={cn(interactive ? "p-3 pb-1" : "p-4 pb-2", headerClassName)}>
                    <div className="flex justify-between items-start">
                        <div className="relative">
                            {title && (
                                <CardTitle
                                    className={cn(
                                        "relative z-10 group-hover:translate-x-1 transition-transform duration-300",
                                        interactive
                                            ? "text-sm group-hover:translate-x-0"
                                            : "text-base uppercase tracking-wide"
                                    )}
                                    id={`${title.replace(/\s+/g, "-").toLowerCase()}-title`}
                                >
                                    {title}
                                </CardTitle>
                            )}
                            {description && (
                                <CardDescription
                                    className={cn(
                                        interactive
                                            ? "text-[10px]"
                                            : "text-xs uppercase tracking-wide"
                                    )}
                                    id={
                                        title
                                            ? `${title.replace(/\s+/g, "-").toLowerCase()}-desc`
                                            : undefined
                                    }
                                >
                                    {description}
                                </CardDescription>
                            )}
                        </div>
                        {isUnread && (
                            <div
                                className={cn(
                                    "bg-[#E41E26] group-hover:rotate-45 transition-transform duration-300",
                                    interactive ? "h-2 w-2" : "h-3 w-3 rounded-none"
                                )}
                            ></div>
                        )}
                    </div>
                </CardHeader>
            )}

            {children}
        </Card>
    );
}

export function HarmonicCardContent({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <CardContent className={cn("p-4 pt-2 relative", className)}>
            <div className="relative z-10 group-hover:translate-x-[2px] transition-transform duration-300 ease-in-out">
                {children}
            </div>
        </CardContent>
    );
}

export function HarmonicCardFooter({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <CardFooter className={cn("p-4 pt-2 flex justify-between relative", className)}>
            <div className="w-full relative z-10 group-hover:translate-y-[-2px] transition-transform duration-300 ease-in-out">
                {children}
            </div>
        </CardFooter>
    );
}

