import React, { useRef, useState, useEffect } from "react";

function AutoScrollingDiv() {
  // Create a reference to the div element
  const divRef = useRef();

  // Create state variables to store the data and loading state
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the data from the API
    fetch("https://example.com/api/data")
      .then((response) => response.json())
      .then((json) => {
        // Update the data and loading state when the response is received
        setData(json);
        setIsLoading(false);
      });

    // Set an interval to refresh the data every 5 minutes
    const intervalId = setInterval(() => {
      setIsLoading(true);
      fetch("https://example.com/api/data")
        .then((response) => response.json())
        .then((json) => {
          setData(json);
          setIsLoading(false);
        });
    }, 300000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

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
  }, [data]);

  if (isLoading) {
    // Show a loading spinner while the data is being fetched
    return <div className="auto-scrolling-div">Loading...</div>;
  }

  return (
    <div ref={divRef} className="auto-scrolling-div">
      {data.map((item) => (
        // Render each item in the data array
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
