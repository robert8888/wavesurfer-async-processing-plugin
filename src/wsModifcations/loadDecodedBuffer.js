export default function loadDecodedBuffer(buffer) {
    this.backend.load(buffer);
    this.fireEvent("buffered")
    this.drawBuffer();
    this.isReady = true;
    this.fireEvent('ready');
}