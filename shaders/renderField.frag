precision highp float;
varying vec2 vTexCoord;
uniform sampler2D field;
uniform float time;

vec2 rotate(vec2 dir,float a){
    float rad = a * 3.14159 * 2.;
    float c = cos(rad);
    float s = sin(rad);
    return dir * mat2(c,-s,s,c);
}

void main() {
    vec2 uv = vTexCoord.xy;
    
    vec2 f = texture2D(field,uv).xy;
    vec2 r = rotate(f,time);
    gl_FragColor = vec4(r.x*.5+.5,r.y*.5+.5,0.,1.);
}