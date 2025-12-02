precision highp float;
varying vec2 vTexCoord;

const mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
const float INV_TAU = 0.159155; // 1 / (PI * 2)
const float noiseScale = 1.8;
const float noiseOffset =2.45;

vec2 hash( vec2 p ) {
	p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
	return -1.0 + 2.0 * fract(sin(p)*43758.5453123);
}

float noise( in vec2 p ) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;
	vec2 i = floor(p + (p.x+p.y)*K1);	
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0); //vec2 of = 0.5 + 0.5*vec2(sign(a.x-a.y), sign(a.y-a.x));
    vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot(n, vec3(70.0));	
}

float fbm(vec2 n) {
	float total = 0.0;
    float amplitude = 1.0;
	for (int i = 0; i < 4; i++) {
		total += noise(n) * amplitude;
		n = m * n;
		amplitude *= 0.4;
	}
	return total;
}

vec2 rotate(float a){
    float rad = a * 3.14159 * 2.;
    float c = cos(rad);
    float s = sin(rad);
    return vec2(1.,0.) * mat2(c,-s,s,c);
}

void main() {
    vec2 uv = vTexCoord.xy;
    
    // Compute general noise
    float fieldNoise = fbm(uv * noiseScale + noiseOffset);
    vec2 fbmDir = rotate(fieldNoise)*0.5+0.5;
    
    // Compute angle along edges to point inwards
    vec2 edgeUV = (uv-0.5);
    float edgeAngle = atan(-edgeUV.y,-edgeUV.x)*INV_TAU;
    vec2 edgeInwardDir = rotate(edgeAngle);
    
    //Mix values so edges point inwards to help keep things in view;
    float mixVal = pow(distance(uv,vec2(0.5))*2.,2.2);
    vec2 finalDir = mix(fbmDir,edgeInwardDir,mixVal);
    
    gl_FragColor = vec4(finalDir.x,finalDir.y,0.,1.);
}