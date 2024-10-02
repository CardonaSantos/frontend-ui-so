import { useEffect, useState } from "react";

import axios from "axios";
import { toast } from "sonner";
import { SalesType } from "../Utils/Types/Sales";
import TableSale from "../components/Tables/TableSale";
const API_URL = import.meta.env.VITE_API_URL;
function Sales() {
  const [sales, setSales] = useState<SalesType | null>(null);

  const getSales = async () => {
    try {
      const response = await axios.get(`${API_URL}/sale`);
      if (response.status === 200) {
        setSales(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("No hay ventas disponibles para ver");
    }
  };

  useEffect(() => {
    getSales();
  }, []);

  console.log(sales);

  return (
    <div className=" bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto py-10">
        <div className="">
          <div className="">
            <h2>Filtro Proximamente...</h2>
          </div>
          <TableSale sales={sales} />
        </div>
      </div>
    </div>
  );
}

export default Sales;
