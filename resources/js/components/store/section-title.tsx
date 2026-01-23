interface SectionTitleProps {
    title: string;
    action?: {
        label: string;
        href: string;
    };
    onPrevious?: () => void;
    onNext?: () => void;
}

export default function SectionTitle({ title, action, onPrevious, onNext }: SectionTitleProps) {
    return (
        <div className="flex items-center justify-between mb-8">
            <h3 className="font-pixel text-sm text-white flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#7f13ec] shadow-[0_0_10px_#7f13ec]"></span>
                {title}
            </h3>

            <div className="flex items-center gap-4">
                {action && (
                    <a 
                        href={action.href}
                        className="text-[#7f13ec] hover:text-white font-pixel text-[10px] transition-colors"
                    >
                        {action.label}
                    </a>
                )}

                {(onPrevious || onNext) && (
                    <div className="flex gap-2">
                        <button
                            onClick={onPrevious}
                            className="p-2 border border-[#7f13ec]/20 text-[#7f13ec] hover:bg-[#7f13ec]/10 transition-colors disabled:opacity-50"
                            disabled={!onPrevious}
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button
                            onClick={onNext}
                            className="p-2 border border-[#7f13ec]/20 text-[#7f13ec] hover:bg-[#7f13ec]/10 transition-colors disabled:opacity-50"
                            disabled={!onNext}
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
