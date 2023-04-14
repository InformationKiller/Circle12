window.onload = function() {
    var canvas = document.createElement('canvas');

    canvas.width = 800;
    canvas.height = 800;

    document.body.appendChild(canvas);

    var GLES = canvas.getContext('webgl', {
        premultipliedAlpha: false,
        alpha: false
    });

    var screenVBO = GLES.createBuffer();

    GLES.bindBuffer(GLES.ARRAY_BUFFER, screenVBO);
    GLES.bufferData(GLES.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        -1.0, 1.0,
        1.0, 1.0
    ]), GLES.STATIC_DRAW);

    var PROGRAM = GLES.createProgram();
    var compiled = 0;
    var index;
    var color;

    fetch('./circle.vert').then(resp => resp.text()).then(text => compile(GLES.VERTEX_SHADER, text)).then(() => link()).then(() => finishInit());
    fetch('./circle.frag').then(resp => resp.text()).then(text => compile(GLES.FRAGMENT_SHADER, text)).then(() => link()).then(() => finishInit());

    var compile = function(type, source) {
        let shader = GLES.createShader(type);

        GLES.shaderSource(shader, source);
        GLES.compileShader(shader);

        if (!GLES.getShaderParameter(shader, GLES.COMPILE_STATUS)) {
            console.error(GLES.getShaderInfoLog(shader));
            GLES.deleteShader(shader);

            return;
        }

        GLES.attachShader(PROGRAM, shader);
        GLES.deleteShader(shader);

        compiled++;
    }

    var link = function() {
        if (compiled == 2) {
            GLES.linkProgram(PROGRAM);

            if (!GLES.getProgramParameter(PROGRAM, GLES.LINK_STATUS)) {
                console.error(GLES.getProgramInfoLog(PROGRAM));

                return;
            }

            GLES.validateProgram(PROGRAM);

            if (!GLES.getProgramParameter(PROGRAM, GLES.VALIDATE_STATUS)) {
                console.error(GLES.getProgramInfoLog(PROGRAM));

                return;
            }

            compiled++;
        }
    }

    var finishInit = function() {
        if (compiled == 3) {
            index = GLES.getUniformLocation(PROGRAM, 'index');
            color = GLES.getUniformLocation(PROGRAM, 'color');

            GLES.useProgram(PROGRAM);

            var location = GLES.getAttribLocation(PROGRAM, 'vertex');

            GLES.vertexAttribPointer(location, 2, GLES.FLOAT, false, 0, 0);
            GLES.enableVertexAttribArray(location);

            GLES.clearColor(1.0, 1.0, 1.0, 1.0);
            GLES.clear(GLES.COLOR_BUFFER_BIT);

            GLES.enable(GLES.BLEND);
            GLES.blendFunc(GLES.SRC_ALPHA, GLES.ONE_MINUS_SRC_ALPHA);

            var btn = document.createElement('button');

            btn.innerText = 'Refresh';
            btn.style.display = 'block';
            btn.onclick = draw;
    
            document.body.appendChild(btn);

            draw();
        }
    }

    var draw = function() {
        requestAnimationFrame(() => {
            GLES.clear(GLES.COLOR_BUFFER_BIT);

            for (var i = 0; i < 12; i++) {
                GLES.uniform1f(index, i);
                GLES.uniform3f(color, Math.random(), Math.random(), Math.random());
                GLES.drawArrays(GLES.TRIANGLE_STRIP, 0, 4);
            }
        });
    }
};