import { useCallback, useMemo, useRef, useContext } from 'preact/hooks'
import { EDITOR_MODE, TopicStyle } from '../constant'
import { ThemeContext } from '../context/theme'
import { TextEditor } from '../interface/textEditor'
import { getTopicTextStyle } from '../layout/shared'
import { Model } from '../model'
import styles from '../view/index.module.css'
import { ViewModel } from '../viewModel'
import { toPX } from './common'

export function useTextEditor(): TextEditor {
  const model = Model.useContainer()
  const viewModel = ViewModel.useContainer()
  const editorRef = useRef<HTMLDivElement>(null)
  const $theme = useContext(ThemeContext)
  const { selection, mode } = viewModel
  const isEditing = selection && mode === EDITOR_MODE.edit

  function editTopic(id: string) {
    viewModel.select(id)
    viewModel.setMode(EDITOR_MODE.edit)
    setTimeout(() => {
      editorRef.current?.focus()
      selectText(editorRef.current ?? undefined)
    }, 50)
  }

  function commitEdit() {
    if (isEditing) {
      model.update(() => {
        model.updateNode(selection, {
          title: editorRef.current?.textContent ?? '',
        })
      })
      exitEdit()
    }
  }

  function exitEdit() {
    viewModel.setMode(EDITOR_MODE.none)
    // Fix selection exit after exit edit mode on firefox
    getSelection()?.removeAllRanges()
  }

  // PreventDefault to prevent enter keyboard event create new html element
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['Enter'].includes(e.key)) {
      e.preventDefault()
    }
  }, [])

  const editor = useMemo(() => {
    const layoutNode = viewModel.layoutRoot
      ?.descendants()
      .find((node) => node.data.id === selection)
    if (isEditing && layoutNode) {
      const { x, y, size } = layoutNode
      const textStyle = getTopicTextStyle(layoutNode)
      return (
        <div
          ref={editorRef}
          className={styles.textEditor}
          style={{
            transform: `translate(${toPX(x)}, ${toPX(y)})`,
            width: toPX(size[0] + TopicStyle.borderWidth * 2),
            padding: toPX(TopicStyle.padding),
            border: `${toPX(TopicStyle.borderWidth)} solid ${$theme.mainColor}`,
            ...textStyle,
          }}
          contentEditable
          onKeyDown={handleKeyDown}
        >
          {layoutNode.data.title}
        </div>
      )
    }

    return null
  }, [viewModel, handleKeyDown, $theme, styles.textEditor])

  return {
    editor,
    editTopic,
    commitEdit,
    exitEdit,
  }
}

function selectText(element?: HTMLElement) {
  if (!element) return
  if (window.getSelection && document.createRange) {
    const selection = window.getSelection()
    if (selection?.toString() === '') {
      // No text selection
      setTimeout(function () {
        const range = document.createRange() // Range object
        range.selectNodeContents(element) // Sets Range
        selection.removeAllRanges() // Remove all ranges from selection
        selection.addRange(range) // Add Range to a Selection.
      }, 1)
    }
  }
}
