import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        inlineSuggestion: {
            fetchSuggestion: () => ReturnType;
        };
    }
}

const promptPluginKey = new PluginKey("promptPluginKey");


export const PromptExtension = Extension.create<
    {
        fetchAutocompletion?: (existingText: string) => Promise<string>;
    },
    {
        data: {
            currentSuggestion?: string;
            nodeDetails?: {
                from: number;
                to: number;
            }
            timer?: number | null
        };
    }
>({
    name: "promptExtension",

    addOptions() {
        return {

        };
    },

    addStorage() {
        return {
            data: {},
        };
    },

    addCommands() {
        return {
            fetchSuggestion: () => ({ state, chain, editor }) => {
                if (this.storage.data.currentSuggestion) {
                    return chain().command(() => {
                        const chunkifiedSuggestion = this.storage.data.currentSuggestion!.split("")
                        this.storage.data = {}
                        for (let i = 0; i < chunkifiedSuggestion.length; i++) {
                            setTimeout(() => {
                                editor.chain().insertContent(chunkifiedSuggestion[i]).focus().run()
                            }, 2 * i)
                        }
                        return true
                    }).run()
                }
                return false
            },
        }
    },

    addProseMirrorPlugins() {
        if (!this.options.fetchAutocompletion) {
            return []
        }
        const getStorage = () => this.storage
        const fetchAutocompletion = this.options.fetchAutocompletion
        const fetchSuggestion = () => this.editor.commands.fetchSuggestion()

        return [
            new Plugin({
                key: promptPluginKey,
                state: {
                    init() {
                        return DecorationSet.empty
                    },
                    apply(tr) {
                        const storage = getStorage().data;

                        if (storage.currentSuggestion && storage.nodeDetails) {
                            console.log('storage', storage)
                            const { from, to } = storage.nodeDetails

                            const decoration = Decoration.node(from, to, {
                                "data-inline-suggestion": storage.currentSuggestion,
                            })

                            return DecorationSet.create(tr.doc, [decoration])
                        }

                        return DecorationSet.empty;
                    },
                },
                props: {
                    decorations(state) {
                        return this.getState(state);
                    },

                    handleTextInput(view, _, __, text) {
                        const { state } = view
                        const { $from } = state.selection
                        const node = $from.parent
                        const [from, to] = [$from.start() - 1, $from.end() + 2]
                        const existingText = node.textContent

                        if (existingText) {
                            const storage = getStorage()
                            if (storage.data.timer) {
                                clearTimeout(storage.data.timer)
                            }

                            storage.data.timer = setTimeout(() => {
                                fetchAutocompletion(existingText + text).then((res) => {
                                    storage.data.currentSuggestion = res
                                    storage.data.nodeDetails = {
                                        from: from,
                                        to: to,
                                    }
                                    storage.data.timer = null
                                    view.dispatch(view.state.tr.setMeta("addToHistory", false))
                                })
                            }, 500)

                        }
                        return false
                    },

                    handleKeyDown(_, event) {
                        if (event.key === "Tab") {
                            event.preventDefault()
                            fetchSuggestion()
                            return true
                        }
                        const storage = getStorage()
                        if (storage.data.currentSuggestion) {
                            storage.data = {}
                        }
                    },
                },
            }),
        ];
    },
});