"use client";
import * as React from "react";
import Image from "next/image";
import { useState } from "react";
import { useAccount } from "@/context/AccountContext";
import { GalleryVerticalEnd, AudioWaveform, Command, ChevronDown } from "lucide-react";

const teams = [
  {
    name: "PENS",
    logo: GalleryVerticalEnd,
    avatar: "/images/logo/logo_pens.png",
    plan: "Kampus",
  },
  {
    name: "ITS",
    logo: AudioWaveform,
    avatar: "/images/logo/logo-its.png",
    plan: "Kampus",
  },
  {
    name: "PPNS",
    logo: Command,
    avatar: "/images/logo/logo-ppns.png",
    plan: "Kampus",
  },
];

export function TeamSwitcher({ showText = true }: { showText?: boolean }) {
  const { account, setAccount } = useAccount();
  const [open, setOpen] = useState(false);
  const activeTeam = teams.find((t) => t.name === account) || teams[0];

  return (
    <div className="relative w-full">
      <button
        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        onClick={() => setOpen((v) => !v)}
        aria-label="Switch Team"
      >
        {/* Logo kampus: gunakan style w-8 h-auto agar proporsional, tanpa border/frame/rounded */}
        <Image src={activeTeam.avatar} alt={activeTeam.name} width={36} height={36} className="w-9 h-auto object-contain" />
        {showText && (
          <div className="flex flex-col text-left">
            <span className="font-semibold text-sm text-gray-800 dark:text-white">{activeTeam.name}</span>
            <span className="text-xs text-gray-400">{activeTeam.plan}</span>
          </div>
        )}
        <ChevronDown 
          className={`ml-auto w-4 h-4 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`} 
        />
      </button>
      {open && (
        <div
          className="absolute left-0 mt-2 w-full z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden transition-all duration-200 origin-top"
          style={{
            animation: 'dropdownIn 0.4s ease-out forwards',
          }}
        >
          {teams.map((team) => (
            <button
              key={team.name}
              className={`flex items-center gap-3 w-full px-3 py-2 transition-all ${account === team.name ? "bg-blue-100 dark:bg-blue-900/30" : "hover:bg-gray-50 dark:hover:bg-gray-700"}`}
              onClick={() => { setAccount(team.name as typeof account); setOpen(false); }}
            >
              {/* Logo kampus di dropdown: gunakan style w-8 h-auto agar proporsional, tanpa border/frame/rounded */}
              <Image src={team.avatar} alt={team.name} width={32} height={32} className="w-8 h-auto object-contain" />
              <div className="flex flex-col text-left">
                <span className={`font-semibold text-sm ${account === team.name ? "text-blue-600 dark:text-blue-400" : "text-gray-800 dark:text-white"}`}>{team.name}</span>
                <span className="text-xs text-gray-400">{team.plan}</span>
              </div>
              {account === team.name && (
                <span className="ml-auto px-2 py-1 text-xs rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold">Active</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}