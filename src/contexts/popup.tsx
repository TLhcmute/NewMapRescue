import { Terminal } from "lucide-react";
import { useState, useEffect } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DrawerDemo() {
  const [data, setData] = useState<any>(null); // Updated type to handle different response structure
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to call the API and fetch the data
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://byteforce.caohoangphuc.id.vn/python/api/get_recomment_action_resuer"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result); // Store the response data
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to call once on mount

  if (loading) {
    return (
      <Alert>
        <AlertTitle>Loading...</AlertTitle>
      </Alert>
    ); // Show loading state
  }

  if (error) {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    ); // Show error state
  }

  // Assuming `data` is an object, display relevant info based on its structure
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Bạn nên làm gì tiếp theo?</AlertTitle>
      <AlertDescription>
        {data?.suggestion || "No suggestion available"}
      </AlertDescription>{" "}
      {/* Example to display specific data */}
    </Alert>
  );
}
