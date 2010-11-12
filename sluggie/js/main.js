var canvas = $('#canvas');

if (canvas && canvas.getContext) {
    canvasContext = canvas.getContext('2d');
    canvasBuffer = $(document).createElement('canvas');
    canvasBuffer.width = canvas.width;
    canvasBuffer.height = canvas.height;
    canvasBufferContext = canvasBuffer.getContext('2d');
}