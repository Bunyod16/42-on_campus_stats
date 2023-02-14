import React from "react";
import { Card, H1Style } from "../styles";
import { User } from "../../types";
import tw from "twin.macro";
import axios from "axios";
// import { getAllCurrentActiveUsers } from "../utils/service";
interface ICurrentActiveUserProps {
  className?: string;
}

const UserStyle = tw.div`
  flex flex-col items-center
  [> img]:(rounded-full h-10 w-10 object-cover)
  [> p]:(text-sm)
`;

const UserGalleryStyle = tw.div`
  grid grid-cols-5 gap-4 overflow-hidden scroll-smooth h-full basis-0 grow shrink w-full
`;

const tmp = [
  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },

  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },

  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },

  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },

  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },

  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },

  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },
  { image: "", login: "random" },
];

function CurrentActiveUser({ className }: ICurrentActiveUserProps) {
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
      <UserStyle key={i}>
        <img
          src={singleUser.image}
          width={32}
          height={32}
          alt=""
          className={
            "border-2 " +
            (singleUser.is_cadet ? "border-[#009596]" : "border-[#f1b245]")
          }
        />
        <p
          className={singleUser.is_cadet ? "text-[#009596]" : "text-[#f1b245]"}
        >
          {singleUser.login}
        </p>
      </UserStyle>
    );
  });

  return (
    <Card className={className + " flex flex-col max-h-[50vh]"}>
      <H1Style>Current Active Users ({users?.length})</H1Style>
      <UserGalleryStyle ref={divRef} id="user-gallery">
        {users ? (
          userGallery
        ) : (
          <div className="col-span-5 h-full rounded bg-gray-500 animate-pulse"></div>
        )}
      </UserGalleryStyle>
    </Card>
  );
}

export default CurrentActiveUser;
