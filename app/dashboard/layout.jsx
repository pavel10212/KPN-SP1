// app/dashboard/layout.js
import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/sidebar/sidebar";
import Footer from "@/components/footer/footer";
import { LoadingWrapper } from "@/components/loading/loadingWrapper";

const DashboardLayout = ({ children }) => {
  return (
    <LoadingWrapper>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar className="w-64 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0" />
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <Navbar className="sticky top-0 z-40" />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="mx-auto pt-5 pb-2 px-4 sm:px-0">{children}</div>
          </main>
          <Footer />
        </div>
      </div>
    </LoadingWrapper>
  );
};

export default DashboardLayout;
