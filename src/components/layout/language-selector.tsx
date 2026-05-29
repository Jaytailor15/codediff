"use client";

import React, { useEffect, useState, useRef } from "react";
import { Globe, Search, Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const INDIAN_LANGUAGES: Language[] = [
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇮🇳" },
];

const GLOBAL_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "zh-CN", name: "Chinese (Mandarin)", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "fa", name: "Persian", nativeName: "فارسی", flag: "🇮🇷" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷" },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱" },
  { code: "th", name: "Thai", nativeName: "ภาษาไทย", flag: "🇹🇭" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮" },
  { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", flag: "🇭🇺" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "ga", name: "Irish", nativeName: "Gaeilge", flag: "🇮🇪" },
  { code: "is", name: "Icelandic", nativeName: "Íslenska", flag: "🇮🇸" },
  { code: "sq", name: "Albanian", nativeName: "Shqip", flag: "🇦🇱" },
  { code: "hy", name: "Armenian", nativeName: "Հայերեն", flag: "🇦🇲" },
  { code: "bg", name: "Bulgarian", nativeName: "Български", flag: "🇧🇬" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", flag: "🇭🇷" },
  { code: "ka", name: "Georgian", nativeName: "ქართული", flag: "🇬🇪" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu", flag: "🇱🇻" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių", flag: "🇱🇹" },
  { code: "mk", name: "Macedonian", nativeName: "Македонски", flag: "🇲🇰" },
  { code: "sr", name: "Serbian", nativeName: "Српски", flag: "🇷🇸" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", flag: "🇸🇰" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina", flag: "🇸🇮" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
  { code: "tl", name: "Tagalog", nativeName: "Tagalog", flag: "🇵🇭" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLangCode, setSelectedLangCode] = useState("en");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load Google Translate dynamic script on mount
  useEffect(() => {
    // 1. Declare global TranslateElement init callback
    if (!(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };
    }

    // 2. Load the loader script
    const scriptId = "google-translate-loader";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // 3. Inject custom CSS to hide the Google Translate browser banner entirely
    const styleId = "google-translate-custom-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        /* Hide translate notification banner */
        .skiptranslate, iframe.skiptranslate, .goog-te-banner-frame {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
        }
        body {
          top: 0px !important;
        }
        .goog-te-gadget {
          display: none !important;
        }
        .goog-te-balloon-frame {
          display: none !important;
        }
        #goog-gt-tt {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Close on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Trigger language change programmatically via the hidden Translate combo box
  const selectLanguage = (code: string) => {
    const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (selectEl) {
      selectEl.value = code;
      selectEl.dispatchEvent(new Event("change"));
      setSelectedLangCode(code);
      setIsOpen(false);
    } else {
      // Fallback if not loaded yet
      setSelectedLangCode(code);
      setIsOpen(false);
    }
  };

  // Find active language profile
  const allLanguages = [...INDIAN_LANGUAGES, ...GLOBAL_LANGUAGES];
  const activeLang = allLanguages.find((l) => l.code === selectedLangCode) || {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
  };

  // Filter languages in list by search term
  const filterLang = (list: Language[]) => {
    if (!searchQuery) return list;
    const query = searchQuery.toLowerCase();
    return list.filter(
      (l) =>
        l.name.toLowerCase().includes(query) ||
        l.nativeName.toLowerCase().includes(query) ||
        l.code.toLowerCase().includes(query)
    );
  };

  const filteredIndian = filterLang(INDIAN_LANGUAGES);
  const filteredGlobal = filterLang(GLOBAL_LANGUAGES);
  const hasResults = filteredIndian.length > 0 || filteredGlobal.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Hidden google translation anchor */}
      <div id="google_translate_element" className="absolute -top-10 left-0 hidden pointer-events-none" />

      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border/60 bg-background/40 backdrop-blur-md hover:bg-secondary/35 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary h-8 select-none text-[11px] font-semibold text-muted-foreground hover:text-foreground",
          isOpen && "bg-secondary/40 border-primary/45"
        )}
      >
        <span className="text-xs shrink-0 select-none">{activeLang.flag}</span>
        <span className="truncate max-w-[85px] leading-none shrink-0 font-medium">
          {activeLang.nativeName}
        </span>
        <ChevronDown className={cn("h-3 w-3 opacity-60 transition-transform duration-200 shrink-0", isOpen && "rotate-180")} />
      </button>

      {/* Animate Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-[260px] bg-background/95 backdrop-blur-lg border border-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {/* Search filter input */}
            <div className="p-2.5 border-b border-border/50 bg-secondary/15 flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search languages..."
                className="w-full bg-transparent border-0 outline-none text-xs text-foreground placeholder:text-muted-foreground/50 focus:ring-0 p-0"
              />
            </div>

            {/* Scrollable list */}
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1.5 space-y-3">
              {/* Indian Regional Languages */}
              {filteredIndian.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-muted-foreground/75 tracking-wider px-2 uppercase select-none">
                    Indian Languages
                  </p>
                  <div className="space-y-0.5">
                    {filteredIndian.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => selectLanguage(lang.code)}
                        className={cn(
                          "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors duration-150 hover:bg-secondary/35",
                          selectedLangCode === lang.code && "bg-primary/10 text-primary hover:bg-primary/15 font-semibold"
                        )}
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          <span className="text-sm shrink-0 select-none">{lang.flag}</span>
                          <span className="truncate leading-none">
                            {lang.nativeName} <span className="text-[10px] text-muted-foreground font-normal ml-0.5">({lang.name})</span>
                          </span>
                        </span>
                        {selectedLangCode === lang.code && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Global / Foreign Languages */}
              {filteredGlobal.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-muted-foreground/75 tracking-wider px-2 uppercase select-none">
                    Foreign Languages
                  </p>
                  <div className="space-y-0.5">
                    {filteredGlobal.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => selectLanguage(lang.code)}
                        className={cn(
                          "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors duration-150 hover:bg-secondary/35",
                          selectedLangCode === lang.code && "bg-primary/10 text-primary hover:bg-primary/15 font-semibold"
                        )}
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          <span className="text-sm shrink-0 select-none">{lang.flag}</span>
                          <span className="truncate leading-none">
                            {lang.nativeName} <span className="text-[10px] text-muted-foreground font-normal ml-0.5">({lang.name})</span>
                          </span>
                        </span>
                        {selectedLangCode === lang.code && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No results message */}
              {!hasResults && (
                <div className="py-8 text-center text-xs text-muted-foreground/50 select-none font-medium">
                  No languages found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
