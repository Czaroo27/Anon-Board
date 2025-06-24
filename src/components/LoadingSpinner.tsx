import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="w-full h-full border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
          <div
            className="absolute inset-0 w-full h-full border-4 border-transparent border-r-purple-500 rounded-full animate-spin"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-1">
          Loading emotions...
        </h2>
        <p className="text-sm text-gray-400 sm:text-base">
          Connecting to the emotion board
        </p>
      </div>
    </div>
  );
};
