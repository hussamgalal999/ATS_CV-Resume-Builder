import React from "react";
import Builder from "./builder";
import Link from "next/link";

const ResumeBuilder = () => {
  return (
    <div>
      <Builder />
      <div className="text-center mt-8">
        <Link href="/rate">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Rate your CV/Resume</button>
        </Link>
      </div>
    </div>
  );
};

export default ResumeBuilder;

