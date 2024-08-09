export function getNearestScrollableParent(wrapper: Element, direction: "horizontal" | "vertical"): Element | null {
    let nearestScrollableParent: Element | null = wrapper.parentElement

    while (nearestScrollableParent) {
        const computedStyle = getComputedStyle(nearestScrollableParent)
        const overflowStyle = direction === "horizontal" ? computedStyle.overflowX : computedStyle.overflowY

        if (overflowStyle === "scroll" || overflowStyle === "auto") {
            break
        }

        nearestScrollableParent = nearestScrollableParent.parentElement
    }

    return nearestScrollableParent
}

export function getNearestFixedPositioningContainer(element: Element): HTMLElement | null {
    let current = element.parentElement
    while (current) {
        const computedStyle = getComputedStyle(current)
        if (computedStyle.containerType === "inline-size" || computedStyle.containerType === "size") {
            return current
        }
        // if (computedStyle.position === "fixed" || computedStyle.transform !== "none" || computedStyle.perspective !== "none" || computedStyle.contain === "paint") {
        //     return current
        // }
        current = current.parentElement
    }
    return null
}

export function getElementOffset(el: HTMLElement): {
    top: number;
    left: number
} {
    let top = 0
    let left = 0
    let element = el

    do {
        top += element.offsetTop || 0
        left += element.offsetLeft || 0
        element = element.offsetParent as HTMLElement
    } while (element)

    return {
        top,
        left
    }
}

export function visualizeBoundingRect(element: HTMLElement): () => void {
        const rect = element.getBoundingClientRect()
        const offset = getElementOffset(element)

        const elementRectangle = document.createElement("div")

        const rectangleStyles: Partial<CSSStyleDeclaration> = {
            position: "fixed",
            pointerEvents: "none",
            zIndex: "9999"
        }

        Object.assign(elementRectangle.style, rectangleStyles, {
            border: "2px solid red"
        })

        if (elementRectangle) {
            Object.assign(elementRectangle.style, rectangleStyles, {
                border: "2px dashed blue"
            })
        }

        const updateRectangles = () => {
            Object.assign(elementRectangle.style, {
                left: `${offset.left}px`,
                top: `${offset.top}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`
            })
        }

        updateRectangles()
        document.body.appendChild(elementRectangle)

        return () => {
            elementRectangle.remove()
        }
    }