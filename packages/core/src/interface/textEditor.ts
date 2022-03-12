export interface TextEditor {
  editor: JSX.Element | null
  editTopic: (id: string) => void
  exitEdit: () => void
  commitEdit: () => void
}
