export interface TextEditor {
  editor: JSX.Element | null
  editTopic: (id: string) => void
  /**
   * exit current text editor without commit changes
   */
  exitEdit: () => void
  /**
   * commit current changes and exit text editor
   */
  commitEdit: () => void
}
