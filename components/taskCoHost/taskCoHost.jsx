const TaskCoHost = ({ tasks }) => {
    return (
      <div className="bg-slate-600 p-5 rounded-xl">
        <h2 className="mb-5 font-extralight text-[#202224]">Today's Bookings</h2>
        <table className="w-full">
          <thead>
            <tr>
              <td>Room</td>
              <td>Name</td>
              <td>Check-in Date</td>
              <td>Check-out Date</td>
              <td>Notes</td>
              <td>Status</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {bookings.map((item) => (
              <tr key={item.id}>
                <td>{item.Room}</td>
                <td>{item.Name}</td>
                <td>{item.CheckIn}</td>
                <td>{item.CheckOut}</td>
                <td>{item.Notes}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default TaskCoHost;
  