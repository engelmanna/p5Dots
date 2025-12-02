let particleShader;
let updateFB;
let particleUpdateShader;
let particleFB_A;
let particleFB_B;
let particleMesh;
let copyShader;
let initShader;
let time=0;
let renderFieldShader;
let makeFieldShader;
let fieldFB_A;
const DOT_SIZE = 2;

const CANVAS_SIZE = 800;
const HALF_CANVAS = CANVAS_SIZE * 0.5;
const PARTICLE_TEX_SIZE = 512;

function particleShaderLoaded(loadedShader) {
    particleShader = loadedShader;
}
function makeFieldShaderLoaded(loadedShader){
    makeFieldShader = loadedShader;
    fieldFB_A.begin();
    background(0);
    shader(makeFieldShader);
    plane(0,0,100,100);
    fieldFB_A.end();
}
function updateParticleShaderLoaded(loadedShader){
    particleUpdateShader = loadedShader;
}
function copyShaderLoaded(loadedShader){
    copyShader = loadedShader;
}

function initParticleTex(loadedShader){
    initShader = loadedShader;
    particleFB_A.begin();
    shader(initShader);
    rectMode(CENTER);
    rect(0,0,PARTICLE_TEX_SIZE,PARTICLE_TEX_SIZE);
    particleFB_A.end();
}
function renderFieldLoaded(loadedShader){
    renderFieldShader = loadedShader;
}

function setupGeo() {

    particleMesh = new p5.Geometry();

    for(let x = 0; x<PARTICLE_TEX_SIZE; x++){
        for(let y=0; y<PARTICLE_TEX_SIZE; y++){
            //Vertices
            let v0 = createVector(-DOT_SIZE,-DOT_SIZE,0);
            let v1 = createVector(DOT_SIZE,-DOT_SIZE,0);
            let v2 = createVector(DOT_SIZE,DOT_SIZE,0);
            let v3 = createVector(-DOT_SIZE,DOT_SIZE,0);
            particleMesh.vertices.push(v0,v1,v2,v3);
            
            //Faces
            let fo = (x+y*PARTICLE_TEX_SIZE)*4;
            particleMesh.faces.push([0+fo,1+fo,3+fo],[1+fo,2+fo,3+fo]);
            
            //UVs
            let uvx = x/PARTICLE_TEX_SIZE+(1/(PARTICLE_TEX_SIZE*2));
            let uvy = y/PARTICLE_TEX_SIZE+(1/(PARTICLE_TEX_SIZE*2));
            particleMesh.uvs.push(uvx,uvy,uvx,uvy,uvx,uvy,uvx,uvy);
        }
    }
}

function setup() {
    let c = createCanvas(CANVAS_SIZE, CANVAS_SIZE, WEBGL);
    pixelDensity(1);
    noStroke();
    noSmooth();
    c.GL.pixelStorei(c.GL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);


    updateFB = createFramebuffer({width:CANVAS_SIZE,height:CANVAS_SIZE});
    particleFB_A = createFramebuffer({width:PARTICLE_TEX_SIZE,height:PARTICLE_TEX_SIZE,format:FLOAT,depth:true,textureFiltering:NEAREST});
    particleFB_B = createFramebuffer({width:PARTICLE_TEX_SIZE,height:PARTICLE_TEX_SIZE,format:FLOAT,depth:true,textureFiltering:NEAREST});
    fieldFB_A = createFramebuffer({width:CANVAS_SIZE,height:CANVAS_SIZE,format:FLOAT,depth:true});

    setupGeo();

    loadShader("/shaders/particle.vert","/shaders/particle.frag",particleShaderLoaded);
    loadShader("/shaders/quad.vert","/shaders/makeField.frag",makeFieldShaderLoaded);
    loadShader("/shaders/quad.vert","/shaders/updateParticles.frag",updateParticleShaderLoaded);
    loadShader("/shaders/quad.vert","/shaders/copy.frag",copyShaderLoaded);
    loadShader("/shaders/quad.vert","/shaders/initParticle.frag",initParticleTex);
    loadShader("/shaders/vert.vert","/shaders/renderField.frag",renderFieldLoaded);
}

function draw() {
    time += deltaTime;

    if (!particleShader ||
        !makeFieldShader ||
        !particleUpdateShader ||
        !copyShader ||
        !initShader ||
        !renderFieldShader
    ) { return; }

    particleFB_B.begin();
    clear();
    shader(particleUpdateShader);
    particleUpdateShader.setUniform('field',fieldFB_A);
    particleUpdateShader.setUniform('locvec',particleFB_A);
    rectMode(CENTER);
    rect(0,0,PARTICLE_TEX_SIZE,PARTICLE_TEX_SIZE);
    particleFB_B.end();

    particleFB_A.begin();
    clear();
    shader(copyShader);
    copyShader.setUniform('uTex',particleFB_B);
    rectMode(CENTER);
    rect(0,0,PARTICLE_TEX_SIZE,PARTICLE_TEX_SIZE);
    particleFB_A.end();

    camera(HALF_CANVAS,HALF_CANVAS,CANVAS_SIZE,HALF_CANVAS,HALF_CANVAS,0);

    background(100);

    shader(renderFieldShader);
    renderFieldShader.setUniform('field',fieldFB_A);
    renderFieldShader.setUniform('time',time*0.0001);
    rectMode(CENTER);
    rect(400,400,CANVAS_SIZE,CANVAS_SIZE);

    shader(particleShader);
    particleShader.setUniform('uTexture',particleFB_A);
    particleShader.setUniform('time',time*0.0001);
    model(particleMesh);

}