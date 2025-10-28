/**
 * Olivia - AI Voice Assistant
 * Copyright (c) 2024 Ayush Srivastava
 * 
 * Licensed under the MIT License
 */

"use client"
import {ConversationInterface} from "../components/ConversationInterface";
import AudioMessenger from "../components/AudioMessenger";
import dynamic from 'next/dynamic';

const Dither = dynamic(() => import('../components/Dither'), { ssr: false });

export default function Home() {
    return (
        <div className="relative w-full min-h-screen">
            {/* Background Dither Effect */}
            <div className="fixed inset-0 w-full h-full -z-10">
                <Dither
                    waveColor={[0.5, 0.5, 0.5]}
                    disableAnimation={false}
                    enableMouseInteraction={true}
                    mouseRadius={0.3}
                    colorNum={4}
                    waveAmplitude={0.3}
                    waveFrequency={3}
                    waveSpeed={0.05}
                />
            </div>
            
            {/* Content */}
            <div className="relative z-10 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
                <main className="flex flex-col md:flex-row gap-8 row-start-2 items-center">
                    <ConversationInterface/>
                </main>
            </div>
        </div>
    );
}

                //<ConvAI/>
                //<AudioMessenger/>

                // https://d4c44f081440.ngrok.app/