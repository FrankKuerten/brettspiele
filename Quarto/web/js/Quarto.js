"use strict";

// standard global variables
var scene, camera, renderer, controls;
var keyboard = new THREEx.KeyboardState();
// custom global variables
var hoehe = [30, 60], spitz = [21, 0], form = [30, 4], material = [2];

// Stein Material
var loader = new THREE.TextureLoader();
var holzTextur = loader.load( '/Quarto/images/zebrano.jpg' );
holzTextur.minFilter = THREE.NearestFilter;
material[0] = new THREE.MeshLambertMaterial( { map: holzTextur } );

var steinTextur = loader.load( '/Quarto/images/kalk.jpg' );
steinTextur.minFilter = THREE.NearestFilter;
material[1] = new THREE.MeshLambertMaterial( { map: steinTextur } );

// Feld Material
var feldMatS = new THREE.MeshLambertMaterial( { color: 0x000000 } );
var feldMatW = new THREE.MeshLambertMaterial( { color: 0xffffff } );
var feldGeo = new THREE.BoxGeometry(75, 10, 75);

// Rand Material
var randTextur = loader.load( '/Quarto/images/kiefer.jpg' );
randTextur.minFilter = THREE.NearestFilter;
var randMat = new THREE.MeshLambertMaterial( { map: randTextur } );
// radiusOben, radiusUnten, höhe, anzahlSegmenteRundum, anzahlSegmenteHoch
var randGeo = new THREE.CylinderGeometry( 250, 250, 10, 100, 1 );
var lochGeo = new THREE.BoxGeometry(300, 10, 300);
var randBSP = new ThreeBSP(new THREE.Mesh( randGeo ));
var lochBSP = new ThreeBSP(new THREE.Mesh( lochGeo ));
var randMitLochBSP = randBSP.subtract( lochBSP );
// var randMesh = new THREE.Mesh( randGeo, randMat );
var randMesh = randMitLochBSP.toMesh( randMat );

var waehlbare = [];
var brett, steinAusgewaehlt;
var gewinnMarker = [];
var gwMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
var sunLight;

// Timer für die Beobachtung des Spielstands, wenn man nicht am Zug ist    
var kiebitz = null;
    
var partienummer = null;
var zugnummer = null;
var spielstand = null;
var spielstandAlt = '';
var spielzuege = null;
var spieler = null;
var amZug = null;
var amZugAlt = null;
var nameWeiss = null;
var nameSchwarz = null;
var istBeendet = false;

// Steuerung des Replaymodus
var spielzuege = null;
var zugnr = 0;
var replay = false;
var maxzug = 0;

init();
animate();
holeSpielstand();
initReplay();

// Szene mit Inhalten füllen  		
function init() {
	// SCENE
	scene = new THREE.Scene();
	
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(50,200,500);
	camera.lookAt(scene.position);	

	// RENDERER
	if ( Detector.webgl ){
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	} else {
		renderer = new THREE.CanvasRenderer();
		Detector.addGetWebGLMessage();
	}
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.body.appendChild( renderer.domElement );

	// EVENTS
	THREEx.WindowResize(renderer, camera);
	// CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	// MOUSE
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	// LIGHT
	var ambLight = new THREE.AmbientLight(0x707070);
	scene.add(ambLight);

	sunLight = new THREE.DirectionalLight(0xffffff);
	sunLight.position.set(500,350,-500);

	sunLight.shadow.camera.visible = false;
	sunLight.shadow.mapSize.width = 1024;
	sunLight.shadow.mapSize.height = 1024;
	sunLight.shadow.camera.near = 1;
	sunLight.shadow.camera.far = 1200;
	sunLight.shadow.camera.left = -500;
	sunLight.shadow.camera.right = 500;
	sunLight.shadow.camera.top = 500;
	sunLight.shadow.camera.bottom = -500;
	sunLight.shadow.camera.fov = 30;
	sunLight.penumbra = 0.05;
	sunLight.decay = 2;
	sunLight.intensity = 1;
	
	scene.add(sunLight);
	// var lightHelper = new THREE.DirectionalLightHelper( sunLight, 500 );
	// scene.add( lightHelper );

	// Spielbrett
	brett = new Brett();
	brett.reset();
	brett.zeigeSchatten(true);

	// SKYBOX/FOG

	var imagePrefix = "/Quarto/images/";
	var directions  = ["px", "nx", "py", "ny", "pz", "nz"];
	var imageSuffix = ".jpg";
	var skyGeometry = new THREE.BoxGeometry( 5000, 5000, 5000 );	
	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: loader.load( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	
	// var skyGeometry = new THREE.BoxGeometry( 10000, 10000, 10000 );
	// var skyMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );

	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	scene.add( skyBox );
	//scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
}

function animate(){
	requestAnimationFrame( animate );
	render();
	if (steinAusgewaehlt != null){
		steinAusgewaehlt.mesh.rotation.y += 0.02;
	}
	update();
}

function update(){
	if ( keyboard.pressed("k") ) { 
		// Schatten aus
		brett.zeigeSchatten(false);
	}
	if ( keyboard.pressed("s") ) { 
		// Schatten an
		brett.zeigeSchatten(true);
	}
	controls.update();
}

function render(){
	renderer.render( scene, camera );
}

function onDocumentMouseDown( event ){
	// the following line would stop any other event handler from firing
	// (such as the mouse's TrackballControls)
	// event.preventDefault();

	if (brett.beendet || spieler != amZug || replay){
		return;
	}
	
	var vector = getProjectVector(event);
	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	// create an array containing all objects in the scene with which the ray intersects
	var intersects = ray.intersectObjects( waehlbare );
	
	// if there is one (or more) intersections
	if ( intersects.length > 0 ){
		var objId = intersects[0].object.id;
		var zug = brett.click(objId);
		if (zug != null){
			speichereZug(zug);
		}
	}
}

function onDocumentMouseMove( event ){
	// the following line would stop any other event handler from firing
	// (such as the mouse's TrackballControls)
	// event.preventDefault();

	if (brett.beendet || spieler != amZug || steinAusgewaehlt == null || replay){
		return;
	}
	
	var vector = getProjectVector(event);
	var dir = vector.sub( camera.position ).normalize();
	var distance = - camera.position.y / dir.y;

	// Schnittpunkt mit der Ebene y=0 (Brettebene)
	var schnipu = camera.position.clone().add( dir.multiplyScalar( distance ) );
	
	if ( schnipu != null ){
		var hst = hoehe[steinAusgewaehlt.hoehe] / 2;
		// Zeigt die Maus auf ein Belegtes Feld? -> eine Etage höher anzeigen
		if ( brett.belegtesFeld(schnipu.x, schnipu.z) ){
			hst += 65;
		}
		steinAusgewaehlt.mesh.position.set(schnipu.x, hst ,schnipu.z);
	}
}

function getProjectVector(event){
	var vector = new THREE.Vector3();
	vector.set(
	    ( event.clientX / window.innerWidth ) * 2 - 1,
	    - ( event.clientY / window.innerHeight ) * 2 + 1,
	    0.5 );

	vector.unproject( camera );
	return vector;
}
