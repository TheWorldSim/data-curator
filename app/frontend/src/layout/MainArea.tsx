import { Component, createRef, h } from "preact"

import "./MainArea.css"
import { MainContent } from "./MainContent"
import { TabsContainer } from "./TabsContainer"


export class MainArea extends Component {
    ref = createRef()
    ref_tabs_container = createRef()
    ref_main_content = createRef()

    update_positions ()
    {
        console.log("updating positions")
        const width = this.ref.current.clientWidth
        this.ref_tabs_container.current.style.width = `${width}px`

        const height = this.ref_tabs_container.current.clientHeight
        this.ref_main_content.current.style.paddingTop = `${height}px`
    }

    componentDidMount() {
        this.update_positions()
    }

    componentDidUpdate() {
        this.update_positions()
    }

    render() {
        return <div ref={this.ref}>
            <div id="tabs_container" ref={this.ref_tabs_container}>
                <TabsContainer content_changed={() => this.update_positions()} />
            </div>
            <div id="main_content" ref={this.ref_main_content}>
                <MainContent />
            </div>
        </div>
    }
}