const BookingToday = ({ bookings }) => {
  return (
    <div className="bg-white p-5 rounded-xl">
      <h2 className="mb-5 font-bold text-[#202224]">Today's Bookings</h2>
      <table className="w-full table-fixed">
        <thead>
          <tr className="table_row">
            <td>Room</td>
            <td>Name</td>
            <td>Check-in Date</td>
            <td>Check-out Date</td>
          </tr>
        </thead>
        <tbody>
          {bookings.map((item) => (
            <tr key={item.id}>
              <td className="table_data py-2">{item.Room}</td>
              <td className="table_data py-2">{item.Name}</td>
              <td className="table_data py-2">{item.CheckIn}</td>
              <td className="table_data py-2">{item.CheckOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingToday;
