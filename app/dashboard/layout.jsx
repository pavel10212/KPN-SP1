import Navbar from "../ui/dashboard/navbar/navbar.jsx";
import Sidebar from "../ui/dashboard/sidebar/sidebar.jsx";
import Footer from "../ui/dashboard/footer/footer.jsx";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <div className="flex bg-green-400 p-5 min-h-screen">
        <Sidebar />
      </div>
      <div className="flex-4 p-5 mb-5">
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
