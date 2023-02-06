import React from "react";
import { Card, H1Style } from "../styles";
import { User } from "../../types";
import tw from "twin.macro";
import { getAllCurrentActiveUsers } from "../utils/service";

interface ICurrentActiveUserProps {
  className?: string;
}

const UserStyle = tw.div`
  flex flex-col items-center
  [> img]:(rounded-full h-10 w-10 object-cover)
  [> p]:(text-sm)
`;

const UserGalleryStyle = tw.div`
  grid grid-cols-5 justify-between gap-4 h-full overflow-auto
`;

function CurrentActiveUser({ className }: ICurrentActiveUserProps) {
  const [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      await fetch("https://backend-flask.onrender.com/api/on-campus/active-users")
        .then((response) => {
          if (response.ok){
            console.log("Successfully fetch Active Users Data");
            return response.json();
          };
        })
        .then((data) => setUsers(data.users))
        .catch((error) => {
          console.error(error);
        });
    };
    fetchUsers();

    // Call the API every 5 minutes
    const interval = setInterval(fetchUsers, 1000 * 60 * 1);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const userGallery = users.map((singleUser) => {
    return (
      <UserStyle>
        <img src={singleUser.image} width={32} height={32} alt="" />
        <p>{singleUser.login}</p>
      </UserStyle>
    );
  });

  return (
    <Card className={className + " flex flex-col"}>
      <H1Style>Current Active Users ({users.length})</H1Style>
      <UserGalleryStyle>{userGallery}</UserGalleryStyle>
    </Card>
  );
}

export default CurrentActiveUser;
