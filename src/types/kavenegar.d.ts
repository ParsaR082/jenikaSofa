declare module 'kavenegar' {
  interface KavenegarOptions {
    apikey: string;
    host?: string;
  }

  interface KavenegarInstance {
    Send(
      options: {
        sender?: string;
        receptor: string | string[];
        message: string;
        date?: number;
        type?: string;
        localid?: string;
      },
      callback: (response: any, status: number) => void
    ): void;
    
    VerifyLookup(
      options: {
        receptor: string;
        token: string;
        token2?: string;
        token3?: string;
        template: string;
        type?: string;
      },
      callback: (response: any, status: number) => void
    ): void;
    // Add other methods as needed
  }

  function KavenegarApi(options: KavenegarOptions): KavenegarInstance;

  export { KavenegarApi };
} 