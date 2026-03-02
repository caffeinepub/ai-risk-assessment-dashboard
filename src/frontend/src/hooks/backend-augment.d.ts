export {};

declare module "../backend" {
  interface backendInterface {
    _initializeAccessControlWithSecret(adminToken: string): Promise<void>;
  }
  // Extend the Backend class to include the method as well
  interface Backend {
    _initializeAccessControlWithSecret(adminToken: string): Promise<void>;
  }
}
