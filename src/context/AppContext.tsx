import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Product,
  Order,
  OrderItem,
  OrderStatus,
  RawMaterial,
  Supplier,
  SupplierComparisonItem,
  ProcurementWeights,
  ReadyMadeMattress,
  BillOfMaterials,
  ProductionOrder,
  QualityCheckRecord,
  InventoryTransaction,
  Coupon,
  CustomerReview,
  NotificationItem,
  CompanySettings,
  Role,
  Address,
  MattressStandardSize,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_RAW_MATERIALS,
  INITIAL_SUPPLIER_COMPARISONS,
  INITIAL_PROCUREMENT_WEIGHTS,
  INITIAL_READY_MADE_MATTRESSES,
  INITIAL_BOMS,
  INITIAL_PRODUCTION_ORDERS,
  INITIAL_QUALITY_CHECKS,
  INITIAL_ORDERS,
  INITIAL_INVENTORY_TRANSACTIONS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COMPANY_SETTINGS,
  INITIAL_USERS,
} from '../data/demoData';

interface AppContextType {
  // Authentication & Portals
  currentCustomer: User | null;
  currentOwner: User | null;
  customerLogin: (identifier: string, pass: string) => { success: boolean; error?: string };
  customerRegister: (data: {
    name: string;
    mobile: string;
    email: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  }) => { success: boolean; error?: string };
  customerLogout: () => void;
  updateCustomerProfile: (data: Partial<User>) => void;
  saveCustomerAddress: (address: Address) => void;

  ownerLogin: (identifier: string, pass: string, role?: Role) => { success: boolean; error?: string };
  ownerLogout: () => void;

  // Cart & Commerce
  cart: OrderItem[];
  addToCart: (item: OrderItem) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist & Comparison
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  comparedProducts: string[];
  toggleCompare: (productId: string) => void;
  clearComparison: () => void;

  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;

  // Raw Materials
  rawMaterials: RawMaterial[];
  addRawMaterial: (material: RawMaterial) => void;
  updateRawMaterial: (material: RawMaterial) => void;
  deleteRawMaterial: (id: string) => void;

  // Suppliers & Procurement
  suppliers: Supplier[];
  supplierComparisons: SupplierComparisonItem[];
  procurementWeights: ProcurementWeights;
  updateProcurementWeights: (weights: ProcurementWeights) => void;
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;
  addOrUpdateComparison: (item: SupplierComparisonItem) => void;

  // Ready-Made Mattresses
  readyMadeMattresses: ReadyMadeMattress[];
  addReadyMadeMattress: (item: ReadyMadeMattress) => void;
  updateReadyMadeMattress: (item: ReadyMadeMattress) => void;

  // Manufacturing & BOM
  boms: BillOfMaterials[];
  productionOrders: ProductionOrder[];
  addBOM: (bom: BillOfMaterials) => void;
  updateBOM: (bom: BillOfMaterials) => void;
  createProductionOrder: (order: ProductionOrder) => void;
  updateProductionOrderStatus: (id: string, status: ProductionOrder['status']) => void;

  // Quality Control
  qualityChecks: QualityCheckRecord[];
  recordQualityCheck: (qc: QualityCheckRecord) => void;

  // Inventory
  inventoryTransactions: InventoryTransaction[];
  recordInventoryTransaction: (tx: InventoryTransaction) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  toggleCouponStatus: (id: string) => void;

  // Reviews
  reviews: CustomerReview[];
  addReview: (review: CustomerReview) => void;
  toggleReviewApproval: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;

