import React, { useEffect } from "react";

function useAutoScrollingDiv(divRef: React.MutableRefObject<HTMLDivElement>) {
  useEffect(() => {
    // Get the div element
    const div = divRef.current;

    // Set the scroll position to the bottom of the div
    div.scrollTop = div.scrollHeight;

    // Create a function to update the scroll position
    function updateScrollPosition() {
      // Set the scroll position to the bottom of the div
      div.scrollTop = div.scrollHeight;
    }

    // Set an interval to update the scroll position every 1 second
    const intervalId = setInterval(updateScrollPosition, 1000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  });
}
