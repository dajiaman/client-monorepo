import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, errorMsg: "" };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorMsg: error.message };
  }

  override componentDidCatch(error: any, info: any) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    console.log(error, info.componentStack);
  }

  override render() {
    // @ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || <div>{this.state.errorMsg}</div>;
    }

    // @ts-ignore
    return this.props.children;
  }
}
