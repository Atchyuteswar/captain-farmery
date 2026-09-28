"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-black/5 py-6">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left gap-4 group cursor-pointer">
        <h4 className="font-serif text-xl font-medium text-[#111111] group-hover:text-[#2E7D32] transition-colors">{question}</h4>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-[#666666]">
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="pt-4 text-[#666666] font-sans leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
