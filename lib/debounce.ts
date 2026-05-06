let timeout: any;
export default function DEBOUNCE(cb: any, delay = 400) {
  return function (...args: any) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}
