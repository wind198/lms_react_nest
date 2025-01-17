import React from "react";
import { Outlet } from "react-router";

export default function Rooms() {
  return (
    <div className="rooms">
      <Outlet />
    </div>
  );
}
