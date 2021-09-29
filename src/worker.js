/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "dgram":
/*!************************!*\
  !*** external "dgram" ***!
  \************************/
/***/ ((module) => {

module.exports = require("dgram");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/worker.ts ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var dgram__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dgram */ "dgram");
/* harmony import */ var dgram__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dgram__WEBPACK_IMPORTED_MODULE_0__);

const socket = new WebSocket("ws://localhost:8000");
const convertSlotToNumber = (slot) => {
    switch (slot) {
        case "first":
            return 1;
        case "second":
            return 2;
        case "third":
            return 3;
        case "fourth":
            return 4;
        case "fifth":
            return 5;
        case "sixth":
            return 6;
        case "seventh":
            return 7;
        case "eighth":
            return 8;
        case "ninth":
            return 9;
        case "tenth":
            return 10;
        default:
            throw new Error("slot out of range");
    }
};
onmessage = (event) => {
    const dgramSocket = dgram__WEBPACK_IMPORTED_MODULE_0__.createSocket("udp4");
    const frameToClientListeners = [];
    const onVideoroomEntered = async (response) => {
        if (response.status === "error") {
            console.log("error entering videoroom");
        }
        else {
            const readable = event.data.readable;
            const writables = {
                first: event.data.writables.first,
                second: event.data.writables.second,
                third: event.data.writables.third,
                fourth: event.data.writables.fourth,
                fifth: event.data.writables.fifth,
                sixth: event.data.writables.sixth,
                seventh: event.data.writables.seventh,
                eighth: event.data.writables.eighth,
                ninth: event.data.writables.ninth,
                tenth: event.data.writables.tenth,
            };
            console.log("writables", writables);
            for (const currentSlot of [
                "first",
                "second",
                "third",
                "fourth",
                "fifth",
                "sixth",
                "seventh",
                "eighth",
                "ninth",
                "tenth",
            ]) {
                const writer = writables[currentSlot]?.getWriter();
                if (writer === undefined) {
                    console.log("writer is undefined");
                }
                if (writer !== undefined) {
                    const handleFrame = (frame) => {
                        writer.write(frame);
                    };
                    // @ts-ignore
                    const decoder = new VideoDecoder({
                        output: handleFrame,
                        error: (err) => {
                            console.log("decoder error", err);
                        },
                    });
                    decoder.configure({
                        codec: "vp8",
                        codedWidth: 640,
                        codedHeight: 480,
                    });
                    console.log("setting up socket listener", currentSlot);
                    const listener = (typedArray) => {
                        const slotByte = typedArray[typedArray.length - 1];
                        if (convertSlotToNumber(currentSlot) === slotByte) {
                            const timestampByte1 = typedArray[typedArray.length - 6];
                            const timestampByte2 = typedArray[typedArray.length - 5];
                            const timestampByte3 = typedArray[typedArray.length - 4];
                            const timestampByte4 = typedArray[typedArray.length - 3];
                            const chunkTypeByte = typedArray[typedArray.length - 2];
                            const timestampPart1 = timestampByte1;
                            const timestampPart2 = timestampByte2 << 8;
                            const timestampPart3 = timestampByte3 << 16;
                            const timestampPart4 = timestampByte4 << 24;
                            const timestamp = timestampPart1 &
                                timestampPart2 &
                                timestampPart3 &
                                timestampPart4;
                            const chunkType = chunkTypeByte === 1 ? "delta" : "key";
                            // @ts-ignore
                            const chunk = new EncodedVideoChunk({
                                timestamp,
                                type: chunkType,
                                data: typedArray.subarray(0, typedArray.length - 6),
                            });
                            decoder.decode(chunk);
                        }
                    };
                    frameToClientListeners.push(listener);
                }
            }
            const reader = readable.getReader();
            const handleEncodedVideo = (chunk, metadata) => {
                const miscLength = 6;
                const textEncoder = new TextEncoder();
                const videoroomIdBytes = textEncoder.encode(event.data.videoroomId);
                const chunkData = new Uint8Array(chunk.byteLength + miscLength + videoroomIdBytes.length + 1);
                chunk.copyTo(chunkData);
                const timestampByte1 = 0xff & chunk.timestamp;
                const timestampByte2 = 0xff & (chunk.timestamp >> 8);
                const timestampByte3 = 0xff & (chunk.timestamp >> 16);
                const timestampByte4 = 0xff & (chunk.timestamp >> 24);
                const chunkTypeByte = chunk.type === "delta" ? 1 : 2;
                chunkData.set([
                    timestampByte1,
                    timestampByte2,
                    timestampByte3,
                    timestampByte4,
                    chunkTypeByte,
                    convertSlotToNumber(event.data.slot),
                ], chunk.byteLength);
                chunkData.set(videoroomIdBytes, chunk.byteLength + miscLength);
                chunkData.set([videoroomIdBytes.length], chunk.byteLength + miscLength + videoroomIdBytes.length);
                dgramSocket.send(chunkData, 3000, "127.0.0.1");
                console.log(chunk, metadata);
            };
            const handleCodecError = (err) => {
                console.log("encoder error", err);
            };
            // @ts-ignore
            const videoEncoder = new VideoEncoder({
                output: handleEncodedVideo,
                error: handleCodecError,
            });
            videoEncoder.configure({
                codec: "vp8",
                width: 640,
                height: 480,
                bitrate: 1000000,
                framerate: 30,
            });
            let frameCounter = 0;
            while (true) {
                const result = await reader.read();
                if (result.done)
                    break;
                const videoFrame = result.value;
                if (videoEncoder.encodeQueueSize > 2) {
                    // Too many frames in flight, encoder is overwhelmed
                    // let's drop this frame.
                    videoFrame.close();
                }
                else {
                    frameCounter++;
                    const insert_keyframe = frameCounter % 150 == 0;
                    videoEncoder.encode(videoFrame, { keyFrame: insert_keyframe });
                    videoFrame.close();
                }
            }
        }
    };
    socket.onmessage = (event) => {
        if (typeof event.data === "string") {
            const response = JSON.parse(event.data);
            onVideoroomEntered(response);
        }
    };
    dgramSocket.on("message", (msg) => {
        for (const listener of frameToClientListeners) {
            const typedArray = new Uint8Array(msg);
            listener(typedArray);
        }
    });
    dgramSocket.bind(undefined, '127.0.0.1', () => {
        const sendVideoroomRequest = () => {
            socket.send(JSON.stringify({
                videoroomId: event.data.videoroomId,
                slot: event.data.slot,
                idToken: event.data.idToken,
                datagramPort: dgramSocket.address().port,
            }));
        };
        console.log("dgram address", dgramSocket.address());
        if (socket.readyState === 1) {
            sendVideoroomRequest();
        }
        else {
            socket.onopen = () => {
                sendVideoroomRequest();
            };
        }
    });
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUU7WUFDaEMsTUFBTSxDQUFDLElBQUksQ0FDVCxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNiLFdBQVcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ25DLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUk7Z0JBQ3JCLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU87Z0JBQzNCLFlBQVksRUFBRSxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSTthQUN6QyxDQUFDLENBQ0gsQ0FBQztRQUNKLENBQUMsQ0FBQztRQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRXBELElBQUksTUFBTSxDQUFDLFVBQVUsS0FBSyxDQUFDLEVBQUU7WUFDM0Isb0JBQW9CLEVBQUUsQ0FBQztTQUN4QjthQUFNO1lBQ0wsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7Z0JBQ25CLG9CQUFvQixFQUFFLENBQUM7WUFDekIsQ0FBQyxDQUFDO1NBQ0g7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3Jhem9ybWFmaWEtd2ViL2V4dGVybmFsIGNvbW1vbmpzMiBcImRncmFtXCIiLCJ3ZWJwYWNrOi8vcmF6b3JtYWZpYS13ZWIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcmF6b3JtYWZpYS13ZWIvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vcmF6b3JtYWZpYS13ZWIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3Jhem9ybWFmaWEtd2ViL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcmF6b3JtYWZpYS13ZWIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9yYXpvcm1hZmlhLXdlYi8uL3NyYy93b3JrZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZGdyYW1cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAqIGFzIGRncmFtIGZyb20gXCJkZ3JhbVwiO1xyXG5cclxuY29uc3Qgc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vbG9jYWxob3N0OjgwMDBcIik7XHJcblxyXG5jb25zdCBjb252ZXJ0U2xvdFRvTnVtYmVyID0gKHNsb3Q6IHN0cmluZyk6IG51bWJlciA9PiB7XHJcbiAgc3dpdGNoIChzbG90KSB7XHJcbiAgICBjYXNlIFwiZmlyc3RcIjpcclxuICAgICAgcmV0dXJuIDE7XHJcbiAgICBjYXNlIFwic2Vjb25kXCI6XHJcbiAgICAgIHJldHVybiAyO1xyXG4gICAgY2FzZSBcInRoaXJkXCI6XHJcbiAgICAgIHJldHVybiAzO1xyXG4gICAgY2FzZSBcImZvdXJ0aFwiOlxyXG4gICAgICByZXR1cm4gNDtcclxuICAgIGNhc2UgXCJmaWZ0aFwiOlxyXG4gICAgICByZXR1cm4gNTtcclxuICAgIGNhc2UgXCJzaXh0aFwiOlxyXG4gICAgICByZXR1cm4gNjtcclxuICAgIGNhc2UgXCJzZXZlbnRoXCI6XHJcbiAgICAgIHJldHVybiA3O1xyXG4gICAgY2FzZSBcImVpZ2h0aFwiOlxyXG4gICAgICByZXR1cm4gODtcclxuICAgIGNhc2UgXCJuaW50aFwiOlxyXG4gICAgICByZXR1cm4gOTtcclxuICAgIGNhc2UgXCJ0ZW50aFwiOlxyXG4gICAgICByZXR1cm4gMTA7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzbG90IG91dCBvZiByYW5nZVwiKTtcclxuICB9XHJcbn07XHJcblxyXG5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHtcclxuICBjb25zdCBkZ3JhbVNvY2tldCA9IGRncmFtLmNyZWF0ZVNvY2tldChcInVkcDRcIik7XHJcbiAgY29uc3QgZnJhbWVUb0NsaWVudExpc3RlbmVyczogKCh0eXBlZEFycmF5OiBVaW50OEFycmF5KSA9PiB2b2lkKVtdID0gW107XHJcblxyXG4gIGNvbnN0IG9uVmlkZW9yb29tRW50ZXJlZCA9IGFzeW5jIChyZXNwb25zZTogeyBzdGF0dXM6IHN0cmluZyB9KSA9PiB7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSBcImVycm9yXCIpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJlcnJvciBlbnRlcmluZyB2aWRlb3Jvb21cIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCByZWFkYWJsZTogUmVhZGFibGVTdHJlYW0gPSBldmVudC5kYXRhLnJlYWRhYmxlO1xyXG4gICAgICBjb25zdCB3cml0YWJsZXM6IHtcclxuICAgICAgICBmaXJzdD86IFdyaXRhYmxlU3RyZWFtO1xyXG4gICAgICAgIHNlY29uZD86IFdyaXRhYmxlU3RyZWFtO1xyXG4gICAgICAgIHRoaXJkPzogV3JpdGFibGVTdHJlYW07XHJcbiAgICAgICAgZm91cnRoPzogV3JpdGFibGVTdHJlYW07XHJcbiAgICAgICAgZmlmdGg/OiBXcml0YWJsZVN0cmVhbTtcclxuICAgICAgICBzaXh0aD86IFdyaXRhYmxlU3RyZWFtO1xyXG4gICAgICAgIHNldmVudGg/OiBXcml0YWJsZVN0cmVhbTtcclxuICAgICAgICBlaWdodGg/OiBXcml0YWJsZVN0cmVhbTtcclxuICAgICAgICBuaW50aD86IFdyaXRhYmxlU3RyZWFtO1xyXG4gICAgICAgIHRlbnRoPzogV3JpdGFibGVTdHJlYW07XHJcbiAgICAgIH0gPSB7XHJcbiAgICAgICAgZmlyc3Q6IGV2ZW50LmRhdGEud3JpdGFibGVzLmZpcnN0LFxyXG4gICAgICAgIHNlY29uZDogZXZlbnQuZGF0YS53cml0YWJsZXMuc2Vjb25kLFxyXG4gICAgICAgIHRoaXJkOiBldmVudC5kYXRhLndyaXRhYmxlcy50aGlyZCxcclxuICAgICAgICBmb3VydGg6IGV2ZW50LmRhdGEud3JpdGFibGVzLmZvdXJ0aCxcclxuICAgICAgICBmaWZ0aDogZXZlbnQuZGF0YS53cml0YWJsZXMuZmlmdGgsXHJcbiAgICAgICAgc2l4dGg6IGV2ZW50LmRhdGEud3JpdGFibGVzLnNpeHRoLFxyXG4gICAgICAgIHNldmVudGg6IGV2ZW50LmRhdGEud3JpdGFibGVzLnNldmVudGgsXHJcbiAgICAgICAgZWlnaHRoOiBldmVudC5kYXRhLndyaXRhYmxlcy5laWdodGgsXHJcbiAgICAgICAgbmludGg6IGV2ZW50LmRhdGEud3JpdGFibGVzLm5pbnRoLFxyXG4gICAgICAgIHRlbnRoOiBldmVudC5kYXRhLndyaXRhYmxlcy50ZW50aCxcclxuICAgICAgfTtcclxuICAgICAgY29uc29sZS5sb2coXCJ3cml0YWJsZXNcIiwgd3JpdGFibGVzKTtcclxuXHJcbiAgICAgIGZvciAoY29uc3QgY3VycmVudFNsb3Qgb2YgW1xyXG4gICAgICAgIFwiZmlyc3RcIixcclxuICAgICAgICBcInNlY29uZFwiLFxyXG4gICAgICAgIFwidGhpcmRcIixcclxuICAgICAgICBcImZvdXJ0aFwiLFxyXG4gICAgICAgIFwiZmlmdGhcIixcclxuICAgICAgICBcInNpeHRoXCIsXHJcbiAgICAgICAgXCJzZXZlbnRoXCIsXHJcbiAgICAgICAgXCJlaWdodGhcIixcclxuICAgICAgICBcIm5pbnRoXCIsXHJcbiAgICAgICAgXCJ0ZW50aFwiLFxyXG4gICAgICBdIGFzIGNvbnN0KSB7XHJcbiAgICAgICAgY29uc3Qgd3JpdGVyID0gd3JpdGFibGVzW2N1cnJlbnRTbG90XT8uZ2V0V3JpdGVyKCk7XHJcblxyXG4gICAgICAgIGlmICh3cml0ZXIgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJ3cml0ZXIgaXMgdW5kZWZpbmVkXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHdyaXRlciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBjb25zdCBoYW5kbGVGcmFtZSA9IChmcmFtZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIHdyaXRlci53cml0ZShmcmFtZSk7XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgIGNvbnN0IGRlY29kZXIgPSBuZXcgVmlkZW9EZWNvZGVyKHtcclxuICAgICAgICAgICAgb3V0cHV0OiBoYW5kbGVGcmFtZSxcclxuICAgICAgICAgICAgZXJyb3I6IChlcnI6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVjb2RlciBlcnJvclwiLCBlcnIpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVjb2Rlci5jb25maWd1cmUoe1xyXG4gICAgICAgICAgICBjb2RlYzogXCJ2cDhcIixcclxuICAgICAgICAgICAgY29kZWRXaWR0aDogNjQwLFxyXG4gICAgICAgICAgICBjb2RlZEhlaWdodDogNDgwLFxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIHVwIHNvY2tldCBsaXN0ZW5lclwiLCBjdXJyZW50U2xvdCk7XHJcblxyXG4gICAgICAgICAgY29uc3QgbGlzdGVuZXIgPSAodHlwZWRBcnJheTogVWludDhBcnJheSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzbG90Qnl0ZSA9IHR5cGVkQXJyYXlbdHlwZWRBcnJheS5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb252ZXJ0U2xvdFRvTnVtYmVyKGN1cnJlbnRTbG90KSA9PT0gc2xvdEJ5dGUpIHtcclxuICAgICAgICAgICAgICBjb25zdCB0aW1lc3RhbXBCeXRlMSA9IHR5cGVkQXJyYXlbdHlwZWRBcnJheS5sZW5ndGggLSA2XSE7XHJcbiAgICAgICAgICAgICAgY29uc3QgdGltZXN0YW1wQnl0ZTIgPSB0eXBlZEFycmF5W3R5cGVkQXJyYXkubGVuZ3RoIC0gNV0hO1xyXG4gICAgICAgICAgICAgIGNvbnN0IHRpbWVzdGFtcEJ5dGUzID0gdHlwZWRBcnJheVt0eXBlZEFycmF5Lmxlbmd0aCAtIDRdITtcclxuICAgICAgICAgICAgICBjb25zdCB0aW1lc3RhbXBCeXRlNCA9IHR5cGVkQXJyYXlbdHlwZWRBcnJheS5sZW5ndGggLSAzXSE7XHJcbiAgICAgICAgICAgICAgY29uc3QgY2h1bmtUeXBlQnl0ZSA9IHR5cGVkQXJyYXlbdHlwZWRBcnJheS5sZW5ndGggLSAyXTtcclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgdGltZXN0YW1wUGFydDEgPSB0aW1lc3RhbXBCeXRlMTtcclxuICAgICAgICAgICAgICBjb25zdCB0aW1lc3RhbXBQYXJ0MiA9IHRpbWVzdGFtcEJ5dGUyIDw8IDg7XHJcbiAgICAgICAgICAgICAgY29uc3QgdGltZXN0YW1wUGFydDMgPSB0aW1lc3RhbXBCeXRlMyA8PCAxNjtcclxuICAgICAgICAgICAgICBjb25zdCB0aW1lc3RhbXBQYXJ0NCA9IHRpbWVzdGFtcEJ5dGU0IDw8IDI0O1xyXG4gICAgICAgICAgICAgIGNvbnN0IHRpbWVzdGFtcCA9XHJcbiAgICAgICAgICAgICAgICB0aW1lc3RhbXBQYXJ0MSAmXHJcbiAgICAgICAgICAgICAgICB0aW1lc3RhbXBQYXJ0MiAmXHJcbiAgICAgICAgICAgICAgICB0aW1lc3RhbXBQYXJ0MyAmXHJcbiAgICAgICAgICAgICAgICB0aW1lc3RhbXBQYXJ0NDtcclxuICAgICAgICAgICAgICBjb25zdCBjaHVua1R5cGUgPSBjaHVua1R5cGVCeXRlID09PSAxID8gXCJkZWx0YVwiIDogXCJrZXlcIjtcclxuXHJcbiAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgIGNvbnN0IGNodW5rID0gbmV3IEVuY29kZWRWaWRlb0NodW5rKHtcclxuICAgICAgICAgICAgICAgIHRpbWVzdGFtcCxcclxuICAgICAgICAgICAgICAgIHR5cGU6IGNodW5rVHlwZSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHR5cGVkQXJyYXkuc3ViYXJyYXkoMCwgdHlwZWRBcnJheS5sZW5ndGggLSA2KSxcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICBkZWNvZGVyLmRlY29kZShjaHVuayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBmcmFtZVRvQ2xpZW50TGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcmVhZGVyID0gcmVhZGFibGUuZ2V0UmVhZGVyKCk7XHJcblxyXG4gICAgICBjb25zdCBoYW5kbGVFbmNvZGVkVmlkZW8gPSAoY2h1bms6IGFueSwgbWV0YWRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG1pc2NMZW5ndGggPSA2O1xyXG4gICAgICAgIGNvbnN0IHRleHRFbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XHJcbiAgICAgICAgY29uc3QgdmlkZW9yb29tSWRCeXRlcyA9IHRleHRFbmNvZGVyLmVuY29kZShldmVudC5kYXRhLnZpZGVvcm9vbUlkKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2h1bmtEYXRhID0gbmV3IFVpbnQ4QXJyYXkoXHJcbiAgICAgICAgICBjaHVuay5ieXRlTGVuZ3RoICsgbWlzY0xlbmd0aCArIHZpZGVvcm9vbUlkQnl0ZXMubGVuZ3RoICsgMVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY2h1bmsuY29weVRvKGNodW5rRGF0YSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRpbWVzdGFtcEJ5dGUxID0gMHhmZiAmIGNodW5rLnRpbWVzdGFtcDtcclxuICAgICAgICBjb25zdCB0aW1lc3RhbXBCeXRlMiA9IDB4ZmYgJiAoY2h1bmsudGltZXN0YW1wID4+IDgpO1xyXG4gICAgICAgIGNvbnN0IHRpbWVzdGFtcEJ5dGUzID0gMHhmZiAmIChjaHVuay50aW1lc3RhbXAgPj4gMTYpO1xyXG4gICAgICAgIGNvbnN0IHRpbWVzdGFtcEJ5dGU0ID0gMHhmZiAmIChjaHVuay50aW1lc3RhbXAgPj4gMjQpO1xyXG4gICAgICAgIGNvbnN0IGNodW5rVHlwZUJ5dGUgPSBjaHVuay50eXBlID09PSBcImRlbHRhXCIgPyAxIDogMjtcclxuXHJcbiAgICAgICAgY2h1bmtEYXRhLnNldChcclxuICAgICAgICAgIFtcclxuICAgICAgICAgICAgdGltZXN0YW1wQnl0ZTEsXHJcbiAgICAgICAgICAgIHRpbWVzdGFtcEJ5dGUyLFxyXG4gICAgICAgICAgICB0aW1lc3RhbXBCeXRlMyxcclxuICAgICAgICAgICAgdGltZXN0YW1wQnl0ZTQsXHJcbiAgICAgICAgICAgIGNodW5rVHlwZUJ5dGUsXHJcbiAgICAgICAgICAgIGNvbnZlcnRTbG90VG9OdW1iZXIoZXZlbnQuZGF0YS5zbG90KSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICBjaHVuay5ieXRlTGVuZ3RoXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjaHVua0RhdGEuc2V0KHZpZGVvcm9vbUlkQnl0ZXMsIGNodW5rLmJ5dGVMZW5ndGggKyBtaXNjTGVuZ3RoKTtcclxuICAgICAgICBjaHVua0RhdGEuc2V0KFxyXG4gICAgICAgICAgW3ZpZGVvcm9vbUlkQnl0ZXMubGVuZ3RoXSxcclxuICAgICAgICAgIGNodW5rLmJ5dGVMZW5ndGggKyBtaXNjTGVuZ3RoICsgdmlkZW9yb29tSWRCeXRlcy5sZW5ndGhcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBkZ3JhbVNvY2tldC5zZW5kKGNodW5rRGF0YSwgMzAwMCwgXCIxMjcuMC4wLjFcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2coY2h1bmssIG1ldGFkYXRhKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IGhhbmRsZUNvZGVjRXJyb3IgPSAoZXJyOiBhbnkpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImVuY29kZXIgZXJyb3JcIiwgZXJyKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgY29uc3QgdmlkZW9FbmNvZGVyID0gbmV3IFZpZGVvRW5jb2Rlcih7XHJcbiAgICAgICAgb3V0cHV0OiBoYW5kbGVFbmNvZGVkVmlkZW8sXHJcbiAgICAgICAgZXJyb3I6IGhhbmRsZUNvZGVjRXJyb3IsXHJcbiAgICAgIH0pO1xyXG4gICAgICB2aWRlb0VuY29kZXIuY29uZmlndXJlKHtcclxuICAgICAgICBjb2RlYzogXCJ2cDhcIixcclxuICAgICAgICB3aWR0aDogNjQwLFxyXG4gICAgICAgIGhlaWdodDogNDgwLFxyXG4gICAgICAgIGJpdHJhdGU6IDFfMDAwXzAwMCxcclxuICAgICAgICBmcmFtZXJhdGU6IDMwLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGxldCBmcmFtZUNvdW50ZXIgPSAwO1xyXG4gICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlYWRlci5yZWFkKCk7XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHQuZG9uZSkgYnJlYWs7XHJcblxyXG4gICAgICAgIGNvbnN0IHZpZGVvRnJhbWUgPSByZXN1bHQudmFsdWU7XHJcbiAgICAgICAgaWYgKHZpZGVvRW5jb2Rlci5lbmNvZGVRdWV1ZVNpemUgPiAyKSB7XHJcbiAgICAgICAgICAvLyBUb28gbWFueSBmcmFtZXMgaW4gZmxpZ2h0LCBlbmNvZGVyIGlzIG92ZXJ3aGVsbWVkXHJcbiAgICAgICAgICAvLyBsZXQncyBkcm9wIHRoaXMgZnJhbWUuXHJcbiAgICAgICAgICB2aWRlb0ZyYW1lLmNsb3NlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZyYW1lQ291bnRlcisrO1xyXG4gICAgICAgICAgY29uc3QgaW5zZXJ0X2tleWZyYW1lID0gZnJhbWVDb3VudGVyICUgMTUwID09IDA7XHJcbiAgICAgICAgICB2aWRlb0VuY29kZXIuZW5jb2RlKHZpZGVvRnJhbWUsIHsga2V5RnJhbWU6IGluc2VydF9rZXlmcmFtZSB9KTtcclxuICAgICAgICAgIHZpZGVvRnJhbWUuY2xvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBzb2NrZXQub25tZXNzYWdlID0gKGV2ZW50KSA9PiB7XHJcbiAgICBpZiAodHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xyXG5cclxuICAgICAgb25WaWRlb3Jvb21FbnRlcmVkKHJlc3BvbnNlKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBkZ3JhbVNvY2tldC5vbihcIm1lc3NhZ2VcIiwgKG1zZykgPT4ge1xyXG4gICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiBmcmFtZVRvQ2xpZW50TGlzdGVuZXJzKSB7XHJcbiAgICAgIGNvbnN0IHR5cGVkQXJyYXkgPSBuZXcgVWludDhBcnJheShtc2cpO1xyXG5cclxuICAgICAgbGlzdGVuZXIodHlwZWRBcnJheSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGRncmFtU29ja2V0LmJpbmQodW5kZWZpbmVkLCAnMTI3LjAuMC4xJywgKCkgPT4ge1xyXG4gICAgY29uc3Qgc2VuZFZpZGVvcm9vbVJlcXVlc3QgPSAoKSA9PiB7XHJcbiAgICAgIHNvY2tldC5zZW5kKFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHZpZGVvcm9vbUlkOiBldmVudC5kYXRhLnZpZGVvcm9vbUlkLFxyXG4gICAgICAgICAgc2xvdDogZXZlbnQuZGF0YS5zbG90LFxyXG4gICAgICAgICAgaWRUb2tlbjogZXZlbnQuZGF0YS5pZFRva2VuLFxyXG4gICAgICAgICAgZGF0YWdyYW1Qb3J0OiBkZ3JhbVNvY2tldC5hZGRyZXNzKCkucG9ydCxcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhcImRncmFtIGFkZHJlc3NcIiwgZGdyYW1Tb2NrZXQuYWRkcmVzcygpKTtcclxuXHJcbiAgICBpZiAoc29ja2V0LnJlYWR5U3RhdGUgPT09IDEpIHtcclxuICAgICAgc2VuZFZpZGVvcm9vbVJlcXVlc3QoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNvY2tldC5vbm9wZW4gPSAoKSA9PiB7XHJcbiAgICAgICAgc2VuZFZpZGVvcm9vbVJlcXVlc3QoKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9