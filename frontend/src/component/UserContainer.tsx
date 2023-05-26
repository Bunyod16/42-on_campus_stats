const UserContainer = ({
  imgSrc,
  login,
  extra,
}: {
  imgSrc: string;
  login: string;
  extra?: string;
}) => (
  <div className="flex flex-col items-center  ">
    <img
      className="rounded-full h-12 w-12 xl:h-16 xl:w-16 object-cover"
      src={imgSrc}
      alt="user image"
    />
    <p className="text-sm">{login}</p>
    <b className="text-lg">{extra}</b>
  </div>
);

export default UserContainer;
