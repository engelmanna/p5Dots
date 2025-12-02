precision highp float;
attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform sampler2D uTexture;

varying vec2 vTexCoord;
varying vec2 velocity;

void main() {
  
  vTexCoord = aTexCoord;
  vec4 locvec = texture2D(uTexture,aTexCoord);
  vec2 pos = locvec.xy;
  vec4 newPos = vec4(aPosition.x+pos.x*800.,aPosition.y+pos.y*800.,0.,1.0);
  velocity = normalize(locvec.zw)*0.5+0.5;
  gl_Position = uProjectionMatrix * uModelViewMatrix * newPos;
}