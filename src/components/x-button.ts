
export const $ = (selector: string) => {
    const element = document.querySelector(selector);
    return element ?? null;
}

export const onClick = (element: Element | null, callback: () => Promise<void>) => {
    const elementStyle = element ? Reflect.get(element, 'style') : null;
    const style = elementStyle instanceof CSSStyleDeclaration ? elementStyle : null;
    style?.setProperty("--is-x-button", "true");

    element?.addEventListener('click', async (event) => {
        try {
            await callback();
        } catch (error) {
            console.error('Error executing callback:', error);
        } finally {
        }
    })
}

export const addStyleProperty = (element: Element | null, property: string, value: string) => {
    if (!element) return;
    const elementStyle = Reflect.get(element, 'style');
    const style = elementStyle instanceof CSSStyleDeclaration ? elementStyle : null;
    style?.setProperty(property, value);
}

export const removeStyleProperty = (element: Element | null, property: string) => {
    if (!element) return;
    const elementStyle = Reflect.get(element, 'style');
    const style = elementStyle instanceof CSSStyleDeclaration ? elementStyle : null;
    style?.removeProperty(property);
}
export const getStyleProperty = (element: Element | null, property: string) => {
    if (!element) return null;
    const elementStyle = Reflect.get(element, 'style');
    const style = elementStyle instanceof CSSStyleDeclaration ? elementStyle : null;
    if (style) {
        const value = style.getPropertyValue(property);
        return value ? value.trim() : null;
    }
    return null;
}

export const toggleClass = (element: Element | null, className: string) => {
    if (!element) return;
    element.classList.toggle(className);
}

export const addClass = (element: Element | null, className: string) => {
    if (!element) return
    element.classList.add(className);
}

export const removeClass = (element: Element | null, className: string) => {
    if (!element) return;
    element.classList.remove(className);
}

export const setAttribute = (element: Element | null, attribute: string, value: string = "") => {
    if (!element) return;
    element.setAttribute(attribute, value);
}

export const removeAttribute = (element: Element | null, attribute: string) => {
    if (!element) return;
    element.removeAttribute(attribute);
}

export const getAttribute = (element: Element | null, attribute: string) => {
    if (!element) return null;
    return element.getAttribute(attribute);
}
