import React from "react";
import { User } from "../../types";
import axios from "axios";
import CardTitle from "./CardTitle";
import Card from "./Card";

function CurrentActiveUser({ className }: { className: string }) {
  const [users, setUsers] = React.useState<User[] | undefined>(undefined);
  const divRef = React.useRef(null);

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

  const userGallery = users?.map((singleUser, i) => {
    return (
      <div key={i} className="flex flex-col items-center">
        <img
          src={singleUser.image}
          alt="user image"
          className={
            "rounded-full h-16 w-16 object-cover border-4 " +
            (singleUser.is_cadet ? "border-[#009596]" : "border-[#f1b245]")
          }
        />
        <p className="text-sm">{singleUser.login}</p>
      </div>
    );
  });

  return (
    <Card className={className + " flex flex-col max-h-[50vh]"}>
      <CardTitle>Current Active Users ({users?.length})</CardTitle>
      <div
        className="grid grid-cols-5 gap-4 overflow-hidden scroll-smooth h-full basis-0 grow shrink w-full"
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
