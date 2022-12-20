interface Events {
  "export-invoice": {
    onDone?: () => void;
  };
  "send-invoice": {
    onDone?: () => void;
  };
}
