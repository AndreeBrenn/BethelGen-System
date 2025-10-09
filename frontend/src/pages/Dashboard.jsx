import { RxDashboard } from "react-icons/rx";
import { FiFileText } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { decodedUser } from "../utils/GlobalVariables";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const decode = decodedUser();
  const navigate = useNavigate();

  const pages = [
    { ID: 1, DEPARTMENT_NAME: "Claims" },
    { ID: 2, DEPARTMENT_NAME: "Underwriting" },
    { ID: 3, DEPARTMENT_NAME: "Policy Management" },
    { ID: 4, DEPARTMENT_NAME: "Customer Service" },
    { ID: 5, DEPARTMENT_NAME: "Procurement" },
    { ID: 6, DEPARTMENT_NAME: "Settings" },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        {/* Header Section */}
        <Navbar />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Core Modules Section */}

          {/* Departments Section */}
          {pages.filter((fil) => decode?.Access?.includes(fil.DEPARTMENT_NAME))
            .length > 0 && (
            <div>
              <div className="flex items-center mb-6">
                <div className="h-1 w-12 bg-blue-600 rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Departments
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages
                  .filter((fil) =>
                    decode?.Access?.includes(fil.DEPARTMENT_NAME)
                  )
                  .map((data) => (
                    <div
                      key={data.ID}
                      onClick={() => navigate(`/${data.DEPARTMENT_NAME}`)}
                      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-200 hover:border-blue-400 overflow-hidden"
                    >
                      <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      <div className="p-6 flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300">
                            <FiFileText className="text-2xl text-blue-600 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                            {data.DEPARTMENT_NAME}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Department Portal
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Active Modules</p>
                  <p className="text-3xl font-bold text-slate-800">0</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <RxDashboard className="text-2xl text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Access Level</p>
                  <p className="text-3xl font-bold text-slate-800">Full</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">System Status</p>
                  <p className="text-3xl font-bold text-green-600">Online</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
