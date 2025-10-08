import { useNavigate } from "react-router-dom";

const MissingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-900 overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src="/img/5.jpg"
          alt="404 Error"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            backgroundPosition: "center",
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            transform: "scale(1.1)",
            animation: "parallax 10s ease-in-out infinite",
          }}
        />

        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div
          className="z-10 text-center"
          style={{
            animation: "fadeIn 1.5s ease-in-out",
          }}
        >
          <h1
            className="text-white text-8xl font-extrabold tracking-wide mb-6 drop-shadow-lg"
            style={{
              animation: "bounce 1.5s infinite",
            }}
          >
            ERROR 404
          </h1>
          <p
            className="text-white text-3xl mb-10 tracking-widest"
            style={{
              animation: "fadeInUp 2s ease-in-out",
            }}
          >
            PAGE NOT FOUND!
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white text-[1.5rem] p-3 rounded-lg shadow-lg transition duration-500 ease-in-out transform hover:scale-110 hover:shadow-2xl relative"
            style={{
              width: "200px",
              height: "60px",
              animation: "glow 2s ease-in-out infinite alternate",
            }}
          >
            GO BACK
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissingPage;
