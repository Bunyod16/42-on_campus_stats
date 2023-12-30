const UserContainer = ({
  imgSrc,
  login,
  extra,
  imgSize,
}: {
  imgSrc: string;
  login: string;
  extra?: string;
  imgSize?: number;
}) => {
  return (
    <div className="flex flex-col items-center text-[#FFFFF] font-medium">
      <img
        className="rounded-full object-cover"
        style={{
          width: `${imgSize !== 0 ? imgSize : 64}px`,
          height: `${imgSize !== 0 ? imgSize : 64}px`,
        }}
        src={imgSrc}
        alt="user"
      />
      <p className="text-sm xl:text-base 2xl:text-lg">{login}</p>
      <b className="text-lg xl:text-xl 2xl:text-2xl">{extra}</b>
    </div>
  );
};

export default UserContainer;
