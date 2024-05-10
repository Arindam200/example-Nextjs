"use client";

import React from "react";
import { useEffect } from "react";
import { connect } from "./utils/Connect";
import * as Pieces from "@pieces.app/pieces-os-client";
import { Application } from "@pieces.app/pieces-os-client";
import { CopilotChat }  from "./components/Copilot/Copilot";

type LocalAsset = {
  name: string,
  id: string,
  classification: Pieces.ClassificationSpecificEnum,
}

export var applicationData: Application;

export default function Home() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const full_context = await connect();
        let _t = JSON.parse(JSON.stringify(full_context));
        const applicationData = _t.application;
        const osVersion = _t.health.os.version;
        console.log('Application Data: ', applicationData);
        localStorage.setItem("version", osVersion);
        console.log('OS Version: ', osVersion);
      } catch (error) {
        console.error('Failed to connect: ', error);
        // Handle the error as needed
      }
    };
  
    fetchData();
  }, []);

  return (
    <div>
      <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
        <div className="w-full max-w-screen-md bg-white p-4 rounded-lg shadow-md h-[700px]">
          <div className="mb-4 h-full ">
            <div className="">
              <div className="text-4xl text-center font-bold text-blue-800 mb-2">
              Pieces x Next.js Chatbot
              </div>
              <p className="text-gray-600 text-lg text-center">
                Welcome to the future of AI-powered assistant. Ask me anything!!!
              </p>
            </div>
            <CopilotChat />
          </div>
        </div>
      </div>
    </div>
  );
}
