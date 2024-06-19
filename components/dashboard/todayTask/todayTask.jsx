const TodayTask = ({ tasks }) => {
  return (
    <div className="bg-white p-5 rounded-xl mt-10">
      <h2 className="mb-5 font-bold text-[#202224]">Today's Tasks</h2>
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
              <td className="table_data py-2">{item.Task}</td>
              <td className="table_data py-2">{item.Member}</td>
              <td className="table_data py-2">{item.TaskAssigned}</td>
              <td className="table_data py-2">{item.TaskCompleted}</td>
              <td className="table_data py-2">{item.Notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodayTask;
