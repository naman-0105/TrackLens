import { useEffect, useRef } from "react";
import { socket } from "../services/socket";

export const useRealtimeReload = (reload: () => void) => {
  const reloadRef = useRef(reload);
  
  useEffect(() => {
    reloadRef.current = reload;
  }, [reload]);

  useEffect(() => {
    const handleUpdate = () => {
      reloadRef.current();
    };

    socket.on("analytics:update", handleUpdate);

    return () => {
      socket.off("analytics:update", handleUpdate);
    };
  }, []);
};
