import Navbar from "../ui/dashboard/navbar/navbar.jsx";
import Sidebar from "../ui/dashboard/sidebar/sidebar.jsx";
import Footer from "../ui/dashboard/footer/footer.jsx";

const Layout = ({ children }) => {
  return (
    <div class="flex">
      <div class="flex bg-slate-400 p-5 min-h-screen">
        <Sidebar />
      </div>
      <div class="flex-4 p-5 mb-5">
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
