
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export type Speciality = {
  id: string;
  name: string;
  description: string;
  doctor_count: number;
  image_url: string | null;
};

export const useSpecialities = () => {
  return useQuery({
    queryKey: ["specialities"],
    queryFn: async (): Promise<Speciality[]> => {
      const { data, error } = await supabase.from("specialities").select();
      
      if (error) {
        toast({
          title: "Error fetching specialities",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Speciality[];
    },
  });
};
