"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { buildFaqJsonLd, homeFaqs } from "@/components/faq-data"

export function FaqSection() {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/*
              The FAQPage markup lives with the component that renders the
              answers, rather than in the root layout where it used to sit. That
              makes it structurally impossible for the schema to appear on a page
              that does not display the FAQ — which is exactly what went wrong
              before, when every route on the site carried it.
            */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd()) }}
            />

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
                    {/*
                      Rendered from components/faq-data.ts, which also feeds the
                      FAQPage JSON-LD on app/page.tsx. Keep new questions there
                      so the markup and the visible copy cannot drift apart.
                    */}
                    <Accordion type="single" collapsible className="w-full">
                        {homeFaqs.map((faq, i) => (
                            <AccordionItem key={faq.question} value={`item-${i + 1}`} className="border-white/10">
                                <AccordionTrigger className="text-lg md:text-xl font-serif hover:text-primary transition-colors">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    )
}
