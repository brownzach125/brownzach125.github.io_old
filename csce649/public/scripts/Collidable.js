/// <reference path="./Object2.ts" />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Collidable = (function (_super) {
    __extends(Collidable, _super);
    function Collidable() {
        _super.call(this);
        var box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ color: 0x000000 }));
        box.position.copy(new THREE.Vector3(0, 0, -10));
        this.object3D = box;
    }
    return Collidable;
})(Object2);
//# sourceMappingURL=Collidable.js.map