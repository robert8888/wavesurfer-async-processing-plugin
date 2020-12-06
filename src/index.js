import drawBuffer from "./wsModifcations/drawBuffer";
import getPeaksAsync from "./wsModifcations/getPeaks";
import loadDecodedBuffer from "./wsModifcations/loadDecodedBuffer";

export default class PeaksAsyncPlugin {
    static create(params) {
        return {
            name: 'PeaksAsyncPlugin',
            deferInit: params && params.deferInit ? params.deferInit : false,
            params: params,
            staticProps: {},
            instance: PeaksAsyncPlugin
        };
    }


    defaultParams = {
        yieldIteration: 16
    };


    constructor(params, ws) {
        ws.drawBuffer = drawBuffer;

        ws.Backend.prototype.getPeaksAsync = getPeaksAsync;

        ws.loadDecodedBuffer = loadDecodedBuffer;

        ws.params.yieldIteration = params.yieldIteration || this.defaultParams.yieldIteration;
    }


    init() {
    }


    destroy() {
    }
}


