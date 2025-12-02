precision highp float;
varying vec2 vTexCoord;

vec2 hash( vec2 p ) {
	p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
	return abs(fract(sin(p)*43758.5453123));
}


void main() {
    vec2 uv = vTexCoord.xy;

    vec2 rPos = hash(uv*141.232);
    vec2 rDir = vec2(0.);
    gl_FragColor = vec4(rPos.x,rPos.y,rDir.x,rDir.y);
}