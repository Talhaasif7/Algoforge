import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EditorState {
  code: string;
  language: string;
  theme: string;
  fontSize: number;

  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setFontSize: (size: number) => void;
  resetCode: (boilerplate?: string) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      code: "",
      language: "PYTHON",
      theme: "vs-dark",
      fontSize: 14,

      setCode: (code) => set({ code }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      resetCode: (boilerplate) => set({ code: boilerplate || "" }),
    }),
    {
      name: "algoforge-editor",
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        fontSize: state.fontSize,
      }),
    }
  )
);
