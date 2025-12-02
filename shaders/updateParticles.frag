precision highp float;
varying vec2 vTexCoord;
uniform sampler2D field;
uniform sampler2D locvec;
uniform float time;

vec2 rotate(vec2 dir,float a){
    float rad = a * 3.14159 * 2.;
    float c = cos(rad);
    float s = sin(rad);
    return dir * mat2(c,-s,s,c);
}

void main() {
    vec2 uv = vTexCoord.xy;
    vec4 lv = texture2D(locvec,uv);
    vec2 f = texture2D(field,lv.xy).xy;
    vec2 vel = lv.zw + rotate(f,time)*0.00001;
    float mag = length(vel);
    vel = normalize(vel)* min(0.01,mag);
    vec2 pos = lv.rg + vel;
    vec4 col = vec4(pos.x,pos.y,vel.x,vel.y);
    gl_FragColor = col;
}