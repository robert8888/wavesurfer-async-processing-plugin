import drawBuffer from "./wsModifcations/drawBuffer";
import getPeaksAsync from "./wsModifcations/getPeaks";
import loadDecodedBuffer from "./wsModifcations/loadDecodedBuffer";

export default class PeaksPromisficationPlugin {
    static create(params) {
        return {
            name: 'PeaksPromisfication',
            deferInit: params && params.deferInit ? params.deferInit : false,
            params: params,
            staticProps: {},
            instance: PeaksPromisficationPlugin
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
