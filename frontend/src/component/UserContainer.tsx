const UserContainer = ({
  imgSrc,
  login,
  extra,
}: {
  imgSrc: string;
  login: string;
  extra?: string;
}) => (
  <div className="flex flex-col items-center justify-center max-h-[84px] 2xl:h-[108px] ">
    <img
      className="rounded-full h-10 w-10 2xl:h-16 2xl:w-16 object-cover"
      src={imgSrc}
      alt="user image"
    />
    <p className="text-sm">{login}</p>
    {extra && <b className="2xl:text-lg">{extra}</b>}
  </div>
);

export default UserContainer;
