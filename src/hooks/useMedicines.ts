
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type Medicine = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  dosage: string | null;
  side_effects: string | null;
  storage: string | null;
  image_url: string | null;
};

export const useMedicines = () => {
  return useQuery({
    queryKey: ["medicines"],
    queryFn: async (): Promise<Medicine[]> => {
      const { data, error } = await supabase.from("medicines").select();
      
      if (error) {
        toast({
          title: "Error fetching medicines",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Medicine[];
    },
  });
};
