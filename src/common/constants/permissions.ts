export const PERMISSIONS = {
  // Products
  PRODUCT_READ:   'product:read',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',

  // Customers
  CUSTOMER_READ:   'customer:read',
  CUSTOMER_CREATE: 'customer:create',
  CUSTOMER_UPDATE: 'customer:update',
  CUSTOMER_DELETE: 'customer:delete',

  // Sales
  SALE_READ:   'sale:read',
  SALE_CREATE: 'sale:create',

  // Dashboard
  DASHBOARD_READ: 'dashboard:read',

  // Roles (admin only)
  ROLE_MANAGE: 'role:manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Default permission sets per role
export const DEFAULT_ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: Object.values(PERMISSIONS) as Permission[],
  manager: [
    PERMISSIONS.PRODUCT_READ, PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_UPDATE,
    PERMISSIONS.CUSTOMER_READ, PERMISSIONS.CUSTOMER_CREATE, PERMISSIONS.CUSTOMER_UPDATE,
    PERMISSIONS.SALE_READ, PERMISSIONS.SALE_CREATE,
    PERMISSIONS.DASHBOARD_READ,
  ],
  employee: [
    PERMISSIONS.PRODUCT_READ,
    PERMISSIONS.SALE_READ, PERMISSIONS.SALE_CREATE,
    PERMISSIONS.DASHBOARD_READ,
  ],
};
