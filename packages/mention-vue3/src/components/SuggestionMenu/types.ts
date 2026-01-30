import MEditor from "@shenjipo/mention-editor"

export interface SuggestionMenuPropsType {
    editor: MEditor
    query: string
    closeMenu: () => void
    clearQuery: () => void
    insertMention: (item: SuggestionItem) => void
}

export interface SuggestionItem {
    id: string
    label: string
}