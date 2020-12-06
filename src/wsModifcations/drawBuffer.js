export default function drawBuffer() {
    const nominalWidth = Math.round(
        this.getDuration() *
        this.params.minPxPerSec *
        this.params.pixelRatio
    );
    const parentWidth = this.drawer.getWidth();
    let width = nominalWidth;
    // always start at 0 after zooming for scrolling : issue redraw left part
    let start = 0;
    let end = Math.max(start + parentWidth, width);
    // Fill container
    if (
        this.params.fillParent &&
        (!this.params.scrollParent || nominalWidth < parentWidth)
    ) {
        width = parentWidth;
        start = 0;
        end = width;
    }

    let peaks;
    if (this.params.partialRender) {
        const newRanges = this.peakCache.addRangeToPeakCache(
            width,
            start,
            end
        );

        (async () => {
            this.fireEvent("processing")
            let i;
            let len = newRanges.length;
            for (i = 0; i < len; i++) {
                peaks = await this.backend.getPeaksAsync(
                    width,
                    newRanges[i][0],
                    newRanges[i][1]
                );
                this.drawer.drawPeaks(
                    peaks,
                    width,
                    newRanges[i][0],
                    newRanges[i][1]
                );
            }
            this.fireEvent("processed")
        })()
    } else {
        this.fireEvent("processing")
        this.backend.getPeaksAsync(width, start, end).then(peaks => {
            this.fireEvent("processed");
            this.drawer.drawPeaks(peaks, width, start, end);
            this.fireEvent('redraw', peaks, width);
        });
    }
}

