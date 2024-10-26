export const getElementByXPath = (identifier: string) => {
    return document
        .evaluate(identifier, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue as HTMLElement | null;
}