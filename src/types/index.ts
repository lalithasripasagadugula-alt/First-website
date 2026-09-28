export type Role =
  | 'CUSTOMER'
  | 'OWNER'
  | 'PROCUREMENT_MANAGER'
  | 'INVENTORY_MANAGER'
  | 'SALES_MANAGER'
  | 'STAFF';

export interface Address {
  id: string;
  fullName: string;
  mobile: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: Role;
  addresses: Address[];
  createdAt: string;
}

export type MattressCategory =
  | 'Memory Foam'
  | 'Orthopedic'
  | 'Pocket Spring'
  | 'Bonnell Spring'
  | 'Natural Latex'
  | 'Luxury Hybrid'
  | 'Custom Size'
  | 'Budget Comfort'
  | 'Hotel Royal';

export type MattressStandardSize =
  | 'Single'
  | 'Twin'
  | 'Double'
  | 'Queen'
  | 'King'
  | 'Custom Size';

export interface MattressDimensions {
  length: number; // inches
  width: number;  // inches
  thickness: number; // inches
}

export interface ProductRatings {
  quality: number;   // 1 to 5
  comfort: number;   // 1 to 5
  support: number;   // 1 to 5
  durability: number;// 1 to 5
  value: number;     // 1 to 5
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: MattressCategory;
  tagline: string;
  description: string;
  images: string[];
  basePrice: number; // default Queen 6-inch
  discountPercent: number;
  thicknessOptions: number[]; // e.g., [6, 8, 10, 12]
  standardSizes: MattressStandardSize[];
  firmness: 'Plush (Soft)' | 'Medium Soft' | 'Balanced Medium' | 'Medium Firm' | 'Extra Firm Orthopedic';
  material: string;
  foamDensity: string;
  foamType: string;
  springType: string;
  coverMaterial: string;
  weightCapacityKg: number;
  warrantyYears: number;
  expectedLifespanYears: number;
  trialPeriodDays: number;
  emiStartingAt: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock' | 'coming_soon';
  ratings: ProductRatings;
  reviewsCount: number;
  certifications: string[];
  deliveryDays: number;
  returnPolicyDays: number;
  manufacturingDetails: string;
  careInstructions: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  estimatedManufacturingCost: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  size: MattressStandardSize;
  dimensions: MattressDimensions;
  thickness: number;
  quantity: number;
  unitPrice: number;
  total: number;
  isCustom: boolean;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Payment Confirmed'
  | 'Processing'
  | 'Manufacturing'
  | 'Quality Check'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentMethod = 'UPI' | 'Card' | 'NetBanking' | 'COD';

export interface OrderTrackingEvent {
  status: OrderStatus;
  timestamp: string;
  notes: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  orderStatus: OrderStatus;
  orderDate: string;
  expectedDeliveryDate: string;
  trackingHistory: OrderTrackingEvent[];
  estimatedCost: number;
  estimatedProfit: number;
  notes?: string;
}

export interface RawMaterial {
  id: string;
  name: string;
  category: 'Foam' | 'Springs' | 'Fabric' | 'Cover' | 'Adhesives' | 'Packaging' | 'Accessories';
  supplierId: string;
  supplierName: string;
  location: string;
  currentStock: number;
  unit: 'kg' | 'meters' | 'units' | 'liters' | 'rolls';
  pricePerUnit: number;
  minOrderQty: number;
  leadTimeDays: number;
  qualityGrade: 'A+' | 'A' | 'B+' | 'B';
  densitySpec: string;
  lastPurchasePrice: number;
  currentMarketPrice: number;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Critical';
  supplierContact: string;
  notes: string;
}

export interface Supplier {
  id: string;
  name: string;
  company: string;
  city: string;
  state: string;
  country: string;
  address: string;
  pincode: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  materialsSupplied: string[];
  qualityRating: number;      // 1 to 5
  reliabilityRating: number;  // 1 to 5
  avgLeadTimeDays: number;
  totalOrdersCount: number;
  notes: string;
}

export interface SupplierComparisonItem {
  id: string;
  materialName: string;
  supplierId: string;
  supplierName: string;
  location: string;
  materialPrice: number;
  transportCost: number;
  taxPercent: number;
  totalLandedCost: number;
  moq: number;
  leadTimeDays: number;
  qualityGrade: 'A+' | 'A' | 'B+' | 'B';
  qualityScore: number;     // 0 to 100
  reliabilityScore: number; // 0 to 100
  lastUpdated: string;
}

export interface ProcurementWeights {
  qualityWeight: number;    // default 35
  priceWeight: number;      // default 35
  deliveryWeight: number;   // default 15
  reliabilityWeight: number;// default 15
}

export interface ReadyMadeMattress {
  id: string;
  brand: string;
  model: string;
  supplierName: string;
  location: string;
  size: MattressStandardSize;
  thickness: number;
  material: string;
  qualityGrade: string;
  supplierPrice: number;
  transportCost: number;
  totalLandedCost: number;
  suggestedSellingPrice: number;
  expectedMarginPercent: number;
  availability: 'In Stock' | 'Pre-Order' | 'Out of Stock';
  warrantyYears: number;
  leadTimeDays: number;
}

export interface BOMComponent {
  materialId: string;
  materialName: string;
  quantityRequired: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

export interface BillOfMaterials {
  id: string;
  productId: string;
  productName: string;
  standardSize: MattressStandardSize;
  thickness: number;
  components: BOMComponent[];
  laborCost: number;
  packagingCost: number;
  transportCost: number;
  overheadCost: number;
  totalCost: number;
}

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  size: MattressStandardSize;
  thickness: number;
  startDate: string;
  completionDate?: string;
  status: 'Planned' | 'In Production' | 'Quality Check' | 'Completed' | 'Rejected';
  materialsConsumed: { materialName: string; quantity: number; unit: string; cost: number }[];
  totalProductionCost: number;
  assignedLine: string;
  notes: string;
}

export interface QualityCheckRecord {
  id: string;
  batchNumber: string;
  productionOrderId: string;
  productId: string;
  productName: string;
  inspectionDate: string;
  inspectorName: string;
  foamDensityCheck: boolean;
  dimensionsCheck: boolean;
  thicknessCheck: boolean;
  firmnessCheck: boolean;
  stitchingQualityCheck: boolean;
  coverQualityCheck: boolean;
  visualInspectionCheck: boolean;
  packagingInspectionCheck: boolean;
  overallStatus: 'Passed' | 'Failed' | 'Needs Rework';
  qcNotes: string;
}

export interface InventoryTransaction {
  id: string;
  date: string;
  type:
    | 'Stock In'
    | 'Stock Out'
    | 'Adjustment'
    | 'Manufacturing Consumption'
    | 'Sales Deduction'
    | 'Damaged'
    | 'Returned';
  itemCategory: 'Raw Material' | 'Finished Mattress' | 'Ready-Made' | 'Packaging';
  itemName: string;
  quantity: number;
  unit: string;
  referenceNumber: string;
  notes: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageCount: number;
  usageLimit: number;
}

export interface CustomerReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  isApproved: boolean;
  verifiedPurchase: boolean;
}

export interface NotificationItem {
  id: string;
  audience: 'customer' | 'owner';
  userId?: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'inventory' | 'qc' | 'supplier' | 'promo';
  read: boolean;
  link?: string;
}

export interface CompanySettings {
  brandName: string;
  tagline: string;
  gstNumber: string;
  panNumber: string;
  businessAddress: string;
  city: string;
  state: string;
  pincode: string;
  supportPhone: string;
  supportEmail: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  gstRatePercent: number;
  customRatePerCubicInch: number;
  returnPolicyDays: number;
  warrantyPolicyYears: number;
  currencySymbol: string;
}
