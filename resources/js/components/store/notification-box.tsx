interface NotificationBoxProps {
    title: string;
    message: string;
    actionLabel?: string;
    actionHref?: string;
    image?: string;
}

export default function NotificationBox({ title, message, actionLabel, actionHref, image }: NotificationBoxProps) {
    return (
        <section className="pb-12">
            <div className="bg-[#160b22]/40 border border-[#7f13ec]/20 p-8 rounded-xl flex items-center gap-10">
                <div className="flex-1">
                    <h3 className="font-pixel text-lg text-[#7f13ec] mb-4">{title}</h3>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">{message}</p>
                    
                    {actionLabel && actionHref && (
                        <a 
                            href={actionHref}
                            className="inline-block mt-6 border-b border-[#7f13ec] text-[#7f13ec] font-pixel text-[10px] py-1 hover:text-white hover:border-white transition-colors"
                        >
                            {actionLabel}
                        </a>
                    )}
                </div>

                {image && (
                    <div className="hidden lg:block w-48 h-48 pixel-shadow bg-[#160b22] p-2 border border-[#7f13ec]/20">
                        <img 
                            src={image} 
                            alt="Notification" 
                            className="w-full h-full object-cover grayscale opacity-50"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
