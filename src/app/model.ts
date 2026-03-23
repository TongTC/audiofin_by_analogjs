
export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  voltage?: number; // สำหรับสินค้าบางประเภท เช่น Transistor อาจมี voltage
  price: number;
  type?: string; // สำหรับสินค้าบางประเภท เช่น Transistor อาจมี type (NPN, PNP)
  category?: string; // เพิ่ม category เพื่อใช้กรองสินค้า
  image?: string;
}