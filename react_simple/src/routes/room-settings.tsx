import React from "react";
import { Outlet } from "react-router";

export default function RoomSettings() {
  return (
    <div className="room-settings">
      <Outlet />
    </div>
  );
}
