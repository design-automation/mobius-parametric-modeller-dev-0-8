export const navMeshComponent =  {
  init: function () {
    this.system = this.el.sceneEl.systems.nav;
    this.hasLoadedNavMesh = false;
    this.el.addEventListener('object3dset', this.loadNavMesh.bind(this));
  },

  play: function () {
    if (!this.hasLoadedNavMesh) { this.loadNavMesh(); }
  },

  loadNavMesh: function () {
    const object = this.el.getObject3D('mesh');
    const scene = this.el.sceneEl.object3D;

    if (!object) { return; }

    let navMesh;
    object.traverse((node) => {
      if (node.isMesh) { navMesh = node; }
    });

    if (!navMesh) { return; }
    // const navMeshGeometry = navMesh.geometry.isBufferGeometry
    //   ? new THREE.Geometry().fromBufferGeometry(navMesh.geometry)
    //   : navMesh.geometry.clone();
    const navMeshGeometry = navMesh.geometry.clone();

    scene.updateMatrixWorld();
    navMeshGeometry.applyMatrix(navMesh.matrixWorld);
    console.log('navMeshGeometry', navMeshGeometry)
    this.system.setNavMeshGeometry(navMeshGeometry);

    this.hasLoadedNavMesh = true;
  }
};
