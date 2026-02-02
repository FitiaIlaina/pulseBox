import React, { createContext, useContext, useState } from "react";

interface VideoContextType {
    currentVideoId: number | null;
    setCurrentVideoId: (id: number | null) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentVideoId, setCurrentVideoId] = useState<number | null>(null);

    return (
        <VideoContext.Provider value={{ currentVideoId, setCurrentVideoId }}>
            {children}
        </VideoContext.Provider>
    );
};

export const useVideoContext = () => {
    const context = useContext(VideoContext);
    if (!context) {
        throw new Error('useVideoContext must be used within a VideoProvider');
    }
    return context;
};
