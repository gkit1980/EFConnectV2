import { Injectable, Renderer2, RendererFactory2, RendererStyleFlags2 } from '@angular/core';

const importantFlag = RendererStyleFlags2.Important

@Injectable({
    providedIn: 'root'
})
export class WindowScrollingService {

    private renderer: Renderer2

    constructor(private rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null)
    }

    /* PUBLIC METHODS */

    /* disable scrolling on body */
    public disable(): void {
        this.renderer.setStyle(document.body, 'overflow', 'hidden', importantFlag);
        this.renderer.setStyle(document.body, 'overflow-x', 'hidden', importantFlag);
        this.renderer.setStyle(document.body, 'overflow-y', 'hidden', importantFlag);
    }

    /* enable scrolling on body */
    public enable(): void {
        this.renderer.removeStyle(document.body, 'overflow');
        this.renderer.removeStyle(document.body, 'overflow-y');
        this.renderer.setStyle(document.body, 'overflow-x', 'hidden', importantFlag);
    }
}