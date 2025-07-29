import * as THREE from "three";

const GRID_COLOR = [0x999999, 0x656565];
export class Grid extends THREE.Group {
  type: string;

  private gridXY: THREE.GridHelper; // XY 평면
  private gridXZ: THREE.GridHelper; // ZX 평면
  private gridYZ: THREE.GridHelper; // YZ 평면
  private subGridXY: THREE.GridHelper; // X 평면
  private subGridXZ: THREE.GridHelper; // Y 평면
  private subGridYZ: THREE.GridHelper; // Z 평면
  public size: number;
  public divisions: number;
  public _showXY: boolean;
  public _showXZ: boolean;
  public _showYZ: boolean;
  public opacity: number;

  constructor(size: number, divisions: number) {
    super();
    this.type = "GridHelper";
    this.size = size;
    this.divisions = divisions;
    this.opacity = 0.5;

    this._showXY = false;
    this._showXZ = false;
    this._showYZ = false;

    this.gridXZ = this.createGrid(
      size,
      divisions / 5,
      0.5,
      new THREE.Color(0xff2244),
      new THREE.Color(0x4488ff),
      new THREE.Color(GRID_COLOR[0])
    );
    this.subGridXZ = this.createGrid(
      size,
      divisions,
      0.5,
      new THREE.Color(0xff2244),
      new THREE.Color(0x4488ff),
      new THREE.Color(GRID_COLOR[1])
    );

    this.add(this.subGridXZ);
    this.add(this.gridXZ);

    this.gridXY = this.createGrid(
      size,
      divisions / 5,
      0.5,
      new THREE.Color(0xff2244),
      new THREE.Color(0x88ff44),
      new THREE.Color(GRID_COLOR[0])
    );
    this.subGridXY = this.createGrid(
      size,
      divisions / 5,
      0.5,
      new THREE.Color(0xff2244),
      new THREE.Color(0x88ff44),
      new THREE.Color(GRID_COLOR[1])
    );
    this.gridXY.rotation.x = Math.PI / 2;
    this.add(this.gridXY);
    this.add(this.subGridXY);

    this.gridYZ = this.createGrid(
      size,
      divisions / 5,
      0.5,
      new THREE.Color(0xff2244),
      new THREE.Color(0x88ff44),
      new THREE.Color(GRID_COLOR[0])
    );
    this.subGridYZ = this.createGrid(
      size,
      divisions,
      0.5,
      new THREE.Color(0xff2244),
      new THREE.Color(0x88ff44),
      new THREE.Color(GRID_COLOR[1])
    );

    this.gridYZ.rotation.z = Math.PI / 2;
    this.subGridYZ.rotation.z = Math.PI / 2;
    this.add(this.subGridYZ);
    this.add(this.gridYZ);
  }

  private createGrid(
    size: number,
    divisions: number,
    opacity: number = 0.5,
    xColor: THREE.Color = new THREE.Color(0xff2244),
    zColor: THREE.Color = new THREE.Color(0x4488ff),
    normalColor: THREE.Color
  ): THREE.GridHelper {
    // Make it transparent
    const grid = new THREE.GridHelper(size, divisions);
    grid.material.opacity = opacity;
    grid.material.transparent = true;

    // Modify geometry to set different colors for center lines
    const gridGeometry = grid.geometry;
    const positionAttr = gridGeometry.getAttribute("position");
    const colorAttr = new THREE.BufferAttribute(
      new Float32Array(positionAttr.count * 3),
      3
    );

    // Define colors
    const colorX = xColor;
    const colorZ = zColor;
    const colorNormal = normalColor;

    for (let i = 0; i < positionAttr.count; i++) {
      const x = positionAttr.getX(i);
      const z = positionAttr.getZ(i);

      if (z === 0) {
        colorX.toArray(colorAttr.array, i * 3);
      } else if (x === 0) {
        colorZ.toArray(colorAttr.array, i * 3);
      } else {
        colorNormal.toArray(colorAttr.array, i * 3);
      }
    }
    gridGeometry.setAttribute("color", colorAttr);
    grid.material.vertexColors = true;
    grid.frustumCulled = false;
    return grid;
  }
  public setOpacity(opacity: number): void {
    this.opacity = opacity;
    this.gridXY.material.opacity = opacity;
    this.subGridXY.material.opacity = opacity * 0.5;
    this.gridXZ.material.opacity = opacity;
    this.subGridXZ.material.opacity = opacity * 0.5;
    this.gridYZ.material.opacity = opacity;
    this.subGridYZ.material.opacity = opacity * 0.5;
  }

