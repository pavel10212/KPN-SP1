import Image from "next/image";

const UserInfo = ({ user }) => (
  <div className="flex items-center justify-end pr-3">
    <div className="text-right mr-2">
      <p className="font-semibold text-sm">{user.name || user.email}</p>
      <p className="text-xs opacity-75">Team: {user.teamId}</p>
    </div>
    <Image
      src={user.image || "/noavatar.png"}
      alt={user.name || user.email}
      width={40}
      height={40}
      className="rounded-full"
    />
  </div>
);

export default UserInfo;
