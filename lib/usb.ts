const vendors = [
  0x2341, // Arduino
  0x239a, // Adafruit
];

export async function requestDevice() {
  return navigator.usb.requestDevice({
    filters: vendors.map((vendorId) => ({ vendorId })),
  });
}