  public showGridXY(): void {
    this.gridXY.visible = true;
    this.subGridXY.visible = true;
    this.gridXZ.visible = false;
    this.subGridXZ.visible = false;
    this.gridYZ.visible = false;
    this.subGridYZ.visible = false;
  }

  public showGridXZ(): void {
    this._showXY = false;
    this._showXZ = true;
    this._showYZ = false;
    this.gridXY.visible = false;
    this.subGridXY.visible = false;
    this.gridXZ.visible = true;
    this.subGridXZ.visible = true;
    this.gridYZ.visible = false;
    this.subGridYZ.visible = false;
  }

  public showGridYZ(): void {
    this._showXY = false;
    this._showXZ = false;
    this._showYZ = true;
    this.gridXY.visible = false;
    this.subGridXY.visible = false;
    this.gridXZ.visible = false;
    this.subGridXZ.visible = false;
    this.gridYZ.visible = true;
    this.subGridYZ.visible = true;
  }

  public showAllGrid(): void {
    this._showXY = true;
    this._showXZ = true;
    this._showYZ = true;
    this.gridXY.visible = true;
    this.gridXZ.visible = true;
    this.gridYZ.visible = true;
    this.subGridXY.visible = true;
    this.subGridXZ.visible = true;
    this.subGridYZ.visible = true;
  }

  public hiddenAllGrid(): void {
    this._showXY = false;
    this.gridXY.visible = false;
    this.gridXZ.visible = false;
    this.gridYZ.visible = false;
    this.subGridXY.visible = false;
    this.subGridXZ.visible = false;
    this.subGridYZ.visible = false;
  }

  public update(camera: THREE.Camera): void {
    if (!camera) {
      return;
    }

    // 카메라의 방향 벡터 계산
    // const direction = new THREE.Vector3();
    // camera.getWorldDirection(direction);

    // 카메라 위치에서 방향 벡터를 따라가는 광선 생성
    // const raycaster = new THREE.Raycaster(camera.position, direction, 0.1, 100);

    // 그리드 평면과의 교점 계산
    // const planeXY = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    // const planeXZ = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    // const planeYZ = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);

    // const intersectXY = raycaster.ray.intersectPlane(planeXY, new THREE.Vector3());
    // const intersectXZ = raycaster.ray.intersectPlane(planeXZ, new THREE.Vector3());
    // const intersectYZ = raycaster.ray.intersectPlane(planeYZ, new THREE.Vector3());

    // 교점 거리 계산
    // const distanceXY = intersectXY ? camera.position.distanceTo(intersectXY) : 0;
    // const distanceXZ = intersectXZ ? camera.position.distanceTo(intersectXZ) : 0;
    // const distanceYZ = intersectYZ ? camera.position.distanceTo(intersectYZ) : 0;

    // 거리 기반으로 scale 계산
    // const scaleXY = this.getScaleByDistance(distanceXY);
    // const scaleXZ = this.getScaleByDistance(distanceXZ);
    // const scaleYZ = this.getScaleByDistance(distanceYZ);

    // 그리드의 scale 적용
    // this.gridXY.scale.set(scaleXY, scaleXY, scaleXY);
    // this.gridXZ.scale.set(scaleXZ, scaleXZ, scaleXZ);
    // this.gridYZ.scale.set(scaleYZ, scaleYZ, scaleYZ);
  }

  private getScaleByDistance(distance: number): number {
    if (distance < 1) {
      return 0.5;
    } else if (distance < 20) {
      return 2;
    } else if (distance < 50) {
      return 4;
    } else if (distance < 100) {
      return 8;
    } else if (distance < 200) {
      return 16;
    } else if (distance < 300) {
      return 32;
    } else if (distance < 400) {
      return 32;
    } else {
      return Math.trunc(distance / 10);
    }
  }

