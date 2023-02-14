import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCreateEntryMutation() {
  return useMutation({
    mutationKey: ["createEntry"],
    mutationFn: async (postData: any) => {
      const { data } = await axios.post("/api/entry", postData);
      return data;
    },
  });
}

export function useGetEntriesQuery() {
  return useQuery({
    queryKey: ["getEntries"],
    queryFn: async () => {
      const { data } = await axios.get("/api/entries");
      return data;
    },
  });
}
