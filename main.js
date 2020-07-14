/* global THREE */
const width = window.innerWidth;
const height = window.innerHeight;
const background_color = 0xF5F5F5

var hoge = 0.0
const r_shoulder_angle = -Math.PI * 0.4
const l_shoulder_angle = Math.PI * 0.4

/* Audio */
var music1 = new Audio();
var music2 = new Audio();
var music3 = new Audio();
var music4 = new Audio();
var music5 = new Audio();


// -- renderer -------------------------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(background_color));
renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );

// -- camera ---------------------------------------------------------------------------------------
var cam_depth = 30.0
var camera = new THREE.PerspectiveCamera(cam_depth, width / height, 0.01, 20.0);

// -- gui ------------------------------------------------------------------------------------------
var gui = new dat.GUI();
var controls = new function () {
    this.cam_x = 0.0
    this.cam_y = 1.0
    this.cam_z = 5.0
    this.b_butterfly = false
};
gui.add(controls, 'cam_x', -1.0, 1.0, 0.1);
gui.add(controls, 'cam_y', 0.0, 2.0, 0.1);
gui.add(controls, 'cam_z', 0.5, 5.0, 0.1);
gui.add(controls, 'b_butterfly')

// -- scene ----------------------------------------------------------------------------------------
const scene = new THREE.Scene();

// -- avocado (gltf) -------------------------------------------------------------------------------
let currentVRM = undefined; // 現在使用中のvrm、update内で使えるようにするため

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function initVRM( gltf ) { // モデルが読み込まれたあとの処理
    THREE.VRM.from( gltf ).then( ( vrm ) => { // gltfをvrmにする
        scene.add( vrm.scene ); // gltfのモデルをsceneに追加
        currentVRM = vrm; // currentGLTFにvrmを代入
        currentVRM.humanoid.getBoneNode( THREE.VRMSchema.HumanoidBoneName.Hips ).rotation.y = Math.PI; //デフォルトだと後ろを向いちゃうので前を向かせる
    } );
}

const loader = new THREE.GLTFLoader(); // vrmをGLTFLoaderで読み込む
loader.load( // モデルを読み込む
    'assets/aya.vrm', // モデルデータのURL
    ( gltf ) => { initVRM( gltf ); }, // モデルが読み込まれたあとの処理
    ( progress ) => { console.info( ( 100.0 * progress.loaded / progress.total ).toFixed( 2 ) + '% loaded' ); }, // モデル読み込みの進捗を表示
    ( error ) => { console.error( error ); } // モデル読み込み時のエラーを表示
);

// -- light ----------------------------------------------------------------------------------------
const light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 1.0, 1.0, 1.0 ).normalize();
scene.add(light);

// -- music ---------------------------------------------------------------------------------------- 
function init() {
    music1.preload = "auto";
    music1.src = "assets/hadson.mp3";
    music1.load();
    music2.preload = "auto";
    music2.src = "assets/edoten.mp3";
    music2.load();
    music3.preload = "auto";
    music3.src = "assets/nus.mp3";
    music3.load();
    music4.preload = "auto";
    music4.src = "assets/greeting.mp3";
    music4.load();
    music5.preload = "auto";
    music5.src = "assets/happy.mp3";
    music5.load();

    music1.addEventListener(true, function () {//なんかしらんけど"ended"をtrueにしたら一回再生になった。
        music1.currentTime = 0;
        music1.play();
    }, false);//false
        music2.addEventListener(true, function () {//なんかしらんけど"ended"をtrueにしたら一回再生になった。
        music2.currentTime = 0;
        music2.play();
    }, false);//false
        music3.addEventListener(true, function () {//なんかしらんけど"ended"をtrueにしたら一回再生になった。
        music3.currentTime = 0;
        music3.play();
    }, false);//false
        music4.addEventListener(true, function () {//なんかしらんけど"ended"をtrueにしたら一回再生になった。
        music4.currentTime = 0;
        music4.play();
    }, false);//false
        music5.addEventListener(true, function () {//なんかしらんけど"ended"をtrueにしたら一回再生になった。
        music5.currentTime = 0;
        music5.play();
  }, false);//false
}

function play1() {
    music1.play();
    music1.currentTime = 0;
}
function play2() {
    music2.play();
    music2.currentTime = 0;
}
function play3() {
    music3.play();
    music3.currentTime = 0;
}
function play4() {
    music4.play();
    music4.currentTime = 0;
}
function play5() {
    music5.play();
    music5.currentTime = 0;
}


function stop() {
    music1.pause();
    music1.currentTime = 0;
    music2.pause();
    music2.currentTime = 0;
    music3.pause();
    music3.currentTime = 0;
    music4.pause();
    music4.currentTime = 0;
    music5.pause();
    music5.currentTime = 0;
}

init();

// -- update ---------------------------------------------------------------------------------------
const clock = new THREE.Clock();
clock.start();

function update() {
    requestAnimationFrame(update);
    camera.position.set(controls.cam_x,controls.cam_y,controls.cam_z);
    const delta = clock.getDelta();

    if (currentVRM) { // VRMが読み込まれていれば
        const s = 0.25 * Math.PI * Math.sin( Math.PI * clock.elapsedTime*1000 );
        currentVRM.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperArm).rotation.z = r_shoulder_angle;
        currentVRM.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftUpperArm).rotation.z = l_shoulder_angle;
        if (controls.b_butterfly) {
            currentVRM.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperArm).rotation.z = s;
            currentVRM.humanoid.getBoneNode( THREE.VRMSchema.HumanoidBoneName.LeftUpperArm ).rotation.z =  s;
        }

        currentVRM.update(delta); // VRMの各コンポーネントを更新
    }

    renderer.render( scene, camera );
};
update();
window.addEventListener('resize', onResize, false);
