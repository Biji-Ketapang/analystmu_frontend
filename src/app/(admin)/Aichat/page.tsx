"use client";
import React, { useState, useRef } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { PaperPlaneIcon } from "@/icons";
import { FaRobot, FaUser } from "react-icons/fa";

export default function AIChat() {
  const [userInput, setUserInput] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const aiTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Fungsi untuk handle generate caption dengan API
  const handleGenerate = async () => {
    setLoading(true);
    setAiAnswer("");
    try {
      const endpoint = "/api/proxy";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ query: encodeURIComponent(userInput) }),
      });
      if (!response.ok) throw new Error("Gagal fetch dari API");
      const data = await response.json();
      const answer = data?.answer || "Tidak ada jawaban.";
      setAiAnswer(answer);
    } catch {
      setAiAnswer("Terjadi kesalahan saat mengambil jawaban dari API.");
    }
    setLoading(false);
  };

  // Fungsi untuk format jawaban agar spasi paragraf lebih rapi
  const formatAnswer = (text: string) => {
    return text.replace(/\n{2,}/g, "\r\n\r\n").replace(/\n/g, "\r\n");
  };

  // Fungsi untuk copy hasil AI ke clipboard
  const handleCopy = () => {
    if (aiTextareaRef.current) {
      aiTextareaRef.current.select();
      document.execCommand("copy");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <ComponentCard
          title="AI Caption Generator"
          desc="Masukkan permintaan caption di bawah, hasil caption AI akan muncul di bawahnya."
        >
          <div className="flex flex-col gap-8 mt-2">
            {/* Textarea User Input (Atas) */}
            <div className="w-full flex flex-col items-start">
              <label className="mb-2 font-semibold flex items-center gap-2">
                <FaUser /> Caption Request
              </label>
              <textarea
                className="w-full min-h-[120px] md:min-h-[180px] p-4 rounded-lg border bg-white dark:bg-gray-900 text-gray-800 dark:text-white resize-vertical text-base"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="Tulis permintaan caption di sini..."
              />
              <Button
                size="md"
                className="mt-4 w-full md:w-auto"
                startIcon={<PaperPlaneIcon className="w-5 h-5" />}
                onClick={handleGenerate}
                disabled={loading || !userInput.trim()}
              >
                {loading ? "Generating..." : "Generate Caption"}
              </Button>
            </div>
            {/* Textarea AI Answer (Bawah) */}
            <div className="w-full flex flex-col items-end">
              <label className="mb-2 font-semibold flex items-center gap-2 justify-end">
                Caption AI <FaRobot />
              </label>
              <textarea
                ref={aiTextareaRef}
                className="w-full min-h-[220px] md:min-h-[320px] p-4 rounded-lg border bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white resize-vertical text-base"
                value={formatAnswer(aiAnswer)}
                readOnly
                placeholder="Hasil caption AI akan muncul di sini..."
                style={{ whiteSpace: "pre-line" }}
              />
              <button
                type="button"
                className="mt-4 px-5 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition w-full md:w-auto"
                onClick={handleCopy}
                disabled={!aiAnswer}
              >
                Copy
              </button>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
