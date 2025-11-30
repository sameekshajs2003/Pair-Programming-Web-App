import Editor from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/useRedux'
import { roomApi } from '../services/api'
import type { RootState } from '../store'
import { setAutocompleteSuggestion, setCode, setCursorPosition } from '../store/slices/editorSlice'
import './CodeEditor.css'

interface CodeEditorProps {
  sendMessage: (message: any) => void
}

const CodeEditor = ({ sendMessage }: CodeEditorProps) => {
  const dispatch = useAppDispatch()
  const editorState = useAppSelector((state: RootState) => state.editor) as any
  const { code, language, autocompleteSuggestion, showSuggestion } = editorState
  // roomId is intentionally not used inside the editor right now
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`)
  const autocompleteTimeoutRef = useRef<number>()
  const editorRef = useRef<any>(null)

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return

    dispatch(setCode(value))

    // Send code update via WebSocket
    sendMessage({
      type: 'code_update',
      code: value,
      userId,
      language,
    })

    // Trigger autocomplete with debounce
    if (autocompleteTimeoutRef.current) {
      clearTimeout(autocompleteTimeoutRef.current)
    }

    autocompleteTimeoutRef.current = window.setTimeout(async () => {
      const position = editorRef.current?.getPosition()
      const cursorPos = position
        ? editorRef.current?.getModel()?.getOffsetAt(position) || 0
        : 0

      try {
        const suggestion = await roomApi.getAutocomplete({
          code: value,
          cursorPosition: cursorPos,
          language,
        })

        if (suggestion.confidence > 0.5) {
          dispatch(setAutocompleteSuggestion(suggestion))
          
          // Hide after 5 seconds
          setTimeout(() => {
            dispatch(setAutocompleteSuggestion(null))
          }, 5000)
        }
      } catch (error) {
        console.error('Autocomplete error:', error)
      }
    }, 600)
  }

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor

    // Set up cursor position tracking
    editor.onDidChangeCursorPosition((e: any) => {
      const model = editor.getModel()
      if (model) {
        const offset = model.getOffsetAt(e.position)
        dispatch(setCursorPosition(offset))
      }
    })
  }

  useEffect(() => {
    return () => {
      if (autocompleteTimeoutRef.current) {
        clearTimeout(autocompleteTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="code-editor">
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <span className="toolbar-label">Language:</span>
          <select className="language-selector" value={language} disabled>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
          </select>
        </div>
        
        {showSuggestion && autocompleteSuggestion && (
          <div className="autocomplete-hint">
            <span className="hint-icon">💡</span>
            <span className="hint-text">
              Suggestion: {autocompleteSuggestion.suggestion.substring(0, 50)}
              {autocompleteSuggestion.suggestion.length > 50 && '...'}
            </span>
            <span className="hint-confidence">
              {Math.round(autocompleteSuggestion.confidence * 100)}%
            </span>
          </div>
        )}
      </div>

      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
        }}
      />
    </div>
  )
}

export default CodeEditor
