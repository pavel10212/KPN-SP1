import TeamMembersDropdown from "./TeamMembersDropdown";
import UserInfo from "./UserInfo";

const Header = ({ user, teamMembers }) => (
  <header className="bg-indigo-700 text-white p-4 shadow-md">
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <TeamMembersDropdown teamMembers={teamMembers} />
        <h1 className="text-xl font-bold ml-4">Team Chat</h1>
      </div>
      {user?.team?.name && (
        <h2 className="text-l font-semibold hidden sm:block">
          {user.team.name}
        </h2>
      )}
      {user && <UserInfo user={user} />}
    </div>
  </header>
);

export default Header;
