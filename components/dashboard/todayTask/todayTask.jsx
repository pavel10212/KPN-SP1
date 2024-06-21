const TodayTask = ({ tasks }) => {
  return (
    <div className="bg-white p-5 rounded-xl mt-10">
      <h2 className="mb-5  text-[#202224] font-bold">Today&apos;s Tasks</h2>
      <table className="w-full">
        <thead>
          <tr className="table_row">
            <td>Task</td>
            <td>Member</td>
            <td>Task-Assigned</td>
            <td>Task-Completion</td>
            <td>Notes</td>
          </tr>
        </thead>
        <tbody>
          {tasks.map((item) => (
            <tr key={item.id}>
              <td className="table_data">{item.Task}</td>
              <td className="table_data">{item.Member}</td>
              <td className="table_data">{item.TaskAssigned}</td>
              <td className="table_data">{item.TaskCompleted}</td>
              <td className="table_data">{item.Notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodayTask;
