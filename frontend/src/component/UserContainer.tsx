const UserContainer = ({
  imgSrc,
  login,
  extra,
}: {
  imgSrc: string;
  login: string;
  extra?: string;
}) => {
  return (
    <div className="flex flex-col items-center text-[#FFFFF] font-medium">
      <img
        className="rounded-full h-14 w-14 object-cover"
        src={imgSrc}
        alt="user"
      />
      <p className="text-sm 2xl:text-base">{login}</p>
      <b className="text-lg 2xl:text-xl">{extra}</b>
    </div>
  );
};

export default UserContainer;
