import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

export default function useAdminProfile() {
  const [avatar, setAvatarState] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/profile")
      .then((res) => setAvatarState(res.data.avatar || ""))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setAvatar = useCallback(async (dataUrl) => {
    setAvatarState(dataUrl); // optimistic update
    await api.put("/api/profile", { avatar: dataUrl });
  }, []);

  return { avatar, setAvatar, loading };
}
