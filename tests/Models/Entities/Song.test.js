"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var Song_1 = require("../../../src/ts/Models/Entities/Song");
describe('Songエンティティクラスのテスト', function () {
    it('ソングIDの手動割り当て', function () {
        var song1 = new Song_1.default('sinatra01', 'New York, New York');
        chai.assert.isString(song1.Id);
        chai.assert.isNotNull(song1.Id);
        chai.assert.equal('sinatra01', song1.Id);
        chai.assert.equal('New York, New York', song1.Name);
    });
    it('ソングIDの自動割り当て', function () {
        var song2 = new Song_1.default(null, 'Stranger in the Night');
        chai.assert.isString(song2.Id);
        chai.assert.isNotNull(song2.Id);
        chai.assert.equal('Stranger in the Night', song2.Name);
    });
});
//# sourceMappingURL=Song.test.js.map