import { useEffect, useState } from "react";

export default function usePauseScroll() {
  // ! TURN BACK ON
  const [loaderPct, setLoaderPct] = useState(100);

  useEffect(() => {
    // ! TURN BACK ON
    // document.body.classList.add("stop-scrolling");
    // let local = 0;
    // const incrementTimer = setInterval(() => {
    //   local = local + 1;
    //   setLoaderPct(local);
    //   if (local === 100) {
    //     clearInterval(incrementTimer);
    //   }
    // }, 10);
    // return () => clearInterval(incrementTimer);
  }, []);

  useEffect(() => {
    if (loaderPct === 100) {
      (async function () {
        try {
          const L = (await import("locomotive-scroll")).default;
          new L();
        } catch (err) {
          console.error(err);
        }
      })();
      console.log(loaderPct);
      // document.body.classList.remove("stop-scrolling");
    }
  }, [loaderPct]);

  return { loaderPct };
}
