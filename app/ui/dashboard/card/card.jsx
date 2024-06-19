import { MdSupervisedUserCircle } from "react-icons/md";

const Card = ({ item }) => {
  return (
    <div className="bg-[color:var(--bgSoft)">
      <MdSupervisedUserCircle size={24} />
      <div className="flex flex-col gap-5">
        <span className="text-sm font-semibold">{item.title}</span>
        <span className="text-sm">{item.number}</span>
        <span className="text-sm">
          <span className={item.change > 0 ? "text-lime-400" : "text-red-700"}>
            {item.change}%
          </span>{" "}
          {item.change > 0 ? "more" : "less"} than previous week
        </span>
      </div>
    </div>
  );
};

export default Card;

