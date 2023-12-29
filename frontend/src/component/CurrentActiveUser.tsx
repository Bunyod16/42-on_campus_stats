import React from "react";
import { User } from "../../types";
import axios from "axios";
import CardTitle from "./CardTitle";
import Card from "./Card";

function CurrentActiveUser({ className }: { className: string }) {
  const [users, setUsers] = React.useState<User[] | undefined>(undefined);
  const divRef = React.useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = React.useState(0);

  React.useEffect(() => {
    const fetchUsers = async () => {
      await axios
        .get("/on-campus/active-users")
        .then((res) => {
          if (res.data.length !== 0) setUsers(res.data);
          else {
            console.log("CurrentActiveUser get successful but data empty.");
            // setUsers(tmp);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    fetchUsers();

    // Call the API every 5 minutes
    const interval = setInterval(fetchUsers, 1000 * 60 * 5);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
    // setUsers(tmp);
  }, []);

  React.useEffect(() => {
    const div: any = divRef.current;
    const divHeight = div.scrollHeight;
    let scrollInt = 0;

    function updateScroll() {
      scrollInt += 1;
      if (scrollInt >= divHeight / 2) {
        scrollInt = -100;
        div.scrollTo({ left: 0, top: 0, behavior: "instant" });
        // div.scrollTop = 0;
      } else div.scrollTo(0, scrollInt);
    }
    const intervalId = setInterval(updateScroll, 200);
    return () => clearInterval(intervalId);
  }, [users]);

  // useEffect to set userGallery image size based on card width
  React.useEffect(() => {
    if (divRef.current) {
      const width = divRef.current.clientWidth;
      setImageSize(Math.round((width * 0.6) / 5));
    }
  }, [divRef]);

  const userGallery = users?.map((singleUser, i) => {
    return (
      <div key={i} className="flex flex-col items-center justify-center">
        <img
          src={singleUser.image}
          alt="current-active-user"
          className={
            "rounded-full object-cover border-4 " +
            (singleUser.is_cadet ? "border-[#009596]" : "border-[#f1b245]")
          }
          style={{ width: `${imageSize}px`, height: `${imageSize}px` }}
        />
        <p className="text-sm 2xl:text-base">{singleUser.login}</p>
      </div>
    );
  });

  return (
    <Card className={className + " flex flex-col max-h-[50vh]"}>
      <CardTitle>Current Active Users ({users?.length})</CardTitle>
      <div
        className="grid grid-cols-4 md:grid-cols-5 gap-4 overflow-hidden scroll-smooth h-full basis-0 grow shrink w-full"
        ref={divRef}
        id="user-gallery"
      >
        {users ? (
          userGallery
        ) : (
          <div className="col-span-5 h-full rounded bg-gray-500 animate-pulse"></div>
        )}
      </div>
    </Card>
  );
}

export default CurrentActiveUser;
