import { Component, Vue, Prop } from "vue-property-decorator"
import { SuggestionMenuController } from '@shenjipo/mention-vue2';
import type { SuggestionItem, SuggestionMenuProps } from "@shenjipo/mention-vue2/types"

@Component({
    components: {
        SuggestionMenuController
    }
})
export default class SuggestionList extends Vue {
    @Prop() props: SuggestionMenuProps
    selectedIndex = 0
    suggestions: Array<SuggestionItem> = [
        { id: '1', label: '帮我写作' },
        { id: '2', label: '编程' },
        { id: '3', label: '图像生成' },
        { id: '4', label: '解题答疑' },
        { id: '5', label: '音乐生成' },
        { id: '6', label: '数据分析' },
    ]

    creared() {

    }

    mounted() {
        window.addEventListener('keydown', this.handleMenuNavigationKeys)
    }

    getItems(query: string) {
        const items = this.suggestions.filter(item => {
            return item.label.includes(query)
        })
        return Promise.resolve(items)
    }

    handleItemClick(item: SuggestionItem) {
        this.props.closeMenu()
        this.props.clearQuery()
        this.props.insertMention(item)
    }

    handleMenuNavigationKeys(event: KeyboardEvent) {
        if (!this.suggestions.length) {
            return
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault()
            this.selectedIndex = (this.selectedIndex - 1 + this.suggestions.length) % this.suggestions.length
            return true
        }

        if (event.key === 'ArrowDown') {

            event.preventDefault()
            this.selectedIndex = (this.selectedIndex + 1) % this.suggestions.length
            return true
        }

        if (event.key === 'Enter' && !event.isComposing) {
            event.preventDefault()
            this.handleItemClick(this.suggestions[this.selectedIndex])
            return true
        }

        return false
    }

    beforeDestory() {
        window.removeEventListener('keydown', this.handleMenuNavigationKeys)
    }
}