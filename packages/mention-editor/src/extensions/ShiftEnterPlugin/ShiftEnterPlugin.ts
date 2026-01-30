import { Plugin, PluginKey } from 'prosemirror-state'
import MEditor from '../../editor'

export const ShiftEnterPluginKey = new PluginKey('ShiftEnterPluginKey')
export type EnterMode = 'enter' | 'shift+enter'

export class ShiftEnterPlugin {
    public readonly plugin: Plugin

    constructor(editor: MEditor, onEnter?: () => void) {
        this.plugin = new Plugin({
            key: ShiftEnterPluginKey,

            props: {
                handleKeyDown(view, event) {

                    if (event.key !== 'Enter') {
                        return false
                    }

                    const enterMode: EnterMode = editor.options.lineBreak ?? 'enter'
                    const isShift = event.shiftKey

                    // enter模式 enter换行 shift+enter调用onEnter
                    // shift+enter模式 shift+enter换行 enter调用onEnter
                    const shouldCallOnEnter =
                        (enterMode === 'enter' && isShift) ||
                        (enterMode === 'shift+enter' && !isShift)

                    const shouldInsertBreak = !shouldCallOnEnter

                    // ---------- 调用 onEnter ----------
                    if (shouldCallOnEnter) {
                        // suggestion 打开时，让 suggestion 处理
                        if (editor.suggestionMenus?.shown) {
                            return false
                        }

                        if (onEnter) {
                            event.preventDefault()
                            onEnter()
                            return true
                        }

                        return false
                    }

                    // ---------- 默认换行 ----------
                    if (shouldInsertBreak) {
                        event.preventDefault()

                        const { state, dispatch } = view
                        const { hard_break } = state.schema.nodes

                        if (!hard_break) {
                            return false
                        }

                        dispatch(
                            state.tr
                                .replaceSelectionWith(hard_break.create())
                                .scrollIntoView(),
                        )

                        return true
                    }

                    return false
                },
            },

        })
    }
}