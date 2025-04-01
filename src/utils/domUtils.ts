
// Helper function to safely trigger a click event on an element
export const triggerClick = (element: Element | null) => {
  if (!element) return;
  
  // Using the modern approach
  if (typeof MouseEvent === 'function') {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.dispatchEvent(event);
  } 
  // Fallback for older browsers
  else {
    const event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    element.dispatchEvent(event);
  }
};