  // Settings & Helpers
  settings: CompanySettings;
  updateSettings: (newSettings: CompanySettings) => void;
  calculateMattressPrice: (
    product: Product,
    size: MattressStandardSize,
    thickness: number,
    customDimensions?: { length: number; width: number; thickness: number }
  ) => { originalPrice: number; finalPrice: number; discountAmount: number };
  resetAllDataToDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'dreamnest_erp_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or fallback to demo data
  const [isLoaded, setIsLoaded] = useState(false);

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentCustomer, setCurrentCustomer] = useState<User | null>(INITIAL_USERS[0]); // Rahul Sharma logged in by default for smooth exploration
  const [currentOwner, setCurrentOwner] = useState<User | null>(null);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(['prod-ortho-pro', 'prod-hybrid-monarch']);
  const [comparedProducts, setComparedProducts] = useState<string[]>(['prod-ortho-pro', 'prod-cloud-memory']);

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(INITIAL_RAW_MATERIALS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [supplierComparisons, setSupplierComparisons] = useState<SupplierComparisonItem[]>(INITIAL_SUPPLIER_COMPARISONS);
  const [procurementWeights, setProcurementWeights] = useState<ProcurementWeights>(INITIAL_PROCUREMENT_WEIGHTS);
  const [readyMadeMattresses, setReadyMadeMattresses] = useState<ReadyMadeMattress[]>(INITIAL_READY_MADE_MATTRESSES);
  const [boms, setBoms] = useState<BillOfMaterials[]>(INITIAL_BOMS);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(INITIAL_PRODUCTION_ORDERS);
  const [qualityChecks, setQualityChecks] = useState<QualityCheckRecord[]>(INITIAL_QUALITY_CHECKS);
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>(INITIAL_INVENTORY_TRANSACTIONS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<CompanySettings>(INITIAL_COMPANY_SETTINGS);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.rawMaterials) setRawMaterials(parsed.rawMaterials);
        if (parsed.suppliers) setSuppliers(parsed.suppliers);
        if (parsed.supplierComparisons) setSupplierComparisons(parsed.supplierComparisons);
        if (parsed.procurementWeights) setProcurementWeights(parsed.procurementWeights);
        if (parsed.readyMadeMattresses) setReadyMadeMattresses(parsed.readyMadeMattresses);
        if (parsed.boms) setBoms(parsed.boms);
        if (parsed.productionOrders) setProductionOrders(parsed.productionOrders);
        if (parsed.qualityChecks) setQualityChecks(parsed.qualityChecks);
        if (parsed.inventoryTransactions) setInventoryTransactions(parsed.inventoryTransactions);
        if (parsed.coupons) setCoupons(parsed.coupons);
        if (parsed.reviews) setReviews(parsed.reviews);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.currentCustomer) setCurrentCustomer(parsed.currentCustomer);
        if (parsed.currentOwner) setCurrentOwner(parsed.currentOwner);
        if (parsed.cart) setCart(parsed.cart);
        if (parsed.wishlist) setWishlist(parsed.wishlist);
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to LocalStorage on updates
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToStore = {
        products,
        orders,
        rawMaterials,
        suppliers,
        supplierComparisons,
        procurementWeights,
        readyMadeMattresses,
        boms,
        productionOrders,
        qualityChecks,
        inventoryTransactions,
        coupons,
        reviews,
        notifications,
        settings,
        users,
        currentCustomer,
        currentOwner,
        cart,
        wishlist,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
    } catch {
      // ignore quota limits
    }
  }, [
    isLoaded,
    products,
    orders,
    rawMaterials,
    suppliers,
    supplierComparisons,
    procurementWeights,
    readyMadeMattresses,
    boms,
    productionOrders,
    qualityChecks,
    inventoryTransactions,
    coupons,
    reviews,
    notifications,
    settings,
    users,
    currentCustomer,
    currentOwner,
    cart,
    wishlist,
  ]);

  // Auth: Customer
  const customerLogin = (identifier: string, _pass: string) => {
    const trimmed = identifier.trim().toLowerCase();
    const found = users.find(
      (u) => (u.email.toLowerCase() === trimmed || u.mobile === trimmed) && u.role === 'CUSTOMER'
    );
    if (found) {
      setCurrentCustomer(found);
      return { success: true };
    }
    // Also allow instant customer registration or login for testing
    if (trimmed) {
      const newCust: User = {
        id: `cust-${Date.now()}`,
        name: trimmed.includes('@') ? trimmed.split('@')[0] : 'Valued Customer',
        email: trimmed.includes('@') ? trimmed : `${trimmed}@example.com`,
        mobile: trimmed.includes('@') ? '9876500000' : trimmed,
        role: 'CUSTOMER',
        createdAt: new Date().toISOString(),
        addresses: [
          {
            id: `addr-${Date.now()}`,
            fullName: trimmed.includes('@') ? trimmed.split('@')[0] : 'Valued Customer',
            mobile: trimmed.includes('@') ? '9876500000' : trimmed,
            line1: '123 Dream St, Green Park',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500034',
            isDefault: true,
          },
        ],
      };
      setUsers((prev) => [...prev, newCust]);
      setCurrentCustomer(newCust);
      return { success: true };
    }
    return { success: false, error: 'Please enter a valid email or mobile number.' };
  };

  const customerRegister = (data: {
    name: string;
    mobile: string;
    email: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  }) => {
    const newUser: User = {
      id: `cust-${Date.now()}`,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      role: 'CUSTOMER',
      createdAt: new Date().toISOString(),
      addresses: [
        {
          id: `addr-${Date.now()}`,
          fullName: data.name,
          mobile: data.mobile,
          line1: data.line1,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          isDefault: true,
        },
      ],
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentCustomer(newUser);
    return { success: true };
  };

  const customerLogout = () => {
    setCurrentCustomer(null);
  };

  const updateCustomerProfile = (data: Partial<User>) => {
    if (!currentCustomer) return;
    const updated = { ...currentCustomer, ...data };
    setCurrentCustomer(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const saveCustomerAddress = (address: Address) => {
    if (!currentCustomer) return;
    const existing = currentCustomer.addresses.findIndex((a) => a.id === address.id);
    let newAddresses: Address[];
    if (existing >= 0) {
      newAddresses = currentCustomer.addresses.map((a) => (a.id === address.id ? address : a));
    } else {
      newAddresses = [...currentCustomer.addresses, address];
    }
    if (address.isDefault) {
      newAddresses = newAddresses.map((a) => ({
        ...a,
        isDefault: a.id === address.id,
      }));
    }
    updateCustomerProfile({ addresses: newAddresses });
  };

  // Auth: Owner
  const ownerLogin = (identifier: string, _pass: string, chosenRole: Role = 'OWNER') => {
    const trimmed = identifier.trim().toLowerCase();
    // Check registered owner users or allow direct sign-in for owner/management
    const found = users.find(
      (u) =>
        (u.email.toLowerCase() === trimmed || u.id === trimmed) &&
        u.role !== 'CUSTOMER'
    );
    if (found) {
      setCurrentOwner(found);
      return { success: true };
    }
    // Allow owner login with default credentials / owner email
    const ownerUser: User = {
      id: `owner-${Date.now()}`,
      name:
        chosenRole === 'OWNER'
          ? 'Vikramaditya Roy (Owner)'
          : chosenRole === 'PROCUREMENT_MANAGER'
          ? 'Anita Verma (Procurement)'
          : chosenRole === 'INVENTORY_MANAGER'
          ? 'Suresh Patil (Inventory)'
          : 'Staff Member',
      email: trimmed || 'owner@dreamnest.com',
      mobile: '9900011223',
      role: chosenRole,
      createdAt: new Date().toISOString(),
      addresses: [],
    };
    setCurrentOwner(ownerUser);
    return { success: true };
  };

  const ownerLogout = () => {
    setCurrentOwner(null);
  };

  // Cart operations
  const addToCart = (item: OrderItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.size === item.size &&
          i.thickness === item.thickness &&
          (!item.isCustom ||
            (i.dimensions.length === item.dimensions.length &&
              i.dimensions.width === item.dimensions.width))
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + item.quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          total: newQty * updated[existingIndex].unitPrice,
        };
        return updated;
      }
      return [...prev, item];
    });

    addNotification({
      audience: 'customer',
      title: 'Added to Bag',
      message: `${item.productName} (${item.size} · ${item.thickness}") added to your cart.`,
      type: 'order',
    });
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          quantity,
          total: quantity * updated[index].unitPrice,
        };
      }
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    const cartSubtotal = cart.reduce((acc, i) => acc + i.total, 0);
    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `This coupon requires a minimum cart value of ${settings.currencySymbol}${found.minOrderValue}.`,
      };
    }
    setAppliedCoupon(found);
    return {
      success: true,
      message: `Coupon ${found.code} applied! You save ${
        found.discountType === 'flat'
          ? `${settings.currencySymbol}${found.value}`
          : `${found.value}%`
      }.`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Comparison
  const toggleCompare = (productId: string) => {
    setComparedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), productId];
      }
      return [...prev, productId];
    });
  };

  const clearComparison = () => {
    setComparedProducts([]);
  };

  // Products CRUD
  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Orders
  const placeOrder = (orderData: Partial<Order>): Order => {
    const orderNumber = `DN-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerId: currentCustomer?.id || 'guest',
      customerName: orderData.customerName || currentCustomer?.name || 'Customer',
      customerEmail: orderData.customerEmail || currentCustomer?.email || '',
      customerMobile: orderData.customerMobile || currentCustomer?.mobile || '',
      shippingAddress:
        orderData.shippingAddress ||
        currentCustomer?.addresses[0] || {
          id: 'addr-default',
          fullName: 'Customer',
          mobile: '9876543210',
          line1: '123 Main St',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500001',
          isDefault: true,
        },
      items: orderData.items || [...cart],
      subtotal: orderData.subtotal || 0,
      deliveryCharge: orderData.deliveryCharge || 0,
      discount: orderData.discount || 0,
      tax: orderData.tax || 0,
      total: orderData.total || 0,
      paymentMethod: orderData.paymentMethod || 'UPI',
      paymentStatus: 'Paid',
      orderStatus: 'Payment Confirmed',
      orderDate: new Date().toISOString(),
      expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      trackingHistory: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          notes: 'Order initiated online.',
        },
        {
          status: 'Payment Confirmed',
          timestamp: new Date().toISOString(),
          notes: `Payment verified via ${orderData.paymentMethod || 'UPI'}.`,
        },
      ],
      estimatedCost: (orderData.subtotal || 0) * 0.55,
      estimatedProfit: (orderData.subtotal || 0) * 0.45,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Record sales deduction inventory transaction
    newOrder.items.forEach((item) => {
      recordInventoryTransaction({
        id: `tx-${Date.now()}-${Math.random()}`,
        date: new Date().toISOString(),
        type: 'Sales Deduction',
        itemCategory: item.isCustom ? 'Raw Material' : 'Finished Mattress',
        itemName: `${item.productName} (${item.size})`,
        quantity: item.quantity,
        unit: 'units',
        referenceNumber: newOrder.orderNumber,
        notes: `Order placed by ${newOrder.customerName}`,
      });
    });

    // Notify Customer
    addNotification({
      audience: 'customer',
      userId: currentCustomer?.id,
      title: 'Order Confirmed!',
      message: `Your order #${newOrder.orderNumber} for ₹${newOrder.total.toLocaleString()} has been placed.`,
      type: 'order',
    });

    // Notify Owner
    addNotification({
      audience: 'owner',
      title: 'New Customer Order',
      message: `Order #${newOrder.orderNumber} received from ${newOrder.customerName} (₹${newOrder.total.toLocaleString()}).`,
      type: 'order',
    });

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, notes?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const newEvent = {
            status,
            timestamp: new Date().toISOString(),
            notes: notes || `Order updated to ${status}.`,
          };
          return {
            ...o,
            orderStatus: status,
            trackingHistory: [...o.trackingHistory, newEvent],
          };
        }
        return o;
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      addNotification({
        audience: 'customer',
        userId: targetOrder.customerId,
        title: `Order Status: ${status}`,
        message: `Your order #${targetOrder.orderNumber} is now: ${status}.`,
        type: 'order',
      });
    }
  };

  // Raw materials CRUD
  const addRawMaterial = (material: RawMaterial) => {
    setRawMaterials((prev) => [material, ...prev]);
  };
  const updateRawMaterial = (material: RawMaterial) => {
    setRawMaterials((prev) => prev.map((m) => (m.id === material.id ? material : m)));
  };
  const deleteRawMaterial = (id: string) => {
    setRawMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  // Suppliers CRUD
  const addSupplier = (supplier: Supplier) => {
    setSuppliers((prev) => [supplier, ...prev]);
  };
  const updateSupplier = (supplier: Supplier) => {
    setSuppliers((prev) => prev.map((s) => (s.id === supplier.id ? supplier : s)));
  };
  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  // Supplier Comparison
  const addOrUpdateComparison = (item: SupplierComparisonItem) => {
    setSupplierComparisons((prev) => {
      const idx = prev.findIndex((c) => c.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = item;
        return copy;
      }
      return [...prev, item];
    });
  };

  const updateProcurementWeights = (weights: ProcurementWeights) => {
    setProcurementWeights(weights);
  };

  // Ready made
  const addReadyMadeMattress = (item: ReadyMadeMattress) => {
    setReadyMadeMattresses((prev) => [item, ...prev]);
  };
  const updateReadyMadeMattress = (item: ReadyMadeMattress) => {
    setReadyMadeMattresses((prev) => prev.map((rm) => (rm.id === item.id ? item : rm)));
  };

  // Manufacturing & BOM
  const addBOM = (bom: BillOfMaterials) => {
    setBoms((prev) => [bom, ...prev]);
  };
  const updateBOM = (bom: BillOfMaterials) => {
    setBoms((prev) => prev.map((b) => (b.id === bom.id ? bom : b)));
  };

  const createProductionOrder = (order: ProductionOrder) => {
    setProductionOrders((prev) => [order, ...prev]);

    // Record consumption if in production
    if (order.materialsConsumed.length > 0) {
      order.materialsConsumed.forEach((m) => {
        recordInventoryTransaction({
          id: `tx-${Date.now()}-${Math.random()}`,
          date: new Date().toISOString(),
          type: 'Manufacturing Consumption',
          itemCategory: 'Raw Material',
          itemName: m.materialName,
          quantity: m.quantity,
          unit: m.unit,
          referenceNumber: order.orderNumber,
          notes: `Batch ${order.batchNumber} consumption`,
        });
      });
    }

    addNotification({
      audience: 'owner',
      title: 'Production Order Created',
      message: `Production Order #${order.orderNumber} initiated for ${order.quantity} units of ${order.productName}.`,
      type: 'inventory',
    });
  };

  const updateProductionOrderStatus = (id: string, status: ProductionOrder['status']) => {
    setProductionOrders((prev) =>
      prev.map((po) => {
        if (po.id === id) {
          return {
            ...po,
            status,
            completionDate: status === 'Completed' ? new Date().toISOString().split('T')[0] : po.completionDate,
          };
        }
        return po;
      })
    );
  };

  // Quality Control
  const recordQualityCheck = (qc: QualityCheckRecord) => {
    setQualityChecks((prev) => [qc, ...prev]);

    if (qc.overallStatus === 'Passed') {
      addNotification({
        audience: 'owner',
        title: 'QC Passed',
        message: `Batch ${qc.batchNumber} (${qc.productName}) passed quality inspection.`,
        type: 'qc',
      });
    } else {
      addNotification({
        audience: 'owner',
        title: 'QC Alert: Non-Compliance',
        message: `Batch ${qc.batchNumber} flagged as ${qc.overallStatus}. Notes: ${qc.qcNotes}`,
        type: 'qc',
      });
    }
  };

  // Inventory Transactions
  const recordInventoryTransaction = (tx: InventoryTransaction) => {
    setInventoryTransactions((prev) => [tx, ...prev]);
  };

  // Coupons
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
  };
  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Reviews
  const addReview = (review: CustomerReview) => {
    setReviews((prev) => [review, ...prev]);
    addNotification({
      audience: 'owner',
      title: 'New Customer Review Pending',
      message: `${review.customerName} submitted a ${review.rating}★ review for ${review.productName}.`,
      type: 'promo',
    });
  };
  const toggleReviewApproval = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApproved: !r.isApproved } : r))
    );
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newItem: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newItem, ...prev]);
  };

  // Settings
  const updateSettings = (newSettings: CompanySettings) => {
    setSettings(newSettings);
  };

  // Dynamic Mattress Price Calculation
  const calculateMattressPrice = (
    product: Product,
    size: MattressStandardSize,
    thickness: number,
    customDimensions?: { length: number; width: number; thickness: number }
  ) => {
    // Baseline is Queen 6-inch
    const base = product.basePrice;

    // Size multipliers
    const sizeMultipliers: Record<MattressStandardSize, number> = {
      Single: 0.65,
      Twin: 0.72,
      Double: 0.85,
      Queen: 1.0,
      King: 1.25,
      'Custom Size': 1.0,
    };

    let calculatedOriginal = base * (sizeMultipliers[size] || 1.0);

    // Thickness adjustment: +12% per 2 inches above 6"
    if (thickness > 6) {
      const extraInches = thickness - 6;
      calculatedOriginal += base * (extraInches / 2) * 0.12;
    } else if (thickness < 6) {
      calculatedOriginal -= base * 0.08;
    }

    // Custom Dimensions Calculation:
    // If Custom Size, calculate based on volume (length * width * thickness)
    if (size === 'Custom Size' && customDimensions) {
      const { length, width, thickness: customThick } = customDimensions;
      const volumeCubicInches = length * width * customThick;
      // standard queen 78 * 60 * 6 = 28,080 cubic inches
      const standardQueenVolume = 78 * 60 * 6;
      const ratio = volumeCubicInches / standardQueenVolume;
      // Apply custom base rate
      calculatedOriginal = Math.round(base * ratio * 1.05); // slight custom tooling factor
    }

    calculatedOriginal = Math.round(calculatedOriginal);
    const discountAmount = Math.round((calculatedOriginal * product.discountPercent) / 100);
    const finalPrice = calculatedOriginal - discountAmount;

    return {
      originalPrice: calculatedOriginal,
      finalPrice,
      discountAmount,
    };
  };

  const resetAllDataToDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setRawMaterials(INITIAL_RAW_MATERIALS);
    setSuppliers(INITIAL_SUPPLIERS);
    setSupplierComparisons(INITIAL_SUPPLIER_COMPARISONS);
    setProcurementWeights(INITIAL_PROCUREMENT_WEIGHTS);
    setReadyMadeMattresses(INITIAL_READY_MADE_MATTRESSES);
    setBoms(INITIAL_BOMS);
    setProductionOrders(INITIAL_PRODUCTION_ORDERS);
    setQualityChecks(INITIAL_QUALITY_CHECKS);
    setInventoryTransactions(INITIAL_INVENTORY_TRANSACTIONS);
    setCoupons(INITIAL_COUPONS);
    setReviews(INITIAL_REVIEWS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_COMPANY_SETTINGS);
    setUsers(INITIAL_USERS);
    setCurrentCustomer(INITIAL_USERS[0]);
    setCurrentOwner(null);
    setCart([]);
    setWishlist(['prod-ortho-pro', 'prod-hybrid-monarch']);
    setComparedProducts(['prod-ortho-pro', 'prod-cloud-memory']);
    setAppliedCoupon(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentCustomer,
        currentOwner,
        customerLogin,
        customerRegister,
        customerLogout,
        updateCustomerProfile,
        saveCustomerAddress,
        ownerLogin,
        ownerLogout,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        wishlist,
        toggleWishlist,
        comparedProducts,
        toggleCompare,
        clearComparison,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        placeOrder,
        updateOrderStatus,
        rawMaterials,
        addRawMaterial,
        updateRawMaterial,
        deleteRawMaterial,
        suppliers,
        supplierComparisons,
        procurementWeights,
        updateProcurementWeights,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addOrUpdateComparison,
        readyMadeMattresses,
        addReadyMadeMattress,
        updateReadyMadeMattress,
        boms,
        productionOrders,
        addBOM,
        updateBOM,
        createProductionOrder,
        updateProductionOrderStatus,
        qualityChecks,
        recordQualityCheck,
        inventoryTransactions,
        recordInventoryTransaction,
        coupons,
        addCoupon,
        toggleCouponStatus,
        reviews,
        addReview,
        toggleReviewApproval,
        notifications,
        markNotificationRead,
        addNotification,
        settings,
        updateSettings,
        calculateMattressPrice,
        resetAllDataToDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  };
  return context;
};
