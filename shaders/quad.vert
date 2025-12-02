precision highp float;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec2 nPos = aTexCoord * 2. - 1.;
  gl_Position = vec4(nPos.x,nPos.y,0.,1.0);
}