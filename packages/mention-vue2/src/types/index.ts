import MEditor from "@shenjipo/mention-editor"
import Vue from "vue"


export type MEditorVue2Type = Vue & {
    editor: MEditor
    clear: () => void
}

export interface SuggestionItem {
    id: string
    label: string
}

export interface SuggestionMenuProps {
    editor: MEditor
    query: string
    closeMenu: () => void
    clearQuery: () => void
    insertMention: (item: SuggestionItem) => void
}