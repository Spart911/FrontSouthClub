interface YooMoneyCheckoutWidget {
  new (config: {
    confirmation_token: string;
    return_url: string;
    error_callback: (error: any) => void;
  }): {
    render: (containerId: string) => void;
  };
}

declare global {
  interface Window {
    YooMoneyCheckoutWidget: YooMoneyCheckoutWidget;
  }
} 