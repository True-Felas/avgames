import React from 'react';

interface Props {
    level: number;
    downloads?: number; // total downloads for user
    className?: string;
}

export default function LevelBadge({ level, downloads = 0, className = '' }: Props) {
    // Calculate progress inside the current level based on downloads per level (5 per level)
    const downloadsInLevel = downloads % 5;
    const progress = Math.round((downloadsInLevel / 5) * 100);

    return (
        <div className={`flex flex-col items-start ${className}`}>
            <span className="font-pixel text-[10px] text-[#7f13ec]">LVL {level}</span>
            <div className="w-20 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                <div
                    className="h-full bg-[#7f13ec] rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}
