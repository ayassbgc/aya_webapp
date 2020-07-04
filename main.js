/* global THREE */

const width = window.innerWidth;
const height = window.innerHeight;
const background_color = 0xF5F5F5

var hoge = 0.0
const r_shoulder_angle = -Math.PI * 0.4
const l_shoulder_angle = Math.PI *0.4


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
    this.hoge = 0.0
    this.b_butterfly = 0
};
gui.add(controls, 'cam_x', -1.0, 1.0, 0.1);
gui.add(controls, 'cam_y', 0.0, 2.0, 0.1);
gui.add(controls, 'cam_z', 0.5, 5.0, 0.1);
gui.add(controls, 'b_butterfly',0,1,1)
//gui.add(controls, 'hoge', -Math.PI, Math.PI, 0.1);

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
scene.add( light );

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
