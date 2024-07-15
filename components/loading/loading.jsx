const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-90">
      <div className="lg:ml-64 w-full lg:w-[calc(100%-16rem)] flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-48 w-48 border-t-4 border-b-4 border-indigo-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-32 w-32 bg-white rounded-full flex items-center justify-center">
              <div className="text-2xl font-bold text-indigo-500">
                Loading...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
