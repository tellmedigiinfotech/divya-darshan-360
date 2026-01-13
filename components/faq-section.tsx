"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "framer-motion"

export function FaqSection() {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <span className="text-primary tracking-[0.3em] uppercase text-sm mb-4 block">Common Queries</span>
                    <h2 className="text-4xl md:text-6xl font-serif mb-6">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Everything you need to know about the Divya Darshan 360 experience.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-white/10">
                            <AccordionTrigger className="text-lg md:text-xl font-serif hover:text-primary transition-colors">
                                What is Divya Darshan 360?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                Divya Darshan 360 is a premier virtual reality platform that offers immersive 360-degree experiences of sacred Hindu temples. It allows you to perform digital darshan of famous pilgrimages like Jyotirlingas and Shakti Peethas from the comfort of your home, using high-fidelity VR technology.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2" className="border-white/10">
                            <AccordionTrigger className="text-lg md:text-xl font-serif hover:text-primary transition-colors">
                                Is the Divya Darshan 360 app free?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                Yes, the Divya Darshan 360 app is free to download on the Google Play Store. We offer a range of free darshan experiences. Some premium, exclusive content or special pooja services may have specific offerings, but the core experience of connecting with the divine is accessible to everyone.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3" className="border-white/10">
                            <AccordionTrigger className="text-lg md:text-xl font-serif hover:text-primary transition-colors">
                                Do I need a VR headset to use the app?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                No, a VR headset is not strictly required. You can experience the 360-degree videos directly on your smartphone by moving your device around (Magic Window mode). However, for the most immersive experience, we recommend using a Google Cardboard or any standard mobile VR headset.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-4" className="border-white/10">
                            <AccordionTrigger className="text-lg md:text-xl font-serif hover:text-primary transition-colors">
                                Which temples are covered in the app?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                We feature a growing library of sacred sites, including the 12 Jyotirlingas, Ashtavinayak temples, major Shakti Peethas, and Shirdi Sai Baba temple. We regularly update our collection with new exclusive darshans from across India.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-5" className="border-white/10">
                            <AccordionTrigger className="text-lg md:text-xl font-serif hover:text-primary transition-colors">
                                How is this different from YouTube 360 videos?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                Unlike standard YouTube videos, Divya Darshan 360 offers a dedicated, ad-free spiritual environment. Our content is professionally captured with high-end proprietary equipment for superior clarity and is often filmed during exclusive access periods, providing views that are otherwise difficult for the general public to witness.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </motion.div>
            </div>
        </section>
    )
}
