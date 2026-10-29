/**
 * Aitmad Engineering - 3D Steel Portal Frame Hero
 * Spec: Section 6.1, 8, 10
 */

export class Hero3DScene {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    this.fallbackEl = document.querySelector('.hero-fallback-bg');
    if (!this.container) return;

    this.checkReducedMotion();
    if (this.reducedMotion) {
      this.activateFallback();
      return;
    }

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isPaused = false;
    this.members = [];
    this.init();
  }

  checkReducedMotion() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  activateFallback() {
    if (this.fallbackEl) {
      this.fallbackEl.classList.add('active');
    }
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded, triggering fallback.');
      this.activateFallback();
      return;
    }

    try {
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;

      // Scene
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x071218, 0.018);

      // Camera
      const isMobile = width < 768;
      this.camera = new THREE.PerspectiveCamera(isMobile ? 55 : 45, width / height, 0.1, 1000);
      const camDist = isMobile ? 36 : 28;
      this.camera.position.set(isMobile ? 14 : 22, isMobile ? 18 : 14, camDist);
      this.camera.lookAt(0, isMobile ? 2 : 4, 0);

      // Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.1;
      this.container.appendChild(this.renderer.domElement);

      // Lights
      const ambientLight = new THREE.AmbientLight(0x1B2834, 1.4);
      this.scene.add(ambientLight);

      // Warm Key Light (Brand Red accent warmth)
      const keyLight = new THREE.DirectionalLight(0xEE1C25, 2.0);
      keyLight.position.set(20, 30, 20);
      this.scene.add(keyLight);

      // Cool Fill Light (Industrial architectural white)
      const fillLight = new THREE.DirectionalLight(0xF8F9FA, 1.6);
      fillLight.position.set(-20, 15, -15);
      this.scene.add(fillLight);

      // Ground Blueprint Grid (Red major lines, dark steel minor lines)
      const gridHelper = new THREE.GridHelper(60, 30, 0xEE1C25, 0x1B2834);
      gridHelper.position.y = -0.05;
      gridHelper.material.opacity = 0.28;
      gridHelper.material.transparent = true;
      this.scene.add(gridHelper);

      // Build Steel Portal Frames
      this.buildPortalStructure();

      // Listeners
      window.addEventListener('resize', this.onResize.bind(this));
      window.addEventListener('mousemove', this.onMouseMove.bind(this));

      // Intersection Observer to pause rendering when off-screen
      this.setupObserver();

      // Start Assembly Animation
      this.animateAssembly();

      // Render Loop
      this.clock = new THREE.Clock();
      this.tick();
    } catch (e) {
      console.warn('WebGL init failed, activating fallback hero', e);
      this.activateFallback();
    }
  }

  buildPortalStructure() {
    this.structureGroup = new THREE.Group();
    this.scene.add(this.structureGroup);

    // Steel Beam Material (Brushed heavy carbon steel with metallic reflections)
    const steelMaterial = new THREE.MeshStandardMaterial({
      color: 0x182028,
      metalness: 0.88,
      roughness: 0.3
    });

    const copperJointMaterial = new THREE.MeshStandardMaterial({
      color: 0xEE1C25,
      metalness: 0.9,
      roughness: 0.22
    });

    // Portal Frame Dimensions
    const bayCount = 5;
    const baySpacing = 6;
    const span = 16;
    const columnHeight = 7.5;
    const apexHeight = 10.5;

    // Helper to create an I-Beam geometry
    const createIBeam = (length, depth = 0.45, flangeWidth = 0.25, thickness = 0.05) => {
      const group = new THREE.Group();
      // Web
      const webGeo = new THREE.BoxGeometry(thickness, depth, length);
      const webMesh = new THREE.Mesh(webGeo, steelMaterial);
      group.add(webMesh);
      // Top Flange
      const flangeGeo = new THREE.BoxGeometry(flangeWidth, thickness, length);
      const topFlange = new THREE.Mesh(flangeGeo, steelMaterial);
      topFlange.position.y = depth / 2;
      group.add(topFlange);
      // Bottom Flange
      const botFlange = new THREE.Mesh(flangeGeo, steelMaterial);
      botFlange.position.y = -depth / 2;
      group.add(botFlange);

      return group;
    };

    let memberIndex = 0;

    for (let b = 0; b < bayCount; b++) {
      const z = (b - (bayCount - 1) / 2) * baySpacing;

      // Left Column
      const leftCol = createIBeam(columnHeight);
      leftCol.rotation.x = Math.PI / 2;
      leftCol.position.set(-span / 2, columnHeight / 2, z);
      this.registerMember(leftCol, memberIndex++);

      // Right Column
      const rightCol = createIBeam(columnHeight);
      rightCol.rotation.x = Math.PI / 2;
      rightCol.position.set(span / 2, columnHeight / 2, z);
      this.registerMember(rightCol, memberIndex++);

      // Left Rafter (from left column to apex)
      const rafterLen = Math.sqrt(Math.pow(span / 2, 2) + Math.pow(apexHeight - columnHeight, 2));
      const leftRafterAngle = Math.atan2(apexHeight - columnHeight, span / 2);

      const leftRafter = createIBeam(rafterLen);
      leftRafter.position.set(-span / 4, (columnHeight + apexHeight) / 2, z);
      leftRafter.rotation.z = -leftRafterAngle;
      leftRafter.rotation.y = Math.PI / 2;
      this.registerMember(leftRafter, memberIndex++);

      // Right Rafter
      const rightRafter = createIBeam(rafterLen);
      rightRafter.position.set(span / 4, (columnHeight + apexHeight) / 2, z);
      rightRafter.rotation.z = leftRafterAngle;
      rightRafter.rotation.y = Math.PI / 2;
      this.registerMember(rightRafter, memberIndex++);

      // Apex Joint (Copper highlighted detail)
      const apexJoint = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), copperJointMaterial);
      apexJoint.position.set(0, apexHeight, z);
      this.registerMember(apexJoint, memberIndex++);

      // Base Plates
      const baseL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 0.8), copperJointMaterial);
      baseL.position.set(-span / 2, 0.08, z);
      this.registerMember(baseL, memberIndex++);

      const baseR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 0.8), copperJointMaterial);
      baseR.position.set(span / 2, 0.08, z);
      this.registerMember(baseR, memberIndex++);
    }

    // Longitudinal Roof Purlins connecting the frames
    const purlinGeo = new THREE.BoxGeometry(0.08, 0.12, (bayCount - 1) * baySpacing + 2);
    const purlinPositions = [
      { x: 0, y: apexHeight + 0.25 },
      { x: -3.5, y: apexHeight - 1.2 },
      { x: 3.5, y: apexHeight - 1.2 },
      { x: -7, y: apexHeight - 2.5 },
      { x: 7, y: apexHeight - 2.5 },
      { x: -span / 2, y: columnHeight },
      { x: span / 2, y: columnHeight }
    ];

    purlinPositions.forEach((pos) => {
      const purlin = new THREE.Mesh(purlinGeo, steelMaterial);
      purlin.position.set(pos.x, pos.y, 0);
      this.registerMember(purlin, memberIndex++);
    });
  }

  registerMember(mesh, index) {
    this.structureGroup.add(mesh);
    // Target position and starting elevated slide position
    const targetY = mesh.position.y;
    mesh.userData = {
      targetY: targetY,
      startY: targetY + 25 + (index % 5) * 4,
      delay: index * 0.04,
      progress: 0
    };
    mesh.position.y = mesh.userData.startY;
    mesh.visible = false;
    this.members.push(mesh);
  }

  animateAssembly() {
    this.assemblyStartTime = performance.now();
  }

  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isPaused = !entry.isIntersecting;
      });
    }, { threshold: 0.05 });

    observer.observe(this.container);
  }

  onResize() {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const isMobile = width < 768;
    this.camera.fov = isMobile ? 55 : 45;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onMouseMove(e) {
    // Parallax values between -1 and 1
    this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  tick() {
    requestAnimationFrame(this.tick.bind(this));
    if (this.isPaused) return;

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Smooth mouse parallax interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Slow ambient rotation of structure
    if (this.structureGroup) {
      this.structureGroup.rotation.y = elapsed * 0.06;
      this.structureGroup.position.x = this.mouse.x * 1.5;
      this.structureGroup.position.z = this.mouse.y * 1.5;
    }

    // Camera micro-movement
    this.camera.position.x = 22 + this.mouse.x * 3;
    this.camera.position.y = 14 + this.mouse.y * 2;
    this.camera.lookAt(0, 4.5, 0);

    // Assembly drop-in animation
    this.members.forEach((m) => {
      if (elapsed > m.userData.delay) {
        m.visible = true;
        if (m.userData.progress < 1) {
          m.userData.progress += delta * 1.4;
          if (m.userData.progress > 1) m.userData.progress = 1;
          // Quintic ease out
          const ease = 1 - Math.pow(1 - m.userData.progress, 4);
          m.position.y = m.userData.startY + (m.userData.targetY - m.userData.startY) * ease;
        }
      }
    });

    this.renderer.render(this.scene, this.camera);
  }
}
