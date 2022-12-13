import React from "react";
import { Card } from "../styles";
import { User } from "../../types";
import tw from "twin.macro";
import { getAllCurrentActiveUsers } from "../utils/service";

interface ICurrentActiveUserProps {
  className?: string;
}

const tmpUserList: User[] = [
  {
    login: "jatan",
    image:
      "https://cdn.pixabay.com/photo/2019/05/21/05/07/animal-4218265__480.jpg",
    id: "1",
  },
  {
    login: "jatan",
    image:
      "https://cdn.pixabay.com/photo/2019/05/21/05/07/animal-4218265__480.jpg",
    id: "1",
  },
];

const UserStyle = tw.div`
  [> img]:(rounded-full h-12 w-12 object-cover)
  
`;

const UserGalleryStyle = tw.div`
  flex gap-2
`;

function CurrentActiveUser({ className }: ICurrentActiveUserProps) {
  const [userList, setUserList] = React.useState<User[]>([]);

  // React.useEffect(() => {
  //   getAllCurrentActiveUsers().then((users) => {
  //     setUserList(users);
  //     console.log(userList);
  //   });
  // }, []);

  const userGallery = tmpUserList.map((singleUser) => {
    return (
      <UserStyle>
        <img src={singleUser.image} width={50} height={50} alt="" />
        <p>{singleUser.login}</p>
      </UserStyle>
    );
  });

  return (
    <Card className={className}>
      <>
        <h1>Current Active Users:</h1>
        <UserGalleryStyle>{userGallery}</UserGalleryStyle>
      </>
    </Card>
  );
}

export default CurrentActiveUser;
