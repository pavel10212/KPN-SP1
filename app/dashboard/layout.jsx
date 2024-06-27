import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/sidebar/sidebar";
import Footer from "@/components/footer/footer";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <div className="flex bg-white p-5 min-h-screen">
        <Sidebar />
      </div>
      <div className="flex-4 p-5 mb-5 w-full">
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;