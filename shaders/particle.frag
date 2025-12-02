precision highp float;
varying vec2 vTexCoord;
varying vec2 velocity;

void main() {
    vec2 uv = vTexCoord.xy;
    //gl_FragColor = vec4(uv.x,uv.y,0.,1.);
    gl_FragColor = vec4(velocity.x, velocity.y, 0.5, 1.0);
}