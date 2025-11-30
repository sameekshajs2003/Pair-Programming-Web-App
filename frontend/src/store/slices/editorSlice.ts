import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AutocompleteSuggestion {
  suggestion: string
  confidence: number
  description?: string
}

interface EditorState {
  code: string
  language: string
  cursorPosition: number
  isTyping: boolean
  lastUpdate: number
  autocompleteSuggestion: AutocompleteSuggestion | null
  showSuggestion: boolean
}

const initialState: EditorState = {
  code: '# Welcome to Real-Time Pair Programming!\n# Start typing to collaborate...\n',
  language: 'python',
  cursorPosition: 0,
  isTyping: false,
  lastUpdate: Date.now(),
  autocompleteSuggestion: null,
  showSuggestion: false,
}

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload
      state.lastUpdate = Date.now()
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },
    setCursorPosition: (state, action: PayloadAction<number>) => {
      state.cursorPosition = action.payload
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload
    },
    setAutocompleteSuggestion: (state, action: PayloadAction<AutocompleteSuggestion | null>) => {
      state.autocompleteSuggestion = action.payload
      state.showSuggestion = action.payload !== null
    },
    hideSuggestion: (state) => {
      state.showSuggestion = false
    },
    resetEditor: () => initialState,
  },
})

export const {
  setCode,
  setLanguage,
  setCursorPosition,
  setIsTyping,
  setAutocompleteSuggestion,
  hideSuggestion,
  resetEditor,
} = editorSlice.actions

export default editorSlice.reducer
