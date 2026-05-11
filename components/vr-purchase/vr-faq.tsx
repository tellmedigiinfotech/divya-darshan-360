"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { vrFaqs } from "@/components/vr-purchase/vr-faqs-data"

export function VrFaq() {
    return (
        <section className="py-24 md:py-32 px-6 relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <span className="text-primary tracking-[0.3em] uppercase text-sm mb-4 block">Common Queries</span>
                    <h2 className="text-4xl md:text-6xl font-serif mb-6">VR Headset FAQs</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Everything you need to know before bringing divine darshan home.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Accordion type="single" collapsible className="w-full">
                        {vrFaqs.map((f, i) => (
                            <AccordionItem
                                key={i}
                                value={`item-${i + 1}`}
                                className="border-white/10"
                            >
                                <AccordionTrigger className="text-lg md:text-xl font-serif hover:text-primary transition-colors text-left">
                                    {f.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                    {f.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    )
}
