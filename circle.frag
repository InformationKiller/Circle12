#version 100
precision highp float;

uniform float index;
uniform vec3 color;

varying vec2 pos;

float antialiasing(vec2 center)
{
    vec2 frag = pos * 0.5 + 0.5;
    vec2 pixel = frag / gl_FragCoord.xy;
    vec2 aa = pixel * 0.125;

    vec2 from = pos - 3.0 * aa;
    float blur = length(pixel) * 2.0;

    float alpha = 0.0;

    for (float x = 0.0; x < 4.0; x++)
    {
        for (float y = 0.0; y < 4.0; y++)
        {
            alpha += clamp(1.0 - (distance(from + vec2(x, y) * 2.0 * aa, center) - 0.5 + blur * 0.5) / blur, 0.0, 1.0) * 0.0625;
        }
    }

    return alpha;
}

void main()
{
    vec2 center = vec2(cos(radians(30.0) * index), sin(radians(30.0) * index)) * 0.5;
    float alpha = antialiasing(center) * 0.5;

    if (alpha < 0.03125)
    {
        discard;
    }

    gl_FragColor = vec4(color, alpha);
}