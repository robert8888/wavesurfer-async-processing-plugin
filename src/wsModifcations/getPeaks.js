export default async function getPeaksPromise(length, first, last) {
    const yieldIteration = this.params.yieldIteration || 16;

    if (this.peaks) {
        return Promise.resolve(this.peaks);
    }

    if (!this.buffer) {
        return Promise.resolve(this.params.splitChannels
            ? this.splitPeaks
            : this.mergedPeaks);
    }

    first = first || 0;
    last = last || length - 1;

    this.setLength(length);



    /**
     * The following snippet fixes a buffering data issue on the Safari
     * browser which returned undefined It creates the missing buffer based
     * on 1 channel, 4096 samples and the sampleRate from the current
     * webaudio context 4096 samples seemed to be the best fit for rendering
     * will review this code once a stable version of Safari TP is out
     */
    if (!this.buffer.length) {
        const newBuffer = this.createBuffer(1, 4096, this.sampleRate);
        this.buffer = newBuffer.buffer;
    }

    const sampleSize = this.buffer.length / length;
    const sampleStep = ~~(sampleSize / 10) || 1;
    const channels = this.buffer.numberOfChannels;
    let c;


    const getChannelPeaks = (channelData, peaks)  => {
        const getPeaksInRange = (from, to) => {
            return new Promise((res, rej) => {
                setTimeout(() => {
                    const begin = performance.now();
                    let i;
                    for (i = from; i < to; i++) {
                        const start = ~~(i * sampleSize);
                        const end = ~~(start + sampleSize);
                        /**
                         * Initialize the max and min to the first sample of this
                         * subrange, so that even if the samples are entirely
                         * on one side of zero, we still return the true max and
                         * min values in the subrange.
                         */
                        let min = channelData[start];
                        let max = min;

                        for (let j = start; j < end; j += sampleStep) {
                            const value = channelData[j];

                            if (value > max) {
                                max = value;
                            }

                            if (value < min) {
                                min = value;
                            }

                        }

                        peaks[2 * i] = max;
                        peaks[2 * i + 1] = min;

                        if (c === 0 || max > this.mergedPeaks[2 * i]) {
                            this.mergedPeaks[2 * i] = max;
                        }

                        if (c === 0 || min < this.mergedPeaks[2 * i + 1]) {
                            this.mergedPeaks[2 * i + 1] = min;
                        }

                        if(performance.now() - begin > yieldIteration){
                            return res(i);
                        }
                    }
                    return res(i);
                })
            })
        }

        return new Promise(async (res, rej) => {
            let done = first;
            while(done < last) {
                done = await getPeaksInRange(done, last)
            }
            res(true)
       })
    }



    for (c = 0; c < channels; c++) {
        const channelData = this.buffer.getChannelData(c);
        await getChannelPeaks(channelData,  this.splitPeaks[c]);
    }

    return this.params.splitChannels ? this.splitPeaks : this.mergedPeaks;
}
