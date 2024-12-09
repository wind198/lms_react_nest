import React from "react";
import { Outlet } from "react-router";

export default function Students() {
  return (
    <div className="students">
      <Outlet />
    </div>
  );
}
