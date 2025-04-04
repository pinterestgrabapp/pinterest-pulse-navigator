
// Helper function to safely trigger a click event on an element
export const triggerClick = (element: Element | null) => {
  if (!element) return;
  
  try {
    // Try to use the click method if available (for HTMLElement)
    if (element instanceof HTMLElement) {
      element.click();
    } 
    // Fallback to creating and dispatching a MouseEvent for non-HTMLElement
    else {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      element.dispatchEvent(event);
    }
  } catch (error) {
    console.error('Error triggering click:', error);
  }
};