  public changeSize = (size: number, divisions: number): void => {
    this.gridXZ.dispose();
    this.gridXZ.removeFromParent();
    this.subGridXZ.dispose();
    this.subGridXZ.removeFromParent();
    this.gridXY.dispose();
    this.gridXY.removeFromParent();
    this.subGridXY.dispose();
    this.subGridXY.removeFromParent();
    this.gridYZ.dispose();
    this.gridYZ.removeFromParent();
    this.subGridYZ.dispose();
    this.subGridYZ.removeFromParent();

    this.gridXZ = this.createGrid(
      size,
      divisions / 5,
      0.5,
      new THREE.Color(0xff2244),
      new THREE.Color(0x4488ff),
      new THREE.Color(GRID_COLOR[0])
    );
    this.subGridXZ = this.createGrid(
      size,
      divisions,
      0.5,
      new THREE.Color(0xff2244),
      new THREE.Color(0x4488ff),
      new THREE.Color(GRID_COLOR[1])
    );

    this.add(this.subGridXZ);
    this.add(this.gridXZ);

    // 기존 코드 보존
    // this.gridXY = new THREE.GridHelper(
    //   size,
    //   divisions,
    //   this.GRID_COLORS_XY[0],
    //   this.GRID_COLORS_XY[1]
    // );
    // this.gridXY.material.opacity = opacity;
    // this.gridXY.material.transparent = true;
    // this.gridXY.rotation.x = Math.PI / 2;
    // this.gridXY.frustumCulled = false;
    this.gridXY = this.createGrid(
      size,
      divisions / 5,
      0.5,
      new THREE.Color(0xff2244),
      new THREE.Color(0x88ff44),
      new THREE.Color(GRID_COLOR[0])
    );
    this.subGridXY = this.createGrid(
      size,
      divisions / 5,
      0.5,
      new THREE.Color(0xff2244),
      new THREE.Color(0x88ff44),
      new THREE.Color(GRID_COLOR[1])
    );
    this.gridXY.rotation.x = Math.PI / 2;
    this.add(this.gridXY);
    this.add(this.subGridXY);
    // 기존 코드 보존
    // this.gridYZ = new THREE.GridHelper(
    //   size,
    //   divisions,
    //   this.GRID_COLORS_YZ[0],
    //   this.GRID_COLORS_YZ[1]
    // );
    // this.gridYZ.material.opacity = opacity;
    // this.gridYZ.material.transparent = true;
    // this.gridYZ.rotation.z = Math.PI / 2;
    // this.gridYZ.frustumCulled = false;
    this.gridYZ = this.createGrid(
      size,
      divisions / 5,
      0.5,
      new THREE.Color(0xff2244),
      new THREE.Color(0x88ff44),
      new THREE.Color(GRID_COLOR[0])
    );
    this.subGridYZ = this.createGrid(
      size,
      divisions,
      0.5,
      new THREE.Color(0xff2244),
      new THREE.Color(0x88ff44),
      new THREE.Color(GRID_COLOR[1])
    );

    this.gridYZ.rotation.z = Math.PI / 2;
    this.subGridYZ.rotation.z = Math.PI / 2;
    this.add(this.subGridYZ);
    this.add(this.gridYZ);

    this.showXY = this._showXY;
    this.showXZ = this._showXZ;
    this.showYZ = this._showYZ;
  };

  get showXY(): boolean {
    return this._showXY;
  }
  set showXY(value: boolean) {
    this._showXY = value;
    this.subGridXY.visible = value;
    this.gridXY.visible = value;
  }

  get showXZ(): boolean {
    return this._showXZ;
  }
  set showXZ(value: boolean) {
    this._showXZ = value;
    this.subGridXZ.visible = value;
    this.gridXZ.visible = value;
  }

  get showYZ(): boolean {
    return this._showYZ;
  }
  set showYZ(value: boolean) {
    this._showYZ = value;
    this.subGridYZ.visible = value;
    this.gridYZ.visible = value;
  }

  public dispose(): void {
    this.gridXY.dispose();
    this.gridXZ.dispose();
    this.gridYZ.dispose();
  }
}
