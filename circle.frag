#version 100
precision highp float;

uniform float index;
uniform vec3 color;

varying vec2 pos;

float antialiasing(vec2 center)
{
    vec2 frag = pos * 0.5 + 0.5;
    vec2 aaSize = frag / gl_FragCoord.xy * 0.125;

    vec2 from = pos - 3.0 * aaSize;
    vec2 to = pos + 4.0 * aaSize;

    float alpha = 0.0;

    for (float x = 0.0; x < 4.0; x++)
    {
        for (float y = 0.0; y < 4.0; y++)
        {
            alpha += float(distance(from + vec2(x, y) * 2.0 * aaSize, center) <= 0.5) * 0.0625;
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